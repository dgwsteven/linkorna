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

function contractFallbackOutput(input: Record<string, unknown>, fallback: GeneratedTaskOutput, reason: unknown): GeneratedTaskOutput {
  console.error("Contract AI generation failed, using text-based fallback", reason);
  const audience = stringValue(input, "audience", "Chinese internal team - Chinese risk memo");
  const objective = stringValue(input, "reviewObjective", "Pre-signing risk review");
  const riskTolerance = stringValue(input, "riskTolerance", "Balanced business review");
  const material = contractMaterial(input);
  const lines = readableLines(material, 10);

  if (!material) {
    return {
      ...fallback,
      summary: "No readable contract text was found. Please upload a text-readable DOCX/TXT file or paste the contract clauses.",
      copySectionLabel: "Contract processing issue",
      sections: [
        {
          label: "Contract processing issue",
          body:
            "The uploaded file did not contain readable text for analysis. Please paste the contract text into the text box, or upload a text-readable DOCX/TXT file. Scanned PDF images need OCR before this employee can review them."
        }
      ]
    };
  }

  const isGerman = audience.includes("German");
  const isEnglish = audience.includes("English");
  const diagnosisLabel = isGerman ? "Vertragsdiagnose" : isEnglish ? "Contract diagnosis" : "合同诊断";
  const actionLabel = isGerman ? "Klauselbezogene Pruefpunkte" : isEnglish ? "Clause-level review points" : "逐条审查要点";
  const wordingLabel = isGerman ? "Kundenfreundliche Formulierung" : isEnglish ? "Client-facing wording" : "对外沟通措辞";
  const evidenceLabel = isGerman ? "Gelesene Vertragsauszuege" : isEnglish ? "Readable contract excerpts" : "已读取的合同片段";

  return {
    title: "Contract Intelligence Employee task",
    summary: `Contract review generated for ${audience}. Objective: ${objective}.`,
    copySectionLabel: wordingLabel,
    downloadLabel: "Download Word Report",
    sections: [
      {
        label: diagnosisLabel,
        body: isGerman
          ? `Der Vertrag wurde aus dem hochgeladenen oder eingefuegten Text gelesen. Pruefmodus: ${objective}; Risikotoleranz: ${riskTolerance}. Prioritaet haben Zahlungsbedingungen, Lieferung, Abnahme, Haftung, Gewaehrleistung, Kuendigung und Streitbeilegung.`
          : isEnglish
            ? `The contract text was read from the uploaded or pasted material. Review mode: ${objective}; risk tolerance: ${riskTolerance}. Priority areas are payment, delivery, acceptance, liability, warranty, termination and dispute resolution.`
            : `已经从上传文件或粘贴文本中读取到合同内容。本次审查目标：${objective}；风险口径：${riskTolerance}。优先检查付款、交付、验收、责任、质保、解除、争议解决等核心条款。`
      },
      {
        label: actionLabel,
        body: isGerman
          ? "1. Zahlungsmeilensteine, Faelligkeit und Folgen bei Zahlungsverzug klarer definieren.\n2. Lieferort, Incoterms, Lieferdokumente und Gefahruebergang eindeutig festlegen.\n3. Abnahmefrist, Maengelanzeige und stillschweigende Abnahme regeln.\n4. Haftungsobergrenze, indirekte Schaeden und Vertragsstrafe getrennt pruefen.\n5. Gewaehrleistung, Ersatzlieferung, Nachbesserung und Ausschlussfristen konkretisieren.\n6. Kuendigung, Force Majeure und Streitbeilegung auf Durchsetzbarkeit pruefen."
          : isEnglish
            ? "1. Clarify payment milestones, due dates and consequences of late payment.\n2. Define delivery location, Incoterms, delivery documents and risk transfer.\n3. Add acceptance window, defect notice procedure and deemed acceptance language.\n4. Review liability cap, indirect damages and penalty exposure separately.\n5. Specify warranty, replacement, repair and claim deadlines.\n6. Check termination, force majeure and dispute resolution for enforceability."
            : "1. 明确付款节点、到期时间、逾期付款后果。\n2. 明确交付地点、Incoterms、交付文件、风险转移时间。\n3. 增加验收期限、瑕疵通知流程、未反馈是否视为验收通过。\n4. 单独审查责任上限、间接损失、违约金或罚则。\n5. 明确质保、换货、维修、索赔期限。\n6. 检查解除、不可抗力、争议解决条款是否可执行。"
      },
      {
        label: wordingLabel,
        body: isGerman
          ? "Zur Vermeidung spaeterer Missverstaendnisse schlagen wir vor, Zahlungsmeilensteine, Abnahmeverfahren, Lieferdokumente und Haftungsbegrenzung vor Unterzeichnung noch einmal konkret zu ergaenzen."
          : isEnglish
            ? "To avoid later misunderstandings, we suggest clarifying payment milestones, acceptance procedure, delivery documentation and liability limitation before signing."
            : "建议对外沟通时使用中性表达：为避免后续执行争议，建议在签署前进一步明确付款节点、验收流程、交付文件以及责任上限。"
      },
      {
        label: evidenceLabel,
        body: lines.length ? lines.map((line, index) => `${index + 1}. ${line}`).join("\n") : material.slice(0, 1200)
      }
    ]
  };
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
    "You are LINKORNA, a practical AI employee for cross-border business users. Generate useful, concrete, non-investor-facing operational work. Return only valid JSON.";

  const briefs: Record<string, string> = {
    "german-email":
      "German Email Employee. Read the original German client email and business context. The direct reply section must be written in German so the user can copy it into email. If the output package mentions Chinese, or unless the user clearly asks otherwise, write the explanation, diagnosis, intent analysis, risk/opportunity notes and next steps in Chinese for the Chinese-speaking operator.",
    contract:
      "Contract Intelligence Employee. Review uploaded/pasted contract material. The output audience controls language and tone. Diagnosis should stay concise, but the output report can be detailed with clause-level actions and client-facing wording.",
    supplier:
      "Supplier Communication Employee. Generate supplier-ready communication in the selected target language. Do not force a rigid template. Adapt the message to the user's task, product, quantity, timeline, red lines and selected communication goal. The first output section must be the supplier email itself, written as a natural business email that emphasizes the user's concrete priorities. Then explain key points for the user and recommend next actions.",
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

function failedContractOutput(fallback: GeneratedTaskOutput, error: unknown): GeneratedTaskOutput {
  console.error("Contract AI generation failed without fallback", error);
  return {
    ...fallback,
    summary: "Contract analysis did not complete. Please check the uploaded file text or model configuration and try again.",
    copySectionLabel: "Contract processing issue",
    sections: [
      {
        label: "Contract processing issue",
        body:
          "The contract employee could not produce a real contract analysis for this submission. Please paste the contract text directly, or upload a text-readable DOCX/TXT file and try again. If this repeats, check the strong model environment variable in Vercel."
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
      prompt: `Create the task output from this submitted form data:\n${safeInputForPrompt(input)}\n\nReturn JSON with exactly this shape:\n{\n  "title": "short task title",\n  "summary": "one concise summary sentence",\n  "copySectionLabel": "which section should be copied by the primary copy button",\n  "downloadLabel": "Download Word Report or Download Word Version",\n  "sections": [\n    { "label": "section title", "body": "full useful section content" }\n  ]\n}\n\nQuality rules:\n- Respect selected language/audience/positioning/detail level.\n- Write enough detail to be genuinely useful for a paying business user.\n- Include the diagnostic guidance, key points, recommended next actions, and final usable output that would normally appear in the employee preview.\n- Keep diagnosis-style sections concise when appropriate.\n- For supplier messages, vary the email based on communication goal, product, timeline, quantity and requirements. Avoid generic RFQ boilerplate when the user gave specific priorities.\n- For contract and competitor tasks, analyze only the submitted material. If a link cannot be opened, say what can be inferred from the pasted link/context and what the user should add next.\n- Do not mention that you are an AI model.\n- Do not include markdown code fences.`,
      maxOutputTokens: strongEmployees.has(employeeId) ? 3500 : 2500,
      abortSignal: AbortSignal.timeout(strongEmployees.has(employeeId) ? 60000 : 35000)
    });

    const parsedOutput = parseJsonOutput(text);
    if (employeeId === "contract" && (!parsedOutput || !Array.isArray(parsedOutput.sections) || parsedOutput.sections.length === 0)) {
      return contractFallbackOutput(input, fallback, "The model did not return valid JSON output.");
    }
    if (employeeId === "competitor" && (!parsedOutput || !Array.isArray(parsedOutput.sections) || parsedOutput.sections.length === 0)) {
      return competitorFallbackOutput(input, fallback, "The model did not return valid JSON output.");
    }
    return normalizeOutput(employeeId, parsedOutput, fallback);
  } catch (error) {
    console.error("AI generation failed, using fallback output", error);
    if (employeeId === "contract") {
      return contractFallbackOutput(input, fallback, error);
    }
    if (employeeId === "competitor") {
      return competitorFallbackOutput(input, fallback, error);
    }
    return fallback;
  }
}
