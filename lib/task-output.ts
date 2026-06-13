import { employees } from "@/lib/data";

export type TaskOutputSection = {
  label: string;
  body: string;
};

export type GeneratedTaskOutput = {
  title: string;
  summary: string;
  sections: TaskOutputSection[];
  copySectionLabel: string;
  downloadLabel: string;
};

function value(input: Record<string, unknown>, key: string, fallback: string) {
  const item = input[key];
  return typeof item === "string" && item.trim() ? item.trim() : fallback;
}

export function buildTaskOutput(employeeId: string, input: Record<string, unknown>): GeneratedTaskOutput {
  const employee = employees.find((item) => item.id === employeeId);
  const title = employee ? `${employee.name} task` : "LINKORNA task";

  if (employeeId === "contract") {
    const audience = value(input, "audience", "Chinese internal team - Chinese risk memo");
    const isGerman = audience.includes("German");
    const isEnglish = audience.includes("English");

    return {
      title,
      summary: `Contract review generated for ${audience}.`,
      copySectionLabel: isGerman ? "Deutsche Kundenkommentare" : isEnglish ? "Client-facing comments" : "Internal risk memo",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: isGerman ? "Deutsche Kundenkommentare" : isEnglish ? "Client-facing comments" : "内部风险摘要",
          body: isGerman
            ? "Wir empfehlen, Zahlungsmeilensteine, Abnahmefrist und Lieferdokumentation klarer zu definieren, damit beide Parteien dieselben operativen Erwartungen haben."
            : isEnglish
              ? "We recommend clarifying payment milestones, acceptance window and delivery documentation so both parties share the same operational expectations."
              : "付款节点、验收期限、交付文件和责任上限需要在签署前进一步明确。建议把内部风险判断和对外客户措辞分开处理。"
        },
        {
          label: "Clause-level actions",
          body: "Review payment terms, Incoterms, inspection procedure, warranty, liability cap, termination and dispute resolution clause by clause."
        },
        {
          label: "Negotiation wording",
          body: "Use neutral, business-friendly wording externally, and keep direct risk language only in the internal memo."
        }
      ]
    };
  }

  if (employeeId === "supplier") {
    const language = value(input, "language", "English");
    const task = value(input, "task", "the requested product");
    const targetUnitPrice = value(input, "targetUnitPrice", "");
    const priceLine = targetUnitPrice ? ` If possible, please also comment on whether a target unit price around ${targetUnitPrice} is realistic.` : "";
    const supplierEmail =
      language === "German"
        ? `Sehr geehrte Damen und Herren, wir pruefen aktuell Lieferanten fuer ${task}. Bitte senden Sie uns ein Angebot mit Stueckpreis, MOQ, Lieferzeit, Zahlungsbedingungen, verfuegbaren Zertifikaten, Verpackungsdetails und Versandoptionen.${priceLine}`
        : language === "Chinese"
          ? `您好，我们正在评估 ${task} 的供应商。请提供单价、MOQ、交期、付款条件、可提供的认证文件、包装信息以及物流方案。${targetUnitPrice ? `如果方便，也请说明目标单价 ${targetUnitPrice} 是否可行。` : ""}`
          : `Dear Supplier, we are currently evaluating suppliers for ${task}. Please provide your quotation, MOQ, lead time, payment terms, available certificates, packaging details and shipping options.${priceLine}`;

    return {
      title,
      summary: `Supplier message generated in ${language}.`,
      copySectionLabel: "Supplier email",
      downloadLabel: "Download Word Report",
      sections: [
        { label: "Supplier email", body: supplierEmail },
        {
          label: "Input summary",
          body: "The request is structured to collect price, MOQ, delivery timing, compliance documents, packaging and logistics in one supplier reply."
        },
        {
          label: "Recommended next actions",
          body: "Compare supplier replies by MOQ, unit price, lead time, certification availability, packaging quality and communication speed before negotiating."
        }
      ]
    };
  }

  if (employeeId === "listing") {
    const marketplace = value(input, "marketplace", "Amazon Germany");
    const language = value(input, "language", "Marketplace default");
    const positioning = value(input, "positioning", "Practical value");
    const productName = value(input, "productName", "Foldable Aluminum Laptop Stand");
    const prefix = language === "German" ? "Verstellbarer Laptopstaender" : language === "Chinese" ? "可折叠铝合金笔记本支架" : productName;

    return {
      title,
      summary: `${marketplace} listing generated with ${positioning} positioning.`,
      copySectionLabel: "SEO title",
      downloadLabel: "Download Word Version",
      sections: [
        { label: "Listing strategy", body: `Platform: ${marketplace}. Positioning: ${positioning}. Language: ${language}.` },
        { label: "SEO title", body: `${prefix} for desk, home office and travel.` },
        {
          label: "Bullet points",
          body: "Stable build; foldable design; practical daily use; clear compatibility; suitable for office, home and travel."
        },
        {
          label: "Product description",
          body: "A marketplace-ready product description focused on buyer benefits, specifications, use cases and conversion-oriented clarity."
        },
        { label: "Keywords and FAQ", body: "Include core keywords, long-tail search terms and FAQ for compatibility, material, package contents and warranty." }
      ]
    };
  }

  if (employeeId === "competitor") {
    const goal = value(input, "goal", "Improve my listing");
    const marketplace = value(input, "marketplace", "Amazon Germany");
    const competitorLink = value(input, "competitorLink", "No competitor link provided");
    const ownAdvantage = value(input, "ownAdvantage", "Not specified");

    return {
      title,
      summary: `Competitor analysis generated for ${goal}.`,
      copySectionLabel: "Transfer to Listing Employee",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: "Competitor summary",
          body: `Marketplace: ${marketplace}\nCompetitor link: ${competitorLink}\nYour possible advantage: ${ownAdvantage}`
        },
        {
          label: "Gap analysis",
          body: "Compare title keyword order, first image promise, bullet structure, price position, delivery promise, review objections, warranty language and trust signals."
        },
        {
          label: "Recommended actions",
          body: "1. Put the strongest buyer keyword at the start of the title.\n2. Turn competitor review objections into FAQ and image text.\n3. Make compatibility, package contents and warranty easier to scan.\n4. Choose a clear positioning angle before rewriting the listing."
        },
        {
          label: "Transfer to Listing Employee",
          body: "Send benchmark link, recommended keywords, positioning and product-gap notes into the Listing Employee as reference material."
        }
      ]
    };
  }

  if (employeeId === "meeting") {
    const audience = value(input, "audience", "Chinese internal team");
    const detailLevel = value(input, "detailLevel", "Executive summary");
    const chinese = audience.includes("Chinese");

    return {
      title,
      summary: `Meeting report generated for ${audience} with ${detailLevel}.`,
      copySectionLabel: chinese ? "会议摘要" : "Meeting summary",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: chinese ? "会议摘要" : "Meeting summary",
          body:
            detailLevel === "Detailed minutes"
              ? "本次会议纪要应覆盖会议背景、各方立场、讨论过程、关键决定、未解决问题、风险事项和下一步责任人。"
              : "This meeting summary focuses on decisions, open questions and next-step ownership."
        },
        { label: chinese ? "关键决定" : "Key decisions", body: "List confirmed decisions separately from assumptions or topics that still require confirmation." },
        { label: chinese ? "行动项" : "Action items", body: "Each action item should include owner, deadline, priority, dependency and expected output." },
        { label: chinese ? "内部风险提示" : "Follow-up notes", body: "Keep internal risk notes separate from client-facing follow-up language." }
      ]
    };
  }

  return {
    title,
    summary: "German client reply generated from submitted business context.",
    copySectionLabel: "German reply",
    downloadLabel: "Download Word Report",
    sections: [
      {
        label: "German reply",
        body:
          "Sehr geehrter Herr Schneider, vielen Dank fuer Ihre Nachricht. Wir bestaetigen, dass die Ware planmaessig vorbereitet wird. Bitte senden Sie uns die Bestellnummer und die vereinbarte Anzahlung."
      },
      {
        label: "Chinese explanation",
        body: "客户主要在确认交期和付款安排。建议确认时间线，并提醒客户提供订单号和预付款信息。"
      },
      {
        label: "Intent analysis",
        body: "The client is interested and needs confidence on delivery timing before moving forward."
      },
      {
        label: "Next step",
        body: "Attach the latest offer and ask the client to confirm purchase order number, billing address and delivery contact."
      }
    ]
  };
}
