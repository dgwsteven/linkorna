"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSearch,
  FileText,
  Languages,
  Scale,
  ShieldCheck,
  UploadCloud,
  Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { submitEmployeeTask } from "@/app/employees/actions";

const reviewChecklist = [
  "Payment, delivery and acceptance terms",
  "Liability, warranty and penalty exposure",
  "Governing law and dispute resolution",
  "Missing clauses and negotiation points"
];

const outputAudiences = [
  "Chinese internal team - Chinese risk memo",
  "German client - German neutral comments",
  "English-speaking client - English neutral comments",
  "Chinese management + German client package",
  "Chinese management + English client package",
  "Trilingual package: Chinese, German, English",
  "Other"
];

const previewByAudience: Record<string, { note: string; sections: { label: string; body: string[] }[] }> = {
  "Chinese internal team - Chinese risk memo": {
    note: "Internal version: direct, risk-oriented, suitable for management and operations review.",
    sections: [
      {
        label: "内部风险摘要",
        body: [
          "付款节点、验收标准和延期责任需要在签署前进一步明确。",
          "目前合同可以作为谈判基础，但不建议在责任上限缺失的情况下直接签署。",
          "建议优先修改：付款条件、验收期限、违约责任、争议解决。"
        ]
      },
      {
        label: "逐条修改意见",
        body: [
          "付款条款：建议明确预付款比例、尾款触发条件和逾期付款处理方式。",
          "交付条款：建议补充 Incoterms、交付地点、物流文件和风险转移时间。",
          "验收条款：建议增加五个工作日验收期，以及未反馈是否视为验收通过。"
        ]
      },
      {
        label: "谈判建议",
        body: [
          "先要求对方补充责任上限，再讨论交期承诺。",
          "对客户可使用中性表达，对内部需标注高风险条款。"
        ]
      }
    ]
  },
  "German client - German neutral comments": {
    note: "German client version: neutral, polite and negotiation-friendly.",
    sections: [
      {
        label: "Deutsche Kundenkommentare",
        body: [
          "Wir schlagen vor, den Pruefungszeitraum nach Lieferung genauer zu definieren, damit beide Parteien dieselbe operative Erwartung haben.",
          "Bitte ergaenzen Sie die erforderlichen Lieferdokumente sowie den Zeitpunkt des Gefahruebergangs.",
          "Zur besseren Planung waere eine klare Regelung der Zahlungsmeilensteine hilfreich."
        ]
      },
      {
        label: "Klaerungspunkte",
        body: [
          "Zahlungsziel und Anzahlungsbetrag.",
          "Abnahmefrist und Verfahren bei Maengeln.",
          "Haftungsbegrenzung und Verantwortlichkeit bei Lieferverzug."
        ]
      },
      {
        label: "Empfohlene Formulierung",
        body: [
          "Zur Vermeidung spaeterer Missverstaendnisse bitten wir um eine kurze Praezisierung der Abnahme- und Lieferdokumentationsanforderungen."
        ]
      }
    ]
  },
  "English-speaking client - English neutral comments": {
    note: "English client version: clear, diplomatic and action-oriented.",
    sections: [
      {
        label: "Client-facing comments",
        body: [
          "We suggest clarifying the inspection period after delivery so both parties share the same operational expectations.",
          "Please specify the required delivery documents and the point at which risk transfers.",
          "For smoother execution, we recommend defining payment milestones and acceptance procedure more precisely."
        ]
      },
      {
        label: "Clarification points",
        body: [
          "Deposit amount, final payment trigger and overdue payment handling.",
          "Inspection window, defect notice process and acceptance standard.",
          "Liability cap and responsibility for delivery delay."
        ]
      },
      {
        label: "Suggested wording",
        body: [
          "To avoid future misunderstandings, we kindly suggest adding a five-business-day inspection period after delivery."
        ]
      }
    ]
  }
};

previewByAudience["Chinese management + German client package"] = {
  note: "Combined package: Chinese internal memo plus German external wording.",
  sections: [...previewByAudience["Chinese internal team - Chinese risk memo"].sections, ...previewByAudience["German client - German neutral comments"].sections]
};

