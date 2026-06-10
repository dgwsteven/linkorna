"use client";

import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
  Target,
  Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmployeeTaskForm } from "@/components/EmployeeTaskForm";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const marketplaces = ["Amazon Germany", "Amazon EU", "eBay Germany", "Otto Market", "Kaufland.de", "Shopify", "Etsy", "TikTok Shop", "Temu", "Other"];
const analysisGoals = ["Improve my listing", "Find pricing gap", "Extract keywords", "Analyze review pain points", "Compare positioning", "Prepare launch strategy", "Other"];

const competitorChecklist = [
  "Competitor title, bullets and positioning",
  "Price, offer structure and delivery promise",
  "Keyword opportunities and missing angles",
  "Review pain points and listing improvement actions"
];

const diagnosisByGoal: Record<string, string[]> = {
  "Improve my listing": [
    "竞品强调稳定和交付速度",
    "你的页面需要更清楚地说明适配范围",
    "标题可加入更多购买场景关键词",
    "图片和 FAQ 应补足买家疑虑"
  ],
  "Find pricing gap": [
    "竞品价格集中在中低区间",
    "高价产品通常强化质保和材质",
    "你的定价需要对应明确卖点",
    "可以用套装或配件提高客单价"
  ],
  "Extract keywords": [
    "核心词来自标题前半段",
    "长尾词来自功能、材质和场景",
    "评论区可发现真实搜索表达",
    "后端关键词应避免重复堆砌"
  ],
  "Analyze review pain points": [
    "差评集中在稳定性和尺寸不清",
    "买家在意包装、耐用和售后",
    "图片需要提前解释兼容范围",
    "FAQ 应处理购买前疑虑"
  ],
  "Compare positioning": [
    "竞品偏功能型表达",
    "缺少品牌化和场景化叙事",
    "你的页面可突出更清楚的使用场景",
    "对标点应分为价格、质量和信任"
  ],
  "Prepare launch strategy": [
    "先用核心关键词建立基础曝光",
    "用差异化卖点避开价格战",
    "围绕评论痛点补充图片和 FAQ",
    "上线后重点监控转化和差评主题"
  ],
  Other: [
    "先确认分析目标",
    "提取竞品标题和卖点",
    "比较价格、关键词和评论",
    "输出可执行优化动作"
  ]
};

const outputByGoal: Record<string, { label: string; body: string }[]> = {
  "Improve my listing": [
    {
      label: "Competitor summary",
      body:
        "The benchmark listing focuses on stability, foldable design and quick desk setup, but it does not clearly explain compatibility range or after-sales confidence."
    },
    {
      label: "Listing gap",
      body:
        "Your listing should add clearer laptop size compatibility, package contents, warranty language and use-case photos for home office, travel and student desks."
    },
    {
      label: "Recommended actions",
      body:
        "Rewrite the title with core keyword first; add compatibility chart; add FAQ for laptop size; include comparison image against flat laptop use."
    },
    {
      label: "Transfer to Listing Employee",
      body:
        "Use the benchmark product link as the Reference product link in E-commerce Listing Employee, then generate a platform-specific final listing."
    }
  ],
  "Find pricing gap": [
    {
      label: "Price positioning",
      body: "Competitors cluster around entry-level pricing. A higher price is possible only if warranty, material and packaging advantages are visible."
    },
    {
      label: "Offer gap",
      body: "Most listings sell a single stand. Bundle options, carry pouch or extended warranty could create a price ladder."
    },
    {
      label: "Recommended actions",
      body: "Create good / better / best price tiers and test whether added accessories improve conversion."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Use the chosen pricing position as Positioning when generating the final listing copy."
    }
  ],
  "Extract keywords": [
    {
      label: "Core keywords",
      body: "laptop stand, notebook riser, aluminum laptop holder, ergonomic stand, foldable desk stand."
    },
    {
      label: "Long-tail keywords",
      body: "laptop stand for desk, foldable laptop stand travel, aluminum notebook holder, ergonomic laptop riser home office."
    },
    {
      label: "Keyword usage",
      body: "Use the strongest keyword in title, distribute long-tail keywords in bullets and avoid repeating the exact phrase too often."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Paste these terms into Main keywords before generating the listing."
    }
  ],
  "Analyze review pain points": [
    {
      label: "Review pain points",
      body: "Buyers complain about wobble, unclear laptop compatibility, weak hinges and missing size information."
    },
    {
      label: "Buyer objections",
      body: "Will it fit my laptop? Is it stable enough? Does it scratch the desk? Is it easy to carry?"
    },
    {
      label: "Recommended actions",
      body: "Add compatibility chart, anti-slip detail image, hinge close-up and FAQ answering stability concerns."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Use these pain points as product feature and FAQ inputs."
    }
  ],
  "Compare positioning": [
    {
      label: "Positioning map",
      body: "Competitor A is low-price practical. Competitor B is premium material. Competitor C is travel-focused."
    },
    {
      label: "Opportunity",
      body: "There is room for a practical premium position: stable aluminum, clear compatibility and everyday desk organization."
    },
    {
      label: "Recommended actions",
      body: "Avoid copying the lowest price listing. Build a clearer value story around reliability, fit and daily use."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Choose Premium quality or Practical value as Positioning depending on your price target."
    }
  ],
  "Prepare launch strategy": [
    {
      label: "Launch angle",
      body: "Start with a practical desk organization angle and use competitor review pain points to build image and FAQ content."
    },
    {
      label: "First tests",
      body: "Test title keyword order, main image angle, compatibility chart and price tier."
    },
    {
      label: "Recommended actions",
      body: "Launch with clear keyword title, then update bullets after first traffic and review feedback."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Use the final angle as Positioning and the keyword set as Main keywords."
    }
  ],
  Other: [
    {
      label: "Competitor summary",
      body: "Analyze the benchmark listing, extract its strongest claims and compare them with your product information."
    },
    {
      label: "Opportunity",
      body: "Identify missing information, weak buyer trust points and positioning gaps."
    },
    {
      label: "Recommended actions",
      body: "Turn the analysis into concrete title, bullet, image, FAQ and keyword actions."
    },
    {
      label: "Transfer to Listing Employee",
      body: "Use the resulting benchmark link and keywords in the Listing Employee."
    }
  ]
};

