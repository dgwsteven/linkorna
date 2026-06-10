import { NextResponse } from "next/server";
import { employees } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { generateTaskOutput } from "@/lib/ai-generation";
import { formDataToInput } from "@/lib/task-input";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const employeeId = url.searchParams.get("employeeId") || "german-email";
  const employee = employees.find((item) => item.id === employeeId) ?? employees[0];

  const supabase = await createClient();
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieNames = cookieHeader
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter(Boolean);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Authentication required",
        phase: "auth",
        host: request.headers.get("host"),
        hasCookieHeader: Boolean(cookieHeader),
        cookieNames
      },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();

  if (!profile?.workspace_id) {
    return NextResponse.json({ error: "Workspace profile not found", phase: "profile" }, { status: 400 });
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