previewByAudience["Chinese management + English client package"] = {
  note: "Combined package: Chinese internal memo plus English external wording.",
  sections: [...previewByAudience["Chinese internal team - Chinese risk memo"].sections, ...previewByAudience["English-speaking client - English neutral comments"].sections]
};

previewByAudience["Trilingual package: Chinese, German, English"] = {
  note: "Full package: internal Chinese review and client-ready German/English comments.",
  sections: [
    ...previewByAudience["Chinese internal team - Chinese risk memo"].sections,
    ...previewByAudience["German client - German neutral comments"].sections,
    ...previewByAudience["English-speaking client - English neutral comments"].sections
  ]
};

previewByAudience.Other = previewByAudience["Chinese internal team - Chinese risk memo"];

const diagnosisByAudience: Record<string, string[]> = {
  "Chinese internal team - Chinese risk memo": [
    "验收标准不够清楚",
    "延期责任需要明确",
    "付款节点需要补充",
    "责任上限建议加入",
    "争议解决条款需确认",
    "客户版措辞应单独处理"
  ],
  "German client - German neutral comments": [
    "Abnahmeverfahren klaeren",
    "Lieferdokumente ergaenzen",
    "Zahlungsmeilensteine praezisieren",
    "Haftungsregelung neutral ansprechen",
    "Keine internen Risikobewertungen senden"
  ],
  "English-speaking client - English neutral comments": [
    "Clarify acceptance process",
    "Specify delivery documents",
    "Define payment milestones",
    "Address liability in neutral wording",
    "Do not expose internal risk notes"
  ]
};

diagnosisByAudience["Chinese management + German client package"] = [
  ...diagnosisByAudience["Chinese internal team - Chinese risk memo"],
  ...diagnosisByAudience["German client - German neutral comments"]
];

diagnosisByAudience["Chinese management + English client package"] = [
  ...diagnosisByAudience["Chinese internal team - Chinese risk memo"],
  ...diagnosisByAudience["English-speaking client - English neutral comments"]
];

diagnosisByAudience["Trilingual package: Chinese, German, English"] = [
  ...diagnosisByAudience["Chinese internal team - Chinese risk memo"],
  ...diagnosisByAudience["German client - German neutral comments"],
  ...diagnosisByAudience["English-speaking client - English neutral comments"]
];

diagnosisByAudience.Other = diagnosisByAudience["Chinese internal team - Chinese risk memo"];

