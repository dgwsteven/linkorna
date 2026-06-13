import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { employees } from "@/lib/data";
import { buildTaskOutput, type GeneratedTaskOutput } from "@/lib/task-output";

const strongEmployees = new Set(["contract", "competitor", "meeting"]);

function normalizeOpenAIModelName(raw: string | undefined, fallback: string) {
  const value = (raw || fallback).trim();
  const compact = value.toLowerCase().replace(/\s+/g, "-");

  if (compact === "5.4" || compact === "gpt-5.4") return "gpt-5.4";
  if (compact === "5.4-mini" || compact === "gpt-5.4-mini") return "gpt-5.4-mini";
  if (compact === "5-mini" || compact === "gpt-5-mini") return "gpt-5-mini";
  if (compact.startsWith("gpt-")) return compact;
  return value;
}

function normalizeGatewayModelName(raw: string | undefined, fallback: string) {
  const model = normalizeOpenAIModelName(raw?.replace(/^openai\//, ""), fallback.replace(/^openai\//, ""));
  return model.startsWith("openai/") ? model : `openai/${model}`;
}

function modelNameForEmployee(employeeId: string) {
  if (strongEmployees.has(employeeId)) {
    return normalizeOpenAIModelName(process.env.LINKORNA_STRONG_MODEL || process.env.LINKORNA_OPENAI_MODEL, "gpt-5.4");
  }

  return normalizeOpenAIModelName(process.env.LINKORNA_FAST_MODEL || process.env.LINKORNA_OPENAI_MODEL, "gpt-5-mini");
}

function gatewayModelNameForEmployee(employeeId: string) {
  if (strongEmployees.has(employeeId)) {
    return normalizeGatewayModelName(process.env.LINKORNA_GATEWAY_STRONG_MODEL || process.env.LINKORNA_AI_MODEL, "openai/gpt-5.4");
  }

  return normalizeGatewayModelName(process.env.LINKORNA_GATEWAY_FAST_MODEL, "openai/gpt-5-mini");
}

function getModel(employeeId: string) {
  if (process.env.OPENAI_API_KEY) {
    return openai(modelNameForEmployee(employeeId));
  }

  return gatewayModelNameForEmployee(employeeId);
}

function safeInputForPrompt(input: Record<string, unknown>) {
  return JSON.stringify(input, null, 2).slice(0, 22000);
}

function stringValue(input: Record<string, unknown>, key: string, fallback = "") {
  const value = input[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function collectExtractedText(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => collectExtractedText(item));
  if (typeof value === "object") {
    const item = value as Record<string, unknown>;
    const name = typeof item.name === "string" ? `\n\n[${item.name}]\n` : "";
    const extractedText = typeof item.extractedText === "string" ? item.extractedText.trim() : "";
    return extractedText ? [`${name}${extractedText}`] : [];
  }
  return [];
}

function contractMaterial(input: Record<string, unknown>) {
  return [stringValue(input, "contractText"), ...collectExtractedText(input.contractFiles)].filter(Boolean).join("\n\n").slice(0, 30000);
}

function readableLines(text: string, maxLines = 8) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 24)
    .slice(0, maxLines);
}

function competitorFallbackOutput(input: Record<string, unknown>, fallback: GeneratedTaskOutput, reason: unknown): GeneratedTaskOutput {
  console.error("Competitor AI generation failed, using structured fallback", reason);
  const goal = stringValue(input, "goal", "Improve my listing");
  const marketplace = stringValue(input, "marketplace", "Amazon Germany");
  const competitorLink = stringValue(input, "competitorLink", "No competitor link provided");
  const ownProduct = stringValue(input, "ownProduct", "No own product description provided");
  const targetPrice = stringValue(input, "targetPrice", "Not specified");

  return {
    ...fallback,
    title: "Competitor Intelligence Employee task",
    summary: `Competitor analysis generated for ${goal} on ${marketplace}.`,
    copySectionLabel: "Transfer to Listing Employee",
    downloadLabel: "Download Word Report",
    sections: [
      {
        label: "Competitor summary",
        body: `Marketplace: ${marketplace}\nGoal: ${goal}\nCompetitor link: ${competitorLink}\nYour product/link: ${ownProduct}\nTarget price: ${targetPrice}`
      },
      {
        label: "Gap analysis",
        body:
          "Compare the competitor's title order, first image promise, bullet structure, price position, delivery promise, review objections and trust signals against your own product page. Prioritize gaps that directly affect purchase confidence: compatibility, material proof, package contents, warranty, logistics and FAQ."
      },
      {
        label: "Recommended actions",
        body:
          "1. Put the strongest buyer keyword at the start of the title.\n2. Add clear compatibility or use-case proof.\n3. Turn competitor review objections into your FAQ and image text.\n4. Make warranty, delivery and package contents easier to scan.\n5. Choose one positioning angle before rewriting: practical value, premium quality or price advantage."
      },
      {
        label: "Transfer to Listing Employee",
        body:
          `Reference product link: ${competitorLink}\nMarketplace: ${marketplace}\nPositioning recommendation: Practical value unless your target price is clearly premium.\nUse in Listing Employee: paste this link as the reference product link, then add the strongest gap notes as product features and FAQ inputs.`
      }
    ]
  };
}

function employeeBrief(employeeId: string) {
  const shared =
    "You are LINKORNA, a practical AI employee for cross-border business users. Generate useful, concrete, non-investor-facing operational work. Return only valid JSON. Avoid generic templates. Use the user's submitted facts, quantities, links, constraints, language settings and business context. If information is missing, say exactly what is missing and still produce the best usable output from available material.";

  const briefs: Record<string, string> = {
    "german-email":
      "German Email Employee. Read the original German client email and business context. The direct reply section must be written in German so the user can copy it into email. If operatorLanguage/My language is provided, write explanation, diagnosis, intent analysis, risk/opportunity notes and next steps in that language.",
    contract:
      "Contract Intelligence Employee. Review uploaded/pasted contract material. The output audience controls client-facing language and tone. If operatorLanguage/My language is provided, write internal diagnosis, input summary, key points and recommended next actions in that language. Diagnosis should stay concise, but the output report must be detailed. Include clause-level findings, why each point matters, practical risk level, suggested revision direction, client-facing wording, negotiation priority and missing information. Do not invent clauses that are not present; clearly separate extracted facts from recommended changes.",
    supplier:
      "Supplier Communication Employee. Generate supplier-ready communication in the selected target language/language. Do not force a rigid template. Adapt the message to the user's task, product, quantity, timeline, red lines and selected communication goal. The first output section must be Supplier email and must be written in the target language so it can be copied to the supplier. If operatorLanguage/My language is provided, write input summary, key points, recommended next actions and diagnostic guidance in that language for the user.",
    listing:
      "E-commerce Listing Employee. Generate marketplace-ready listing copy. Platform, target language and positioning must affect strategy, title, bullets, description, keywords and FAQ. Do not include improvement notes that imply the output is unfinished.",
    competitor:
      "Competitor Intelligence Employee. Compare competitor link/material with the user's product link or description. Focus on gaps, pricing, keywords, review pain points and actions that can be sent to the Listing Employee. If only links are provided and web browsing is unavailable, analyze the URL context, marketplace, user observations and submitted product facts, then ask for screenshots or copied listing text for the next pass. Output must include a transfer-ready block for the Listing Employee.",
    meeting:
      "Meeting Recorder Employee. Generate meeting minutes from transcript/context/files. Detail level must control depth. For Detailed minutes, write a complete, premium-quality meeting record with meeting background, participants if known, discussion flow, decisions, open questions, risks, assumptions, action owners, deadlines, dependencies and client-facing follow-up. If transcript text is missing, say that a readable transcript is needed and produce a structured preparation template instead of pretending to know the meeting content."
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

function cleanContractFallbackOutput(input: Record<string, unknown>, fallback: GeneratedTaskOutput, reason: unknown): GeneratedTaskOutput {
  console.error("Contract AI generation failed, using clean contract fallback", reason);
  const audience = stringValue(input, "audience", "Chinese internal team - Chinese risk memo");
  const objective = stringValue(input, "reviewObjective", "Pre-signing risk review");
  const riskTolerance = stringValue(input, "riskTolerance", "Balanced business review");
  const material = contractMaterial(input);
  const lines = readableLines(material, 12);

  if (!material) {
    return {
      ...fallback,
      summary: "No readable contract text was found. Please upload a text-readable DOCX/TXT/readable PDF file or paste the contract clauses.",
      copySectionLabel: "Contract processing issue",
      sections: [
        {
          label: "Contract processing issue",
          body:
            "The contract employee could not read enough contract text from this submission. Please paste the relevant clauses directly, or upload a text-readable DOCX, TXT or readable PDF file. Scanned image PDFs need OCR before review."
        },
        {
          label: "Next step",
          body: "Paste the contract clauses, quotation terms, payment terms, delivery terms and negotiation background, then run the review again."
        }
      ]
    };
  }

  return {
    title: "Contract Intelligence Employee task",
    summary: `Contract review generated for ${audience}. Objective: ${objective}.`,
    copySectionLabel: "Client-facing wording",
    downloadLabel: "Download Word Report",
    sections: [
      {
        label: "Contract diagnosis",
        body: `Readable contract text was found. Review mode: ${objective}; risk tolerance: ${riskTolerance}. Priority areas are payment, delivery, acceptance, liability, warranty, termination and dispute resolution.`
      },
      {
        label: "Clause-level review points",
        body:
          "1. Clarify payment milestones, due dates and late-payment consequences.\n2. Define delivery location, Incoterms, delivery documents and risk transfer.\n3. Add acceptance window, defect notice procedure and deemed acceptance language.\n4. Review liability cap, indirect damages and penalty exposure separately.\n5. Specify warranty, replacement, repair and claim deadlines.\n6. Check termination, force majeure and dispute resolution for enforceability."
      },
      {
        label: "Client-facing wording",
        body: "To avoid later misunderstandings, we suggest clarifying payment milestones, acceptance procedure, delivery documentation and liability limitation before signing."
      },
      {
        label: "Readable contract excerpts",
        body: lines.length ? lines.map((line, index) => `${index + 1}. ${line}`).join("\n") : material.slice(0, 1600)
      }
    ]
  };
}

export async function generateTaskOutput(employeeId: string, input: Record<string, unknown>): Promise<GeneratedTaskOutput> {
  const fallback = buildTaskOutput(employeeId, input);

  try {
    const { text } = await generateText({
      model: getModel(employeeId),
      system: employeeBrief(employeeId),
      prompt: `Create the task output from this submitted form data:\n${safeInputForPrompt(input)}\n\nReturn JSON with exactly this shape:\n{\n  "title": "short task title",\n  "summary": "one concise summary sentence",\n  "copySectionLabel": "which section should be copied by the primary copy button",\n  "downloadLabel": "Download Word Report or Download Word Version",\n  "sections": [\n    { "label": "section title", "body": "full useful section content" }\n  ]\n}\n\nQuality rules:\n- Respect selected language/audience/positioning/detail level.\n- If the submitted form includes operatorLanguage or My language, all user-facing analysis sections such as Input Summary, Key Points, Recommended Next Actions and Diagnostic Guidance must be written in that language.\n- Supplier email sections must be written in the selected target language/language, while the explanation sections must follow operatorLanguage.\n- German Email reply sections must be written in German, while explanation sections must follow operatorLanguage.\n- Contract client-facing comments must follow the selected output audience, while internal analysis sections must follow operatorLanguage.\n- Write enough detail to be genuinely useful for a paying business user.\n- Start with the most usable final output, then provide diagnosis, key points and next actions.\n- Keep diagnosis-style sections concise, but make final report sections rich enough to download and share.\n- For supplier messages, vary the email based on communication goal, product, timeline, quantity, target price, relationship and red lines. Avoid generic RFQ boilerplate when the user gave specific priorities.\n- For listing, use target buyer, selling angle, reference link and claims-to-avoid. Do not include improvement notes that imply the output is unfinished.\n- For contract, include clause-level action items and client-ready wording. If readable contract text is missing, clearly explain the missing material and ask for DOCX/TXT/readable PDF or pasted clauses.\n- For competitor tasks, analyze only submitted material. If a link cannot be opened, say what can be inferred from the pasted link/context and what the user should add next.\n- For meeting tasks, do not pretend audio/video was transcribed. If no transcript or notes are present, produce a meeting-report template and ask for readable transcript.\n- Do not mention that you are an AI model.\n- Do not include markdown code fences.`,
      maxOutputTokens: strongEmployees.has(employeeId) ? 5200 : 2600,
      abortSignal: AbortSignal.timeout(strongEmployees.has(employeeId) ? 90000 : 35000)
    });

    const parsedOutput = parseJsonOutput(text);
    if (employeeId === "contract" && (!parsedOutput || !Array.isArray(parsedOutput.sections) || parsedOutput.sections.length === 0)) {
      return cleanContractFallbackOutput(input, fallback, "The model did not return valid JSON output.");
    }
    if (employeeId === "competitor" && (!parsedOutput || !Array.isArray(parsedOutput.sections) || parsedOutput.sections.length === 0)) {
      return competitorFallbackOutput(input, fallback, "The model did not return valid JSON output.");
    }
    return normalizeOutput(employeeId, parsedOutput, fallback);
  } catch (error) {
    console.error("AI generation failed, using fallback output", error);
    if (employeeId === "contract") {
      return cleanContractFallbackOutput(input, fallback, error);
    }
    if (employeeId === "competitor") {
      return competitorFallbackOutput(input, fallback, error);
    }
    return fallback;
  }
}
