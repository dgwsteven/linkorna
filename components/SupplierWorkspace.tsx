"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Languages,
  MailPlus,
  PackageSearch,
  Send,
  Sparkles,
  Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmployeeTaskForm } from "@/components/EmployeeTaskForm";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const supplierChecklist = [
  "Sourcing inquiry and RFQ message",
  "Price, MOQ and lead-time negotiation",
  "Sample, certification and packaging questions",
  "Follow-up message and comparison structure"
];

const targetLanguages = ["English", "German", "Chinese", "Other"];
const operatorLanguages = ["Chinese", "English", "German"];

const diagnosisByLanguage: Record<string, string[]> = {
  English: [
    "Clarify product specification and quantity",
    "Ask for MOQ, lead time and payment terms",
    "Confirm certificates, warranty and packaging",
    "Request shipping terms and quotation validity"
  ],
  German: [
    "Produktspezifikation und Menge klaeren",
    "MOQ, Lieferzeit und Zahlungsbedingungen abfragen",
    "Zertifikate, Garantie und Verpackung bestaetigen",
    "Versandbedingungen und Angebotsgueltigkeit anfragen"
  ],
  Chinese: [
    "明确产品规格和采购数量",
    "询问 MOQ、交期和付款条件",
    "确认认证、质保和包装规格",
    "要求报价包含物流条款和有效期"
  ],
  Other: [
    "Clarify product specification and quantity",
    "Ask for MOQ, lead time and payment terms",
    "Confirm certificates, warranty and packaging",
    "Request shipping terms and quotation validity"
  ]
};

const outputByLanguage: Record<string, { label: string; body: string }[]> = {
  English: [
    {
      label: "Supplier email",
      body:
        "Dear Supplier, we are sourcing CE-compliant products for the German market. Please provide your quotation, MOQ, lead time, payment terms, available certificates, packaging details and shipping options to Hamburg."
    },
    {
      label: "Key explanation for user",
      body:
        "This message asks for the core sourcing information in one email: price, minimum order quantity, delivery timeline, compliance documents, packaging and logistics. It keeps the negotiation open without revealing your target price."
    },
    {
      label: "Recommended next action",
      body:
        "After receiving the reply, compare MOQ, unit price, lead time, certificates and shipping terms across suppliers before negotiating price."
    }
  ],
  German: [
    {
      label: "Supplier email",
      body:
        "Sehr geehrte Damen und Herren, wir suchen CE-konforme Produkte fuer den deutschen Markt. Bitte senden Sie uns Ihr Angebot mit Stueckpreis, MOQ, Lieferzeit, Zahlungsbedingungen, verfuegbaren Zertifikaten, Verpackungsdetails und Versandoptionen nach Hamburg."
    },
    {
      label: "Key explanation for user",
      body:
        "Diese Nachricht fragt alle wichtigen Beschaffungsdaten in einer strukturierten Anfrage ab: Preis, Mindestmenge, Lieferzeit, Dokumente, Verpackung und Logistik. Der Ton bleibt professionell und verhandlungsfreundlich."
    },
    {
      label: "Recommended next action",
      body:
        "Nach der Antwort sollten MOQ, Preis, Lieferzeit, Zertifikate und Versandbedingungen verglichen werden, bevor Sie ueber den Zielpreis verhandeln."
    }
  ],
  Chinese: [
    {
      label: "Supplier email",
      body:
        "您好，我们正在为德国市场采购符合 CE 要求的产品。请提供报价、MOQ、交期、付款条件、可提供的认证文件、包装信息以及发往汉堡的物流方案。"
    },
    {
      label: "Key explanation for user",
      body:
        "这封邮件一次性向供应商索取核心采购信息：价格、最小起订量、交期、认证、包装和物流条件，同时不会暴露你的目标价格，便于后续议价。"
    },
    {
      label: "Recommended next action",
      body:
        "收到回复后，先比较各供应商的 MOQ、单价、交期、认证和物流条款，再进入价格谈判。"
    }
  ],
  Other: [
    {
      label: "Supplier email",
      body:
        "Dear Supplier, please provide quotation details, MOQ, lead time, payment terms, certificates, packaging and shipping options for the requested product."
    },
    {
      label: "Key explanation for user",
      body:
        "Use this as a neutral sourcing request. After choosing a specific language later, the system can adapt tone and wording more precisely."
    },
    {
      label: "Recommended next action",
      body: "Collect comparable supplier replies, then shortlist based on price, lead time, compliance and communication quality."
    }
  ]
};

