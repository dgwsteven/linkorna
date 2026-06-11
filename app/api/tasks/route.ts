import { NextResponse } from "next/server";
import { employees } from "@/lib/data";
import { buildAccessState, canRunEmployee } from "@/lib/access-control";
import { createRequestClient } from "@/lib/supabase/request";
import { generateTaskOutput } from "@/lib/ai-generation";
import { formDataToInput } from "@/lib/task-input";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const employeeId = url.searchParams.get("employeeId") || "german-email";
  const employee = employees.find((item) => item.id === employeeId) ?? employees[0];

  const { supabase, user, source } = await createRequestClient(request);
  const cookieHeader = request.headers.get("cookie") || "";
  const authorizationHeader = request.headers.get("authorization") || "";
  const cookieNames = cookieHeader
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter(Boolean);

  if (!user) {
    return NextResponse.json(
      {
        error: "Authentication required",
        phase: "auth",
        authSource: source,
        host: request.headers.get("host"),
        hasCookieHeader: Boolean(cookieHeader),
        hasAuthorizationHeader: Boolean(authorizationHeader),
        cookieNames
      },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();

  if (!profile?.workspace_id) {
    return NextResponse.json({ error: "Workspace profile not found", phase: "profile" }, { status: 400 });
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [{ data: workspace }, { count: monthlyUsed }] = await Promise.all([
    supabase
      .from("workspaces")
      .select("*")
      .eq("id", profile.workspace_id)
      .single(),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", profile.workspace_id)
      .gte("created_at", monthStart.toISOString())
  ]);

  const access = buildAccessState({
    email: user.email,
    workspace,
    monthlyUsed: monthlyUsed ?? 0
  });
  const permission = canRunEmployee(access, employee.plan);

  if (!permission.allowed) {
    return NextResponse.json(
      {
        error: permission.reason,
        phase: "access",
        upgradeUrl: "/billing",
        access
      },
      { status: 402 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  const isMultipart = contentType.includes("multipart/form-data");
  const body = isMultipart ? null : await request.json().catch(() => ({}));
  const formData = isMultipart ? await request.formData() : null;
  const formInput = formData ? await formDataToInput(formData) : null;
  const input = formInput || (typeof body.input === "object" && body.input !== null ? body.input : body);
  const output = await generateTaskOutput(employee.id, input);

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      workspace_id: profile.workspace_id,
      user_id: user.id,
      employee_id: employee.id,
      title: output.title,
      input,
      output,
      status: "completed"
    })
    .select("id")
    .single();

  if (error || !task?.id) {
    return NextResponse.json({ error: "Task could not be saved" }, { status: 500 });
  }

  return NextResponse.json({
    id: task.id,
    status: "completed",
    taskUrl: `/tasks/${task.id}`,
    employee: {
      id: employee.id,
      name: employee.name,
      plan: employee.plan
    },
    output
  });
}
