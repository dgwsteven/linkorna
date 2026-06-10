"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { generateTaskOutput } from "@/lib/ai-generation";
import { createClient } from "@/lib/supabase/server";
import { formDataToInput } from "@/lib/task-input";

export async function submitEmployeeTask(employeeId: string, formData: FormData) {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    if (host.includes("127.0.0.1") || host.includes("localhost")) {
      redirect(`https://linkorna.com/login?message=${encodeURIComponent("Please login on linkorna.com. Local preview and production do not share login sessions.")}&next=/employees/${employeeId}`);
    }
    redirect(`/login?message=Please%20login%20before%20generating%20a%20task.&next=/employees/${employeeId}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.workspace_id) {
    redirect("/dashboard?message=Workspace%20profile%20not%20found.");
  }

  const input = await formDataToInput(formData);
  const output = await generateTaskOutput(employeeId, input);

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      workspace_id: profile.workspace_id,
      user_id: user.id,
      employee_id: employeeId,
      title: output.title,
      input,
      output,
      status: "completed"
    })
    .select("id")
    .single();

  if (error || !task?.id) {
    redirect(`/employees/${employeeId}?message=Task%20could%20not%20be%20saved.`);
  }

  redirect(`/tasks/${task.id}`);
}
