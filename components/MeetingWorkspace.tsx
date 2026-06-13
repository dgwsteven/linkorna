"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Languages,
  ListChecks,
  MailCheck,
  Mic2,
  UploadCloud,
  Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmployeeTaskForm } from "@/components/EmployeeTaskForm";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const meetingTypes = ["Supplier negotiation", "Client sales meeting", "Internal project meeting", "Product review", "Executive decision meeting", "Other"];
const outputAudiences = ["Chinese internal team", "German client follow-up", "English client follow-up", "Bilingual Chinese + English", "Bilingual Chinese + German", "Other"];
const detailLevels = ["Executive summary", "Detailed minutes", "Action-item focused", "Client follow-up focused"];

const meetingChecklist = [
  "Meeting summary and key decisions",
  "Action items with owners and deadlines",
  "Client or supplier follow-up email",
  "Downloadable meeting report"
];

const diagnosisByAudience: Record<string, string[]> = {
  "Chinese internal team": [
    "先提炼会议结论",
    "明确负责人和截止时间",
    "标记风险和未决问题",
    "整理下一步内部动作"
  ],
  "German client follow-up": [
    "Entscheidungen neutral zusammenfassen",
    "Naechste Schritte klar bestaetigen",
    "Offene Punkte hoeflich formulieren",
    "Keine internen Risikokommentare senden"
  ],
  "English client follow-up": [
    "Summarize decisions clearly",
    "Confirm next steps and owners",
    "Keep open points diplomatic",
    "Do not expose internal risk notes"
  ],
  "Bilingual Chinese + English": [
    "中文内部纪要要直接",
    "英文客户跟进要中性",
    "行动项要双语可追踪",
    "内部风险和外部措辞分开"
  ],
  "Bilingual Chinese + German": [
    "中文内部纪要要直接",
    "德语客户跟进要礼貌",
    "行动项要双语可追踪",
    "内部判断和外部邮件分开"
  ],
  Other: [
    "先确认输出对象",
    "总结结论和行动项",
    "区分内部记录和外部跟进",
    "生成可下载报告"
  ]
};

const outputByAudience: Record<string, { label: string; body: string }[]> = {
  "Chinese internal team": [
    {
      label: "会议摘要",
      body: "本次会议主要讨论交期、报价调整、技术文件补充和下一阶段执行安排。客户对交付时间仍然关注，需要尽快给出书面确认。"
    },
    {
      label: "关键决定",
      body: "交付目标暂定为七月中旬；销售团队本周内发送更新报价；技术团队补充产品规格文件。"
    },
    {
      label: "行动项",
      body: "发送更新报价 - Sales - Friday；确认交付日期 - Operations - Monday；补充技术文件 - Product - Wednesday。"
    },
    {
      label: "内部风险提示",
      body: "客户对时间线敏感，若交期再次变化，需要提前准备替代方案和解释口径。"
    }
  ],
  "German client follow-up": [
    {
      label: "Meeting summary",
      body: "Vielen Dank fuer das produktive Gespraech. Wir haben die Lieferplanung, die aktualisierte Preisstellung und die noch offenen technischen Unterlagen besprochen."
    },
    {
      label: "Key decisions",
      body: "Die Lieferung bleibt vorlaeufig fuer Mitte Juli geplant. Das aktualisierte Angebot wird diese Woche zugesendet."
    },
    {
      label: "Action items",
      body: "Aktualisiertes Angebot senden; Liefertermin schriftlich bestaetigen; technische Unterlagen nachreichen."
    },
    {
      label: "Follow-up email",
      body: "Sehr geehrter Herr Schneider, vielen Dank fuer das angenehme Gespraech. Wie besprochen senden wir Ihnen das aktualisierte Angebot bis Freitag zu."
    }
  ],
  "English client follow-up": [
    {
      label: "Meeting summary",
      body: "Thank you for the productive meeting. We discussed delivery timing, revised pricing and the remaining technical documents required for the next step."
    },
    {
      label: "Key decisions",
      body: "Delivery remains targeted for mid-July. The updated quotation will be sent this week."
    },
    {
      label: "Action items",
      body: "Send revised quotation; confirm delivery date in writing; provide updated technical documents."
    },
    {
      label: "Follow-up email",
      body: "Dear Mr. Schneider, thank you for the productive meeting. As discussed, we will send the revised quotation by Friday."
    }
  ]
};

outputByAudience["Bilingual Chinese + English"] = [
  ...outputByAudience["Chinese internal team"],
  ...outputByAudience["English client follow-up"]
];

outputByAudience["Bilingual Chinese + German"] = [
  ...outputByAudience["Chinese internal team"],
  ...outputByAudience["German client follow-up"]
];

outputByAudience.Other = outputByAudience["Chinese internal team"];

function enrichMeetingOutput(sections: { label: string; body: string }[], audience: string, detailLevel: string) {
  const summaryLabel = audience === "Chinese internal team" || audience.startsWith("Bilingual Chinese") ? "会议摘要" : "Meeting summary";
  const actionLabel = audience === "Chinese internal team" || audience.startsWith("Bilingual Chinese") ? "行动项" : "Action items";

  if (detailLevel === "Detailed minutes") {
    return sections.map((section) => {
      if (section.label === summaryLabel || section.label === "Meeting summary") {
        return {
          ...section,
          body:
            section.body +
            " The detailed minutes should also cover meeting background, participant positions, discussed alternatives, unresolved concerns, agreed assumptions, commercial impact, risk items and the exact sequence of next steps. It should be long enough for a manager who did not attend the meeting to understand what happened and what needs to be done."
        };
      }
      return section;
    });
  }

  if (detailLevel === "Action-item focused") {
    return sections.map((section) => {
      if (section.label === actionLabel || section.label === "Action items") {
        return {
          ...section,
          body:
            section.body +
            " Each action item should include owner, deadline, priority, dependency, expected output and follow-up channel so the team can execute without re-listening to the meeting."
        };
      }
      return section;
    });
  }

  if (detailLevel === "Client follow-up focused") {
    return sections.map((section) => {
      if (section.label.includes("email") || section.label.includes("Follow-up")) {
        return {
          ...section,
          body:
            section.body +
            " The client-facing version should be polished, diplomatic and ready to send, while avoiding internal risk comments or unconfirmed commitments."
        };
      }
      return section;
    });
  }

  return sections;
}

