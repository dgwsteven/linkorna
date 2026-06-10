"use client";

import { createContext, type FormEvent, type ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const FormSubmittingContext = createContext(false);
const FormPhaseContext = createContext<"idle" | "checking" | "working">("idle");

export function useEmployeeTaskSubmitting() {
  return useContext(FormSubmittingContext);
}

export function useEmployeeTaskPhase() {
  return useContext(FormPhaseContext);
}

export function EmployeeTaskForm({
  id,
  employeeId,
  className,
  children
}: {
  id: string;
  employeeId: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "checking" | "working">("idle");

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setSubmitting(true);
    setPhase("checking");
    try {
      const authResponse = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });
      const authStatus = await authResponse.json().catch(() => null);

      if (!authStatus?.authenticated) {
        router.push(`/login?message=${encodeURIComponent("Please login before generating a task.")}&next=/employees/${employeeId}`);
        return;
      }

      setPhase("working");
      const formData = new FormData(form);
      formData.set("employeeId", employeeId);

      const response = await fetch(`/api/tasks?employeeId=${encodeURIComponent(employeeId)}`, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
      });

      if (response.status === 401) {
        router.push(`/login?message=${encodeURIComponent("Please login before generating a task.")}&next=/employees/${employeeId}`);
        return;
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.taskUrl) {
        throw new Error(payload?.error || "Task could not be generated.");
      }

      router.push(payload.taskUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Task could not be generated.";
      router.push(`/employees/${employeeId}?message=${encodeURIComponent(message)}`);
    } finally {
      setSubmitting(false);
      setPhase("idle");
    }
  }

  return (
    <FormSubmittingContext.Provider value={submitting}>
      <FormPhaseContext.Provider value={phase}>
        <form id={id} onSubmit={submitTask} className={className}>
          {children}
        </form>
      </FormPhaseContext.Provider>
    </FormSubmittingContext.Provider>
  );
}
