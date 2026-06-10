"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import type { GeneratedTaskOutput } from "@/lib/task-output";

function formatSections(output: GeneratedTaskOutput | null) {
  return (output?.sections || []).map((section) => `${section.label}\n${section.body}`).join("\n\n");
}

function findSectionBody(output: GeneratedTaskOutput | null, patterns: RegExp[]) {
  const sections = output?.sections || [];
  return sections.find((section) => patterns.some((pattern) => pattern.test(section.label)))?.body || "";
}

function primaryCopyText(employeeId: string, output: GeneratedTaskOutput | null) {
  if (employeeId === "german-email") {
    return findSectionBody(output, [/german.*reply/i, /deutsche.*antwort/i, /^reply$/i]) || (output?.sections || [])[0]?.body || "";
  }

  if (employeeId === "supplier") {
    return findSectionBody(output, [/supplier.*email/i, /supplier.*message/i, /inquiry/i, /email/i]) || (output?.sections || [])[0]?.body || "";
  }

  if (employeeId === "meeting") {
    return findSectionBody(output, [/meeting.*summary/i, /summary/i, /会议摘要/, /會議摘要/]) || (output?.sections || [])[0]?.body || "";
  }

  return formatSections(output);
}

export function TaskResultActions({ taskId, employeeId, output }: { taskId: string; employeeId: string; output: GeneratedTaskOutput | null }) {
  const [copied, setCopied] = useState(false);
  const downloadLabel = output?.downloadLabel || "Download Word Report";
  const copyText = useMemo(() => {
    return primaryCopyText(employeeId, output);
  }, [employeeId, output]);

  async function copyPrimaryOutput() {
    if (!copyText) return;
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyPrimaryOutput}
        className="inline-flex h-11 items-center gap-2 rounded-md bg-navy px-5 text-sm font-black text-white"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Use and Copy"}
      </button>
      <Link href={`/api/tasks/${taskId}/word`} className="inline-flex h-11 items-center gap-2 rounded-md bg-blue px-5 text-sm font-black text-white">
        <Download className="h-4 w-4" />
        {downloadLabel}
      </Link>
      <Link href="/dashboard" className="inline-flex h-11 items-center rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
        Return to Dashboard
      </Link>
    </div>
  );
}