export function MeetingWorkspace({
  selectedAudience = "Chinese internal team",
  selectedDetailLevel = "Executive summary"
}: {
  selectedAudience?: string;
  selectedDetailLevel?: string;
}) {
  const router = useRouter();
  const audience = outputAudiences.includes(selectedAudience) ? selectedAudience : "Chinese internal team";
  const detailLevel = detailLevels.includes(selectedDetailLevel) ? selectedDetailLevel : "Executive summary";
  const diagnosis = diagnosisByAudience[audience];
  const outputSections = enrichMeetingOutput(outputByAudience[audience], audience, detailLevel);
  const pushMeetingUrl = (next: { audience?: string; detailLevel?: string }) => {
    const params = new URLSearchParams({
      audience: next.audience ?? audience,
      detailLevel: next.detailLevel ?? detailLevel
    });
    router.push(`/employees/meeting?${params.toString()}`);
  };

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <Mic2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Meeting Scope</h2>
              <p className="text-sm text-steel">What this employee creates after the meeting.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {meetingChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Output Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Output audience</span>
              <select
                form="meeting-task-form"
                name="audienceSelector"
                className="field"
                value={audience}
                onChange={(event) => {
                  pushMeetingUrl({ audience: event.currentTarget.value });
                }}
              >
                {outputAudiences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Meeting type</span>
              <select form="meeting-task-form" name="meetingType" className="field">
                {meetingTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Detail level</span>
              <select
                form="meeting-task-form"
                name="detailLevelSelector"
                className="field"
                value={detailLevel}
                onChange={(event) => {
                  pushMeetingUrl({ detailLevel: event.currentTarget.value });
                }}
              >
                {detailLevels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </aside>

      <EmployeeTaskForm id="meeting-task-form" employeeId="meeting" className="rounded-lg border border-line bg-white shadow-panel">
        <input type="hidden" name="audience" value={audience} />
        <input type="hidden" name="detailLevel" value={detailLevel} />
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Meeting Material</h2>
              <p className="text-sm text-steel">Upload meeting recordings or paste transcript/context to generate minutes and follow-up actions.</p>
            </div>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
              Executive employee
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Upload transcript or meeting notes</span>
            <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-line bg-mist p-4 text-center text-sm font-bold text-steel">
              <UploadCloud className="mr-2 h-5 w-5" />
              Select TXT, DOCX or readable PDF meeting transcripts
            </div>
            <input name="meetingFiles" className="sr-only" type="file" multiple accept=".txt,.doc,.docx,.pdf" />
            <span className="text-xs font-bold text-steel">Audio/video transcription will be added later. For now, upload or paste readable transcript text.</span>
          </label>

          <label className="grid gap-2">
            <span className="label">Meeting transcript or rough notes</span>
            <textarea
              name="meetingTranscript"
              className="field min-h-44 resize-y"
              placeholder="Paste transcript, rough notes, chat export or meeting dialogue here. The more concrete the notes are, the better the minutes will be."
            />
          </label>

          <label className="grid gap-2">
            <span className="label">Meeting context (optional)</span>
            <textarea
              name="meetingContext"
              className="field min-h-32 resize-y"
              placeholder="Add participants, meeting goal, background, client name, supplier name, project context or important terms."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Meeting language</span>
              <select name="meetingLanguage" className="field">
                <option>Chinese</option>
                <option>German</option>
                <option>English</option>
                <option>Mixed Chinese + English</option>
                <option>Mixed Chinese + German</option>
                <option>German + English + Chinese</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Follow-up owner</span>
              <select name="followupOwner" className="field">
                <option>Sales team</option>
                <option>Operations team</option>
                <option>Procurement team</option>
                <option>Founder / management</option>
                <option>Project manager</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Include in report
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Summary", "Key decisions", "Action items", "Open questions", "Follow-up email", "Downloadable report"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="includeItems" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-line p-5">
          <FormSubmitButton idleLabel="Generate Minutes" pendingLabel="Meeting Recorder Employee is working..." />
        </div>
      </EmployeeTaskForm>

      {false && (
      <aside className="space-y-4">
        <section className="min-h-[320px] rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Meeting Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">Brief guide before producing the full report.</p>
          <div className="mt-4 grid gap-2">
            {diagnosis.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-line p-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-mist text-xs font-black text-navy">{index + 1}</span>
                <p className="text-sm font-bold leading-5 text-graphite">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[860px] rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
                <p className="text-sm text-steel">Audience-aware meeting minutes and follow-up package.</p>
              </div>
              <FileText className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {outputSections.map((section) => (
              <div key={section.label} className="min-h-32 rounded-md bg-mist p-4">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label.includes("email") || section.label.includes("Follow-up") ? <MailCheck className="h-4 w-4" /> : section.label.includes("Action") || section.label.includes("行动") ? <ListChecks className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
                  {section.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-line p-4">
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
                <FileText className="h-4 w-4" />
                Copy Meeting Summary
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
