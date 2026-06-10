"use server";

import { redirect } from "next/navigation";
import { generateTaskOutput } from "@/lib/ai-generation";
import { createClient } from "@/lib/supabase/server";

async function extractFileValue(file: File) {
  const base = {
    name: file.name,
    size: file.size,
    type: file.type
  };

  try {
    const lowerName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (lowerName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return { ...base, extractedText: result.value.slice(0, 30000) };
    }

    if (lowerName.endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return { ...base, extractedText: result.text.slice(0, 30000) };
    }

    const text = buffer.toString("utf8");
    return { ...base, extractedText: text.slice(0, 30000) };
  } catch (error) {
    console.error("File extraction failed", error);
    return {
      ...base,
      extractionError: "Could not extract file text. Ask the user to paste the relevant contract text."
    };
  }
}

async function formDataToInput(formData: FormData) {
  const input: Record<string, unknown> = {};

  for (const [key, item] of Array.from(formData.entries())) {
    if (key.startsWith("$ACTION_")) continue;

    const addValue = (value: unknown) => {
      if (input[key] === undefined) {
        input[key] = value;
        return;
      }
      input[key] = Array.isArray(input[key]) ? [...input[key], value] : [input[key], value];
    };

    if (item instanceof File) {
      if (item.name) {
        addValue(await extractFileValue(item));
      }
      continue;
    }
    addValue(item);
  }

  return input;
}

export async function submitEmployeeTask(employeeId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please%20login%20before%20generating%20a%20task.");
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
