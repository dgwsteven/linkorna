import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { employees } from "@/lib/data";
import { buildTaskOutput, type GeneratedTaskOutput } from "@/lib/task-output";

const strongEmployees = new Set(["contract", "competitor", "meeting"]);

function modelNameForEmployee(employeeId: string) {
  if (strongEmployees.has(employeeId)) {
    return process.env.LINKORNA_STRONG_MODEL || process.env.LINKORNA_OPENAI_MODEL || "gpt-5.4";
  }

  return process.env.LINKORNA_FAST_MODEL || process.env.LINKORNA_OPENAI_MODEL || "gpt-5-mini";
}

function gatewayModelNameForEmployee(employeeId: string) {
  if (strongEmployees.has(employeeId)) {
    return process.env.LINKORNA_GATEWAY_STRONG_MODEL || process.env.LINKORNA_AI_MODEL || "openai/gpt-5.4";
  }

  return process.env.LINKORNA_GATEWAY_FAST_MODEL || "openai/gpt-5-mini";
}

function getModel(employeeId: string) {
  if (process.env.OPENAI_API_KEY) {
    return openai(modelNameForEmployee(employeeId));
  }

  return gatewayModelNameForEmployee(employeeId);
}

function safeInputForPrompt(input: Record<string, unknown>) {
  return JSON.stringify(input, null, 2).slice(0, 12000);
}

function employeeBrief(employeeId: string) {
  const shared =
    "You are LINKORNA, a practical AI employee for cross-border business users. Generate useful, concrete, non-investor-facing operational work. Return only valid JSON.";

  const briefs: Record<string, string> = {
    "german-email":
      "German Email Employee. Read the original German client email and business context. The direct reply section must be written in German so the user can copy it into email. If the output package mentions Chinese, or unless the user clearly asks otherwise, write the explanation, diagnosis, intent analysis, risk/opportunity notes and next steps in Chinese for the Chinese-speaking operator.",
    contract:
      "Contract Intelligence Employee. Review uploaded/pasted contract material. The output audience controls language and tone. Diagnosis should stay concise, but the output report can be detailed with clause-level actions and client-facing wording.",
    supplier:
      "Supplier Communication Employee. Generate supplier-ready communication in the selected target language. The first output section must be the supplier email itself. Then explain key points for the user and recommend next actions.",
    listing:
      "E-commerce Listing Employee. Generate marketplace-ready listing copy. Platform, target language and positioning must affect strategy, title, bullets, description, keywords and FAQ. Do not include improvement notes that imply the output is unfinished.",
    competitor:
      "Competitor Intelligence Employee. Compare competitor link/material with the user's product link or description. Focus on gaps, pricing, keywords, review pain points and actions that can be sent to the Listing Employee.",
    meeting:
      "Meeting Recorder Employee. Generate meeting minutes from transcript/context/files. Detail level must control depth. For Detailed minutes, write a complete, premium-quality meeting record with decisions, risks, open questions and action owners."
  };

  return `${shared}\n${briefs[employeeId] || "General LINKORNA AI employee."}`;
}

function parseJsonOutput(text: string): GeneratedTaskOutput | null {
  try {
    return JSON.parse(text) as GeneratedTaskOutput;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(text.slice(start, end + 1)) as GeneratedTaskOutput;
    } catch {
      return null;
    }
  }
}

function normalizeOutput(employeeId: string, output: GeneratedTaskOutput | null, fallback: GeneratedTaskOutput) {
  if (!output || !Array.isArray(output.sections) || output.sections.length === 0) {
    return fallback;
  }

  const employee = employees.find((item) => item.id === employeeId);
  return {
    title: output.title || fallback.title || `${employee?.name || "LINKORNA"} task`,
    summary: output.summary || fallback.summary,
    copySectionLabel: output.copySectionLabel || fallback.copySectionLabel,
    downloadLabel: output.downloadLabel || fallback.downloadLabel,
    sections: output.sections
      .filter((section) => section?.label && section?.body)
      .map((section) => ({
        label: String(section.label),
        body: String(section.body)
      }))
  };
}

export async function generateTaskOutput(employeeId: string, input: Record<string, unknown>): Promise<GeneratedTaskOutput> {
  const fallback = buildTaskOutput(employeeId, input);

  try {
    const { text } = await generateText({
      model: getModel(employeeId),
      system: employeeBrief(employeeId),
      prompt: `Create the task output from this submitted form data:\n${safeInputForPrompt(input)}\n\nReturn JSON with exactly this shape:\n{\n  "title": "short task title",\n  "summary": "one concise summary sentence",\n  "copySectionLabel": "which section should be copied by the primary copy button",\n  "downloadLabel": "Download Word Report or Download Word Version",\n  "sections": [\n    { "label": "section title", "body": "full useful section content" }\n  ]\n}\n\nQuality rules:\n- Respect selected language/audience/positioning/detail level.\n- Write enough detail to be genuinely useful for a paying business user.\n- Include the diagnostic guidance, key points, recommended next actions, and final usable output that would normally appear in the employee preview.\n- Keep diagnosis-style sections concise when appropriate.\n- Do not mention that you are an AI model.\n- Do not include markdown code fences.`,
      maxOutputTokens: 2500
    });

    return normalizeOutput(employeeId, parseJsonOutput(text), fallback);
  } catch (error) {
    console.error("AI generation failed, using fallback output", error);
    return fallback;
  }
}
