"use client";

import { Wand2 } from "lucide-react";
import { useEmployeeTaskPhase, useEmployeeTaskSubmitting } from "@/components/EmployeeTaskForm";

export function FormSubmitButton({ idleLabel, pendingLabel }: { idleLabel: string; pendingLabel?: string }) {
  const pending = useEmployeeTaskSubmitting();
  const phase = useEmployeeTaskPhase();
  const label = phase === "checking" ? "Checking login..." : pendingLabel || "AI employee is working...";

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center gap-2 rounded-md bg-blue px-5 text-sm font-black text-white disabled:cursor-wait disabled:opacity-75"
    >
      <Wand2 className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
      {pending ? label : idleLabel}
    </button>
  );
}
