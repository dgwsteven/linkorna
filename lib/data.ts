import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  CreditCard,
  FileSearch,
  Globe2,
  MailCheck,
  Mic2,
  PackageSearch,
  ShoppingBag
} from "lucide-react";

export type PlanName = "Starter" | "Business" | "Executive";

export const plans = [
  {
    name: "Starter",
    subtitle: "Cross-border Workforce",
    price: "€49",
    includes: ["German Email Employee", "Contract Intelligence Employee", "Supplier Communication Employee"],
    targets: ["Small exporters", "SOHO traders", "Small procurement teams"],
    button: "Start Starter"
  },
  {
    name: "Business",
    subtitle: "Commerce Workforce",
    price: "€99",
    includes: ["Everything in Starter", "E-commerce Listing Employee", "Competitor Intelligence Employee"],
    targets: ["Amazon sellers", "Shopify sellers", "Cross-border e-commerce teams", "Export companies selling online"],
    button: "Start Business"
  },
  {
    name: "Executive",
    subtitle: "Executive Workforce",
    price: "€199",
    includes: [
      "Everything in Business",
      "Meeting Recorder Employee",
      "Upload Zoom / Teams / Tencent Meeting / Feishu recordings",
      "Generate summaries, bilingual transcripts, action items and follow-up emails"
    ],
    targets: ["Leadership teams", "Sales teams", "Procurement directors", "Multi-market operators"],
    button: "Start Executive"
  }
];

export const employees = [
  {
    id: "german-email",
    name: "German Email Employee",
    plan: "Starter" as PlanName,
    icon: MailCheck,
    description: "Reply to German clients and understand their intent.",
    example: "Turn a German client email into a formal reply, intent analysis and next step.",
    route: "/employees/german-email"
  },
  {
    id: "contract",
    name: "Contract Intelligence Employee",
    plan: "Starter" as PlanName,
    icon: FileSearch,
    description: "Analyze contracts, risks and key clauses.",
    example: "Summarize payment, delivery, liability and termination risks in Chinese.",
    route: "/employees/contract"
  },
  {
    id: "supplier",
    name: "Supplier Communication Employee",
    plan: "Starter" as PlanName,
    icon: PackageSearch,
    description: "Create supplier inquiries, negotiations and follow-ups.",
    example: "Draft a sourcing inquiry and follow-up message for a German supplier.",
    route: "/employees/supplier"
  },
  {
    id: "listing",
    name: "E-commerce Listing Employee",
    plan: "Business" as PlanName,
    icon: ShoppingBag,
    description: "Create marketplace listings, SEO descriptions and product pages.",
    example: "Generate an Amazon Germany title, bullets, FAQ and keyword structure.",
    route: "/employees/listing"
  },
  {
    id: "competitor",
    name: "Competitor Intelligence Employee",
    plan: "Business" as PlanName,
    icon: BarChart3,
    description: "Analyze competitors, keywords, pricing and reviews.",
    example: "Find positioning gaps from competitor pricing, reviews and keywords.",
    route: "/employees/competitor"
  },
  {
    id: "meeting",
    name: "Meeting Recorder Employee",
    plan: "Executive" as PlanName,
    icon: Mic2,
    description: "Analyze uploaded meeting recordings and generate minutes.",
    example: "Convert an uploaded supplier meeting recording into minutes and action items.",
    route: "/employees/meeting"
  }
];

export const navItems = [
  { label: "Overview", href: "/dashboard", icon: BriefcaseBusiness },
  { label: "AI Employees", href: "/dashboard#employees", icon: Globe2 },
  { label: "Recent Tasks", href: "/dashboard#tasks", icon: ClipboardCheck },
  { label: "Documents", href: "/documents", icon: FileSearch },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Pricing", href: "/pricing", icon: BarChart3 },
  { label: "Admin", href: "/admin", icon: BriefcaseBusiness }
];

export const recentTasks = [
  {
    id: "task-001",
    title: "German client reply",
    employee: "German Email Employee",
    status: "Completed",
    createdAt: "Today",
    plan: "Starter"
  },
  {
    id: "task-002",
    title: "Hamburg delivery clause review",
    employee: "Contract Intelligence Employee",
    status: "Saved",
    createdAt: "Yesterday",
    plan: "Starter"
  },
  {
    id: "task-003",
    title: "Amazon DE listing rewrite",
    employee: "E-commerce Listing Employee",
    status: "Draft",
    createdAt: "This week",
    plan: "Business"
  }
];

