import { notFound } from "next/navigation";
import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, ShadingType, TextRun } from "docx";
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

function paragraphsFromBody(body: string) {
  return String(body)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 180 },
          indent: /^\d+\./.test(line) ? { left: 360 } : undefined
        })
    );
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
    styles: {
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 36,
            bold: true,
            color: "071B4D"
          },
          paragraph: {
            spacing: { after: 260 }
          }
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 26,
            bold: true,
            color: "071B4D"
          },
          paragraph: {
            spacing: { before: 300, after: 160 }
          }
        }
      ]
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.LEFT
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "LINKORNA AI Employee Report", bold: true, color: "1F6FEB", size: 22 })
            ],
            spacing: { after: 120 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `AI employee: ${employee?.name ?? task.employee_id}`, bold: true, size: 20 }),
              new TextRun({ text: `   |   Generated: ${new Date(task.created_at).toLocaleString("en-GB")}`, size: 20 })
            ],
            spacing: { after: 220 }
          }),
          new Paragraph({
            children: [new TextRun({ text: output?.summary || "", size: 22 })],
            spacing: { after: 360 },
            shading: {
              type: ShadingType.CLEAR,
              fill: "F4F7FB"
            },
            border: {
              left: { style: BorderStyle.SINGLE, color: "22C55E", size: 12 }
            },
            indent: { left: 240 }
          }),
          ...sections.flatMap((section) => [
            new Paragraph({
              text: section.label,
              heading: HeadingLevel.HEADING_1
            }),
            ...paragraphsFromBody(section.body)
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
