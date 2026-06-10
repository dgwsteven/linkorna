import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Languages,
  MailCheck,
  Sparkles,
  Wand2
} from "lucide-react";
import type { ReactNode } from "react";
import { submitEmployeeTask } from "@/app/employees/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const quickSignals = [
  { label: "Client intent", value: "The client is checking delivery certainty before moving the order forward." },
  { label: "Business risk", value: "Payment timing, purchase order number and delivery contact are still missing." },
  { label: "Recommended action", value: "Confirm the timeline, attach the updated offer, and ask for the missing order details." }
];

const replySections = [
  {
    label: "German reply",
    body:
      "Sehr geehrter Herr Schneider, vielen Dank fuer Ihre Nachricht. Wir bestaetigen, dass die Ware planmaessig fuer Mitte Juli vorbereitet wird. Bitte senden Sie uns die bestaetigte Bestellnummer und die vereinbarte Anzahlung, damit wir die Produktion final reservieren koennen."
  },
  {
    label: "Chinese explanation",
    body:
      "客户主要在确认交期和付款安排。建议回复时先确认七月中旬交付计划，再温和提醒客户提供订单号和预付款，以便锁定产能。"
  },
  {
    label: "Intent analysis",
    body:
      "The client is interested and not rejecting the offer. The message shows buying intent, but they need confidence on delivery timing before moving forward."
  },
  {
    label: "Next step",
    body:
      "Send the German reply, attach the latest offer, and ask the client to confirm purchase order number, deposit timing, billing address, and delivery contact."
  }
];

const checklist = [
  "Formal German business reply",
  "Chinese explanation for the operator",
  "Intent, risk, and opportunity analysis",
  "Follow-up task list for the sales team"
];

