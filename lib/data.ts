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
    price: "EUR 49",
    includes: ["German Email Employee", "Contract Intelligence Employee", "Supplier Communication Employee"],
    targets: ["Small exporters", "SOHO traders", "Small procurement teams"],
    button: "Start Starter"
  },
  {
    name: "Business",
    subtitle: "Commerce Workforce",
    price: "EUR 99",
    includes: ["Everything in Starter", "E-commerce Listing Employee", "Competitor Intelligence Employee"],
    targets: ["Amazon sellers", "Shopify sellers", "Cross-border e-commerce teams", "Export companies selling online"],
    button: "Start Business"
  },
  {
    name: "Executive",
    subtitle: "Executive Workforce",
    price: "EUR 199",
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
  { label: "Pricing", href: "/pricing", icon: BarChart3 }
];
