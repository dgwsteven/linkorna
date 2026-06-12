import { notFound } from "next/navigation";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { employees } from "@/lib/data";
import { createRequestClient } from "@/lib/supabase/request";
import type { GeneratedTaskOutput } from "@/lib/task-output";

type TaskRecord = {
  id: string;
  title: string;
  status: string;
  employee_id: string;
  workspace_id: string;
  output: GeneratedTaskOutput | null;
  created_at: string;
};

function safeFileName(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "linkorna-report";
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await createRequestClient(request);

  if (!user) {
    return new Response("Authentication required", { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();
  if (!profile?.workspace_id) {
    return new Response("Workspace profile not found", { status: 400 });
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id,title,status,employee_id,workspace_id,output,created_at")
    .eq("id", id)
    .eq("workspace_id", profile.workspace_id)
    .single<TaskRecord>();

  if (!task) {
    notFound();
  }

  const employee = employees.find((item) => item.id === task.employee_id);
  const output = task.output;
  const title = task.title || output?.title || "LINKORNA Report";
  const sections = Array.isArray(output?.sections) ? output.sections : [];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `AI employee: ${employee?.name ?? task.employee_id}`, bold: true }),
              new TextRun({ text: `\nGenerated: ${new Date(task.created_at).toLocaleString("en-GB")}` })
            ]
          }),
          new Paragraph({
            text: output?.summary || "",
            spacing: { after: 360 }
          }),
          ...sections.flatMap((section) => [
            new Paragraph({
              text: section.label,
              heading: HeadingLevel.HEADING_1
            }),
            ...String(section.body)
              .split(/\n+/)
              .filter(Boolean)
              .map(
                (line) =>
                  new Paragraph({
                    text: line,
                    spacing: { after: 180 }
                  })
              )
          ])
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${safeFileName(title)}.docx"`
    }
  });
}
