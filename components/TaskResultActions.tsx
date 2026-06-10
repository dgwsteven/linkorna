"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import type { GeneratedTaskOutput } from "@/lib/task-output";

export function TaskResultActions({ taskId, output }: { taskId: string; output: GeneratedTaskOutput | null }) {
  const [copied, setCopied] = useState(false);
  const copyLabel = output?.copySectionLabel || "Output";
  const downloadLabel = output?.downloadLabel || "Download Word Report";
  const copyText = useMemo(() => {
    const sections = output?.sections || [];
    const target = sections.find((section) => section.label === copyLabel) || sections[0];
    return target ? target.body : "";
  }, [copyLabel, output]);

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
        {copied ? "Copied" : `Use and Copy ${copyLabel}`}
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