export function SupplierWorkspace({ selectedLanguage = "English" }: { selectedLanguage?: string }) {
  const router = useRouter();
  const language = targetLanguages.includes(selectedLanguage) ? selectedLanguage : "English";
  const supplierDiagnosis = diagnosisByLanguage[language];
  const outputSections = outputByLanguage[language];

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <PackageSearch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Communication Scope</h2>
              <p className="text-sm text-steel">Messages and supplier details this employee prepares.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {supplierChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Message Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Communication goal</span>
              <select form="supplier-task-form" name="communicationGoal" className="field">
                <option>Request first quotation</option>
                <option>Negotiate price and MOQ</option>
                <option>Ask for sample</option>
                <option>Follow up after no response</option>
                <option>Confirm production schedule</option>
                <option>Clarify certification and compliance</option>
                <option>Discuss packaging and labeling</option>
                <option>Handle quality issue</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">My language</span>
              <select form="supplier-task-form" name="operatorLanguage" className="field" defaultValue="Chinese">
                {operatorLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Target language</span>
              <select
                form="supplier-task-form"
                name="languageSelector"
                className="field"
                value={language}
                onChange={(event) => {
                  router.push(`/employees/supplier?language=${encodeURIComponent(event.currentTarget.value)}`);
                }}
              >
                {targetLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Tone</span>
              <select form="supplier-task-form" name="tone" className="field">
                <option>Professional and friendly</option>
                <option>Direct and efficient</option>
                <option>Firm negotiation</option>
                <option>Long-term partner style</option>
                <option>Urgent but polite</option>
              </select>
            </label>
          </div>
        </section>
      </aside>

      <EmployeeTaskForm id="supplier-task-form" employeeId="supplier" className="rounded-lg border border-line bg-white shadow-panel">
        <input type="hidden" name="language" value={language} />
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Supplier Task Brief</h2>
              <p className="text-sm text-steel">Describe what you want to source or negotiate, then generate supplier-ready communication.</p>
            </div>
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
              Starter employee
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Sourcing or communication task</span>
            <textarea
              name="task"
              className="field min-h-36 resize-y"
              placeholder="Example: Find a supplier for CE-compliant aluminum laptop stands and ask for quotation, MOQ, lead time, packaging and shipping to Hamburg."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="label">Product category</span>
              <select name="productCategory" className="field">
                <option>Machinery / components</option>
                <option>Electronics</option>
                <option>Electronics accessories</option>
                <option>Computer and office accessories</option>
                <option>Phone and tablet accessories</option>
                <option>LED lighting</option>
                <option>Solar / renewable energy products</option>
                <option>Home and kitchen</option>
                <option>Kitchen tools and gadgets</option>
                <option>Small home appliances</option>
                <option>Home organization</option>
                <option>Furniture</option>
                <option>Beauty and personal care</option>
                <option>Health and wellness accessories</option>
                <option>Pet products</option>
                <option>Sports and outdoor</option>
                <option>Tools and hardware</option>
                <option>Automotive accessories</option>
                <option>Fashion accessories</option>
                <option>Baby products</option>
                <option>Toys and gifts</option>
                <option>Packaging</option>
                <option>Custom product / other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Supplier region</span>
              <select name="supplierRegion" className="field">
                <option>China</option>
                <option>Germany</option>
                <option>European Union</option>
                <option>Turkey</option>
                <option>Vietnam</option>
                <option>India</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="label">Quantity</span>
              <input name="quantity" className="field" placeholder="Example: 2,000 pcs" />
            </label>
            <label className="grid gap-2">
              <span className="label">Delivery location</span>
              <input name="deliveryLocation" className="field" placeholder="Example: Hamburg, Germany" />
            </label>
            <label className="grid gap-2">
              <span className="label">Timeline</span>
              <select name="timeline" className="field">
                <option>Flexible</option>
                <option>Need quote this week</option>
                <option>Urgent sample request</option>
                <option>Production deadline fixed</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="label">Target unit price</span>
              <input name="targetUnitPrice" className="field" placeholder="Optional, example: under 4.50 EUR" />
            </label>
            <label className="grid gap-2">
              <span className="label">Payment preference</span>
              <select name="paymentPreference" className="field">
                <option>Not specified</option>
                <option>30% deposit / 70% before shipment</option>
                <option>PayPal for sample</option>
                <option>Bank transfer</option>
                <option>Letter of credit</option>
                <option>Negotiate after quotation</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Supplier relationship</span>
              <select name="supplierRelationship" className="field">
                <option>New supplier</option>
                <option>Existing supplier</option>
                <option>Previous sample supplier</option>
                <option>Price negotiation with known supplier</option>
                <option>Problem solving after order</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Known requirements and red lines</span>
            <textarea
              name="requirements"
              className="field min-h-28 resize-y"
              placeholder="Add target price, certifications, materials, packaging, private label requirements, payment preference or unacceptable terms."
            />
          </label>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Include in message
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Price and MOQ", "Lead time", "Certificates", "Sample cost", "Packaging details", "Shipping terms"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="includeItems" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-line p-5">
          <FormSubmitButton idleLabel="Generate Message" pendingLabel="Supplier Communication Employee is working..." />
        </div>
      </EmployeeTaskForm>

      {false && (
      <aside className="space-y-4">
        <section className="min-h-[300px] rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Supplier Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">Brief sourcing and negotiation guide.</p>
          <div className="mt-4 grid gap-2">
            {supplierDiagnosis.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-line p-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-mist text-xs font-black text-navy">{index + 1}</span>
                <p className="text-sm font-bold leading-5 text-graphite">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[560px] rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
                <p className="text-sm text-steel">Supplier-ready message package.</p>
              </div>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {outputSections.map((section) => (
              <div key={section.label} className="rounded-md bg-mist p-3">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label.includes("email") ? <MailPlus className="h-4 w-4" /> : section.label.includes("explanation") ? <Languages className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {section.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-line p-4">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
              <Send className="h-4 w-4" />
              Use and Copy
            </button>
          </div>
        </section>
      </aside>
      )}
    </div>
  );
}