export function CompetitorWorkspace({ selectedGoal = "Improve my listing" }: { selectedGoal?: string }) {
  const router = useRouter();
  const goal = analysisGoals.includes(selectedGoal) ? selectedGoal : "Improve my listing";
  const diagnosis = diagnosisByGoal[goal];
  const outputSections = outputByGoal[goal];

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Analysis Scope</h2>
              <p className="text-sm text-steel">Competitive signals this employee extracts.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {competitorChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Analysis Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Analysis goal</span>
              <select
                form="competitor-task-form"
                name="goalSelector"
                className="field"
                value={goal}
                onChange={(event) => {
                  router.push(`/employees/competitor?goal=${encodeURIComponent(event.currentTarget.value)}`);
                }}
              >
                {analysisGoals.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Marketplace</span>
              <select form="competitor-task-form" name="marketplace" className="field">
                {marketplaces.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Output focus</span>
              <select form="competitor-task-form" name="outputFocus" className="field">
                <option>Actionable listing improvements</option>
                <option>Keyword set</option>
                <option>Pricing and offer position</option>
                <option>Review pain points</option>
                <option>Launch plan</option>
              </select>
            </label>
          </div>
        </section>
      </aside>

      <EmployeeTaskForm id="competitor-task-form" employeeId="competitor" className="rounded-lg border border-line bg-white shadow-panel">
        <input type="hidden" name="goal" value={goal} />
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Competitor Analysis Brief</h2>
              <p className="text-sm text-steel">Paste competitor listings and your product context to generate actionable market intelligence.</p>
            </div>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
              Business employee
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Competitor product link</span>
            <input name="competitorLink" className="field" placeholder="Paste Amazon, eBay, Otto, Kaufland, Shopify or other product URL" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">ASIN / SKU / item ID</span>
              <input name="itemId" className="field" placeholder="Optional" />
            </label>
            <label className="grid gap-2">
              <span className="label">Your target price</span>
              <input name="targetPrice" className="field" placeholder="Example: 19.99 EUR" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Your product link or description</span>
            <textarea
              name="ownProduct"
              className="field min-h-36 resize-y"
              placeholder="Paste your live product link, or describe your product, features, target customer, materials, packaging and warranty."
            />
          </label>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Include in analysis
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Title and bullets", "Price and offer", "Keywords", "Review pain points", "Image/content gaps", "Actions for Listing Employee"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="includeItems" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-line p-5">
          <FormSubmitButton idleLabel="Analyze Competitor" pendingLabel="Competitor Intelligence Employee is working..." />
        </div>
      </EmployeeTaskForm>

      {false && (
      <aside className="space-y-4">
        <section className="min-h-[320px] rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Competitor Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">Brief strategic reading before the full analysis.</p>
          <div className="mt-4 grid gap-2">
            {diagnosis.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-line p-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-mist text-xs font-black text-navy">{index + 1}</span>
                <p className="text-sm font-bold leading-5 text-graphite">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[680px] rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
                <p className="text-sm text-steel">Actionable competitor intelligence for listing and launch decisions.</p>
              </div>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {outputSections.map((section) => (
              <div key={section.label} className="rounded-md bg-mist p-3">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label.includes("Keyword") || section.label.includes("Core") ? <Search className="h-4 w-4" /> : section.label.includes("Transfer") ? <ExternalLink className="h-4 w-4" /> : section.label.includes("Opportunity") || section.label.includes("Positioning") ? <Target className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {section.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-line p-4">
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
                <ExternalLink className="h-4 w-4" />
                Send to Listing
              </button>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-blue px-4 text-sm font-black text-white">
                <Download className="h-4 w-4" />
                Download Word Report
              </button>
            </div>
          </div>
        </section>
      </aside>
      )}
    </div>
  );
}