export const employeeForms: Record<string, { about: string; fields: string[]; mock: string[] }> = {
  "german-email": {
    about: "Turns German client emails into formal replies, intent analysis, risk flags, opportunity prompts and follow-up actions.",
    fields: ["Paste German client email", "Business context", "Reply objective", "Tone", "Output package"],
    mock: [
      "German Reply: Sehr geehrter Herr Schneider, vielen Dank fuer Ihre Nachricht. Wir bestaetigen, dass die Lieferung fuer Mitte Juli vorbereitet wird...",
      "Chinese Explanation: 客户主要在确认交期和付款安排。建议先确认时间线，再提醒客户提供订单号和预付款信息。",
      "Intent Analysis: The client is interested and asking for operational certainty before moving forward.",
      "Risk Flag: Payment timing and delivery contact are still unclear.",
      "Recommended Next Step: Attach the updated offer and ask for purchase order number, billing address and deposit schedule."
    ]
  },
  contract: {
    about: "Reviews contracts for business risk, key clauses, missing terms and audience-aware negotiation wording.",
    fields: ["Upload PDF / DOCX / TXT", "Paste contract text", "Review objective", "Output audience", "Focus areas"],
    mock: [
      "Executive Summary in Chinese: 本合同整体可执行，但付款节点、延期责任和验收标准需要进一步明确。",
      "Key Clauses: Payment within 30 days after invoice; delivery under DAP Hamburg; warranty period 12 months.",
      "Risk Points: Penalty cap is not stated; delivery delay responsibility is asymmetric; acceptance criteria are vague.",
      "Negotiation Suggestions: Add a liability cap, define inspection timeline and request a written delivery schedule.",
      "Missing Information: Governing law, dispute venue and force majeure procedure."
    ]
  },
  supplier: {
    about: "Creates supplier inquiries, negotiation messages, follow-ups and quotation comparison structures for sourcing teams.",
    fields: ["Describe sourcing task", "Communication goal", "Target language", "Product category", "Quantity", "Delivery location"],
    mock: [
      "Supplier Inquiry Email: Dear Supplier, we are sourcing CE-compliant products for delivery to Hamburg...",
      "Negotiation Message: Please confirm whether the unit price can be adjusted for 2,000 pieces with consolidated shipping.",
      "Follow-up Email: Thank you for the quotation. Could you also provide lead time, warranty details and packaging dimensions?",
      "Quotation Comparison Structure: Supplier, MOQ, unit price, lead time, payment terms, certifications, logistics notes."
    ]
  },
  listing: {
    about: "Builds marketplace-ready titles, bullets, descriptions, keywords and localization notes for e-commerce channels.",
    fields: ["Product name", "Target marketplace", "Target country", "Product category", "Product features", "Keywords", "Upload product image"],
    mock: [
      "SEO Title: Foldable Aluminum Laptop Stand for Desk, Adjustable Ergonomic Riser, Silver",
      "Bullet Points: Stable aluminum frame; six height levels; compact foldable design; improves airflow; travel-ready.",
      "Product Description: Designed for hybrid workspaces, this lightweight laptop stand helps improve posture while keeping desks organized.",
      "Backend Keywords: laptop riser, ergonomic stand, aluminum holder, desk accessory, portable office.",
      "FAQ: Is it compatible with 15-inch laptops? Yes, it supports most 10-15.6 inch laptops."
    ]
  },
  competitor: {
    about: "Analyzes competitor listings, pricing, keywords and review pain points, then turns them into listing improvement actions.",
    fields: ["Competitor product link", "Analysis goal", "Marketplace", "Your product description", "Known competitor keywords", "Known review issues"],
    mock: [
      "Competitor Summary: Main competitors emphasize durability and fast delivery, while fewer highlight after-sales support.",
      "Price Positioning: Your product can sit 6-8% above entry-level competitors if warranty and packaging are clearer.",
      "Keyword Opportunities: ergonomic laptop stand, adjustable desk riser, aluminum laptop holder.",
      "Review Pain Points: Buyers complain about wobble, weak hinges and unclear size compatibility.",
      "Recommended Improvements: Add comparison table, compatibility chart and stronger warranty language."
    ]
  },
  meeting: {
    about: "Analyzes meeting recordings and transcripts, then produces audience-aware minutes, action items and follow-up emails.",
    fields: ["Upload meeting files", "Output audience", "Meeting type", "Meeting language", "Meeting context"],
    mock: [
      "Meeting Summary: This meeting focused on delivery timeline, pricing adjustment and next project steps.",
      "Key Decisions: Delivery target remains mid-July; supplier will send updated quotation; client requires revised technical documents.",
      "Action Items: Send revised offer - Sales Team - Friday - High; Confirm delivery date - Supplier - Monday - High.",
      "Bilingual Transcript Sample: Client: Could you confirm the revised timeline? / 客户：请确认调整后的交付时间。",
      "Follow-up Email: Dear Mr. Schneider, thank you for the productive meeting. We will send the revised offer by Friday..."
    ]
  }
};