export function ContractWorkspace({ selectedAudience = outputAudiences[0] }: { selectedAudience?: string }) {
  const router = useRouter();
  const preview = previewByAudience[selectedAudience] ?? previewByAudience.Other;
  const diagnosis = diagnosisByAudience[selectedAudience] ?? diagnosisByAudience.Other;

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <FileSearch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Review Scope</h2>
              <p className="text-sm text-steel">What the contract employee checks first.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {reviewChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Review Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Review objective</span>
              <select form="contract-task-form" name="reviewObjective" className="field">
                <option>Pre-signing risk review</option>
                <option>Extract key commercial terms</option>
                <option>Prepare negotiation comments</option>
                <option>Compare contract with quotation</option>
                <option>Check supplier/customer obligations</option>
                <option>Summarize for management approval</option>
                <option>Prepare client-facing clarification</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Risk tolerance</span>
              <select form="contract-task-form" name="riskTolerance" className="field">
                <option>Balanced business review</option>
                <option>Conservative legal risk review</option>
                <option>Commercially flexible</option>
                <option>Strict compliance check</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Output audience</span>
              <select
                form="contract-task-form"
                name="audienceSelector"
                className="field"
                value={selectedAudience}
                onChange={(event) => {
                  router.push(`/employees/contract?audience=${encodeURIComponent(event.currentTarget.value)}`);
                }}
              >
                {outputAudiences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </aside>

      <form id="contract-task-form" action={submitEmployeeTask.bind(null, "contract")} className="rounded-lg border border-line bg-white shadow-panel">
        <input type="hidden" name="audience" value={selectedAudience} />
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Contract Material</h2>
              <p className="text-sm text-steel">Upload or paste the contract and tell the AI who the output is for.</p>
            </div>
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
              Starter employee
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Upload contract file</span>
            <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-line bg-mist p-4 text-center text-sm font-bold text-steel">
              <UploadCloud className="mr-2 h-5 w-5" />
              Select multiple PDF, DOCX or TXT files
            </div>
            <input name="contractFiles" className="sr-only" type="file" multiple accept=".pdf,.doc,.docx,.txt" />
          </label>

          <label className="grid gap-2">
            <span className="label">Paste contract text</span>
            <textarea name="contractText" className="field min-h-40 resize-y" placeholder="Paste clauses or the full contract text here." />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Contract type</span>
              <select name="contractType" className="field">
                <option>Sales contract</option>
                <option>Purchase agreement</option>
                <option>Distribution agreement</option>
                <option>Supplier framework agreement</option>
                <option>NDA / confidentiality agreement</option>
                <option>Service agreement</option>
                <option>Logistics / freight agreement</option>
                <option>Warranty / after-sales agreement</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Counterparty</span>
              <select name="counterparty" className="field">
                <option>German customer</option>
                <option>German supplier</option>
                <option>EU distributor</option>
                <option>Chinese supplier</option>
                <option>English-speaking customer</option>
                <option>English-speaking supplier</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Governing law</span>
              <select name="governingLaw" className="field">
                <option>Not specified</option>
                <option>German law</option>
                <option>Chinese law</option>
                <option>English law</option>
                <option>EU member state law</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Deal value</span>
              <select name="dealValue" className="field">
                <option>Under 10,000 EUR</option>
                <option>10,000 - 50,000 EUR</option>
                <option>50,000 - 250,000 EUR</option>
                <option>250,000 - 1M EUR</option>
                <option>Above 1M EUR</option>
                <option>Not sure</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Business context</span>
            <textarea
              name="businessContext"
              className="field min-h-28 resize-y"
              placeholder="Add quotation terms, delivery promise, payment agreement, negotiation background or known red lines."
            />
          </label>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Focus areas
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Payment terms", "Delivery and Incoterms", "Warranty and liability", "Termination", "IP / confidentiality", "Dispute resolution"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="focusAreas" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked={["Payment terms", "Delivery and Incoterms", "Warranty and liability"].includes(item)} />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-5">
          <div className="text-sm font-bold text-steel">Estimated output: internal memo, client comments, clause checklist, negotiation wording</div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="h-11 rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
              Save Draft
            </button>
            <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-md bg-blue px-5 text-sm font-black text-white">
              <Wand2 className="h-4 w-4" />
              Review Contract
            </button>
          </div>
        </div>
      </form>

      <aside className="space-y-4">
        <section className="min-h-[320px] rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Contract Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">Brief outline only. The full report can contain many clause-level edits.</p>
          <div className="mt-4 grid gap-2">
            {diagnosis.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-line p-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-mist text-xs font-black text-navy">{index + 1}</span>
                <p className="text-sm font-bold leading-5 text-graphite">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[620px] rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
                <p className="text-sm text-steel">{preview.note}</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {preview.sections.map((section) => (
              <div key={section.label} className="rounded-md bg-mist p-3">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label.includes("Client") ? <Languages className="h-4 w-4" /> : section.label.includes("Clause") ? <Scale className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {section.label}
                </div>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-graphite">
                  {section.body.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-3 border-t border-line p-4">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
              <Languages className="h-4 w-4" />
              Copy Client Comment
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-blue px-4 text-sm font-black text-white">
              <Download className="h-4 w-4" />
              Download Word Report
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber" />
            <div>
              <h3 className="text-sm font-black text-amber-800">Important Boundary</h3>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Keep internal legal risk language separate from client-facing wording. The external version should be neutral and negotiation-friendly.
              </p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
