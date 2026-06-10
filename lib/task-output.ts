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
    return {
      title,
      summary: `Contract review generated for ${audience}.`,
      copySectionLabel: "Client-facing comments",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: audience.includes("German") ? "Deutsche Kundenkommentare" : audience.includes("English") ? "Client-facing comments" : "Internal risk memo",
          body:
            audience.includes("German")
              ? "Wir empfehlen, Zahlungsmeilensteine, Abnahmefrist und Lieferdokumentation klarer zu definieren, damit beide Parteien dieselben operativen Erwartungen haben."
              : audience.includes("English")
                ? "We recommend clarifying payment milestones, acceptance window and delivery documentation so both parties share the same operational expectations."
                : "付款节点、验收期限、交付文件和责任上限需要在签署前进一步明确。建议把内部风险意见和对外客户措辞分开处理。"
        },
        {
          label: "Clause-level actions",
          body: "Payment terms, Incoterms, inspection procedure, warranty, liability cap, termination and dispute resolution should be reviewed clause by clause."
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
    const supplierEmail =
      language === "German"
        ? "Sehr geehrte Damen und Herren, bitte senden Sie uns ein Angebot mit Stueckpreis, MOQ, Lieferzeit, Zahlungsbedingungen, Zertifikaten, Verpackungsdetails und Versandoptionen."
        : language === "Chinese"
          ? "您好，请提供该产品的报价、MOQ、交期、付款条件、认证文件、包装信息和物流方案，方便我们进行供应商比较。"
          : "Dear Supplier, please provide your quotation, MOQ, lead time, payment terms, certificates, packaging details and shipping options for the requested product.";

    return {
      title,
      summary: `Supplier message generated in ${language}.`,
      copySectionLabel: "Supplier email",
      downloadLabel: "Download Word Report",
      sections: [
        { label: "Supplier email", body: supplierEmail },
        {
          label: "Key explanation for user",
          body: "This message gathers the core sourcing information in one request while keeping room for later negotiation."
        },
        {
          label: "Recommended next action",
          body: "Compare supplier replies by MOQ, unit price, lead time, certifications, packaging and shipping terms before negotiating."
        }
      ]
    };
  }

  if (employeeId === "listing") {
    const marketplace = value(input, "marketplace", "Amazon Germany");
    const language = value(input, "language", "Marketplace default");
    const positioning = value(input, "positioning", "Practical value");
    const prefix = language === "German" ? "Verstellbarer Laptopstaender" : language === "Chinese" ? "可折叠铝合金笔记本支架" : "Foldable Aluminum Laptop Stand";

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
    return {
      title,
      summary: `Competitor analysis generated for ${goal}.`,
      copySectionLabel: "Transfer to Listing Employee",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: "Competitor summary",
          body: "The benchmark listing highlights practical benefits, price position and buyer trust cues. The next step is to compare these against your own listing."
        },
        {
          label: "Gap analysis",
          body: "Improve title keyword order, product compatibility, image explanation, FAQ, warranty language and offer clarity."
        },
        {
          label: "Recommended actions",
          body: "Use the competitor link as the Reference product link in E-commerce Listing Employee, then generate a platform-specific listing."
        },
        {
          label: "Transfer to Listing Employee",
          body: "Send benchmark link, recommended keywords, positioning and product-gap notes into the Listing Employee."
        }
      ]
    };
  }

  if (employeeId === "meeting") {
    const audience = value(input, "audience", "Chinese internal team");
    const detailLevel = value(input, "detailLevel", "Executive summary");
    return {
      title,
      summary: `Meeting report generated for ${audience} with ${detailLevel}.`,
      copySectionLabel: audience.includes("Chinese") ? "会议摘要" : "Meeting summary",
      downloadLabel: "Download Word Report",
      sections: [
        {
          label: audience.includes("Chinese") ? "会议摘要" : "Meeting summary",
          body:
            detailLevel === "Detailed minutes"
              ? "This detailed meeting summary should cover background, participant positions, discussion flow, key decisions, open risks, unresolved questions and next-step ownership in a complete report format."
              : "This meeting focused on timeline, pricing, technical documents and next-step ownership."
        },
        { label: audience.includes("Chinese") ? "关键决定" : "Key decisions", body: "Delivery target, revised quotation and technical documentation were confirmed as the main decision areas." },
        { label: audience.includes("Chinese") ? "行动项" : "Action items", body: "Send revised quotation; confirm delivery date; provide technical files; assign owners and deadlines." },
        { label: audience.includes("Chinese") ? "内部风险提示" : "Follow-up notes", body: "Keep internal risk notes separate from client-facing follow-up language." }
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
