import { NextResponse } from "next/server";
import { employees } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { buildTaskOutput } from "@/lib/task-output";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const employeeId = typeof body.employeeId === "string" ? body.employeeId : "german-email";
  const employee = employees.find((item) => item.id === employeeId) ?? employees[0];
  const input = typeof body.input === "object" && body.input !== null ? body.input : body;
  const output = buildTaskOutput(employee.id, input);

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();

  if (!profile?.workspace_id) {
    return NextResponse.json({ error: "Workspace profile not found" }, { status: 400 });
  }

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
