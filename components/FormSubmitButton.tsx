"use client";

import { Wand2 } from "lucide-react";
import { useEmployeeTaskSubmitting } from "@/components/EmployeeTaskForm";

export function FormSubmitButton({ idleLabel, pendingLabel }: { idleLabel: string; pendingLabel?: string }) {
  const pending = useEmployeeTaskSubmitting();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center gap-2 rounded-md bg-blue px-5 text-sm font-black text-white disabled:cursor-wait disabled:opacity-75"
    >
      <Wand2 className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
      {pending ? pendingLabel || "AI employee is working..." : idleLabel}
    </button>
  );
}