function ToneBadge({ tone, children }: { tone: string; children: ReactNode }) {
  const classes =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${classes}`}>{children}</span>;
}

export function GermanEmailWorkspace() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <MailCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Input Quality</h2>
              <p className="text-sm text-steel">What this employee needs before writing.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Reply Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Reply objective</span>
              <select form="german-email-task-form" name="replyObjective" className="field">
                <option>Confirm delivery and move deal forward</option>
                <option>Ask for missing information</option>
                <option>Negotiate payment terms</option>
                <option>Confirm quotation details</option>
                <option>Send revised offer</option>
                <option>Follow up after no response</option>
                <option>Request purchase order</option>
                <option>Confirm sample request</option>
                <option>Explain production delay</option>
                <option>Confirm logistics and shipping documents</option>
                <option>Clarify technical specification</option>
                <option>Handle warranty or quality issue</option>
                <option>Invite client to a meeting</option>
                <option>Respond to complaint</option>
                <option>Decline politely</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Tone</span>
              <select form="german-email-task-form" name="tone" className="field">
                <option>Formal and warm</option>
                <option>Very formal</option>
                <option>Concise and direct</option>
                <option>Friendly long-term partner</option>
                <option>Firm but polite</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Output package</span>
              <select form="german-email-task-form" name="outputPackage" className="field">
                <option>German reply + Chinese explanation</option>
                <option>German reply only</option>
                <option>German and English reply</option>
                <option>German reply + follow-up tasks</option>
              </select>
            </label>
          </div>
        </section>
      </aside>

      <form id="german-email-task-form" action={submitEmployeeTask.bind(null, "german-email")} className="rounded-lg border border-line bg-white shadow-panel">
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">German Client Email</h2>
              <p className="text-sm text-steel">Paste the original message and add the business context your team already knows.</p>
            </div>
            <ToneBadge tone="blue">Starter employee</ToneBadge>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Original German email</span>
            <textarea
              name="originalEmail"
              className="field min-h-44 resize-y"
              placeholder="Paste the client email here. Example: Sehr geehrte Damen und Herren, koennen Sie bitte bestaetigen, ob die Lieferung Mitte Juli moeglich ist..."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Your company role</span>
              <select name="companyRole" className="field">
                <option>Supplier / exporter</option>
                <option>Purchasing team</option>
                <option>Sales representative</option>
                <option>Account manager</option>
                <option>Operations coordinator</option>
                <option>Technical support</option>
                <option>Product manager</option>
                <option>Logistics coordinator</option>
                <option>Finance / invoicing team</option>
                <option>Customer service</option>
                <option>Project manager</option>
                <option>Founder / owner</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Client relationship</span>
              <select name="clientRelationship" className="field">
                <option>New lead</option>
                <option>Existing customer</option>
                <option>Long-term partner</option>
                <option>Distributor</option>
                <option>Marketplace buyer</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="label">Industry</span>
              <select name="industry" className="field">
                <option>Machinery / components</option>
                <option>Industrial equipment</option>
                <option>Automotive parts</option>
                <option>Electronics and electrical products</option>
                <option>LED lighting</option>
                <option>Solar / renewable energy</option>
                <option>Medical devices</option>
                <option>Tools and hardware</option>
                <option>Building materials</option>
                <option>Furniture and home living</option>
                <option>Consumer goods</option>
                <option>Household appliances</option>
                <option>Kitchenware</option>
                <option>Beauty and personal care</option>
                <option>Baby and maternity products</option>
                <option>Toys and gifts</option>
                <option>Pet products</option>
                <option>Sports and outdoor</option>
                <option>Fashion and accessories</option>
                <option>Shoes and bags</option>
                <option>Textiles</option>
                <option>Packaging and printing</option>
                <option>Food and beverage</option>
                <option>Chemicals</option>
                <option>Pharmaceuticals</option>
                <option>Agriculture products</option>
                <option>Cross-border e-commerce</option>
                <option>E-commerce products</option>
                <option>Professional services</option>
                <option>Custom industry / other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Deal stage</span>
              <select name="dealStage" className="field">
                <option>Before quotation</option>
                <option>Quotation sent</option>
                <option>Negotiating terms</option>
                <option>Order confirmed</option>
                <option>After delivery</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Urgency</span>
              <select name="urgency" className="field">
                <option>Normal</option>
                <option>Reply today</option>
                <option>High priority</option>
                <option>Escalation risk</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Business context and constraints</span>
            <textarea
              name="businessContext"
              className="field min-h-28 resize-y"
              placeholder="Add delivery timeline, price agreement, payment terms, product details, promises already made, or anything the AI should not change."
            />
          </label>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Optional checks
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Flag risky commitments", "Suggest missing attachments", "Keep German legally cautious", "Create CRM follow-up note"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="optionalChecks" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked={item !== "Create CRM follow-up note"} />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-5">
          <div className="text-sm font-bold text-steel">Estimated output: reply, intent, risk, opportunity, next steps</div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="h-11 rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
              Save Draft
            </button>
            <FormSubmitButton idleLabel="Generate Reply" pendingLabel="German Email Employee is working..." />
          </div>
        </div>
      </form>

      {false && (
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Email Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">A quick pre-reply reading of intent, risk and next action.</p>
          <div className="mt-4 space-y-3">
            {quickSignals.map((item) => (
              <div key={item.label} className="rounded-md border border-line p-3">
                <div className="mb-2 text-xs font-black uppercase text-steel">{item.label}</div>
                <p className="text-sm font-bold leading-5 text-graphite">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
                <p className="text-sm text-steel">Structured result format.</p>
              </div>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {replySections.map((section) => (
              <div key={section.label} className="rounded-md bg-mist p-3">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label === "German reply" ? <Languages className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {section.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-line p-4">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
              <Languages className="h-4 w-4" />
              Use and Copy
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber" />
            <div>
              <h3 className="text-sm font-black text-amber-800">Opportunity Prompt</h3>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                If the client asks about timing, attach the latest quotation and include one clear next action instead of only answering the question.
              </p>
            </div>
          </div>
        </section>
      </aside>
      )}
    </div>
  );
}
