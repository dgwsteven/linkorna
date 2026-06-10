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
  const [error, setError] = useState("");

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setError("");
    setSubmitting(true);
    setPhase("checking");
    try {
      const currentOrigin = window.location.origin;
      const currentHost = window.location.hostname;

      if (currentHost === "127.0.0.1" || currentHost === "localhost") {
        setError("You are using the local preview address. Please test logged-in generation on https://linkorna.com because local preview and production do not share login sessions.");
        return;
      }

      const authResponse = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });
      const authStatus = await authResponse.json().catch(() => null);

      if (!authStatus?.authenticated) {
        setError(`Login check failed on ${currentOrigin}. Please open /api/auth/status in the same tab. Current response: ${JSON.stringify(authStatus)}`);
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

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        setError(`Task API rejected the logged-in session. Auth check was true, but /api/tasks returned 401. Details: ${JSON.stringify(payload)}`);
        return;
      }

      if (!response.ok || !payload?.taskUrl) {
        throw new Error(payload?.error || "Task could not be generated.");
      }

      router.push(payload.taskUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Task could not be generated.";
      setError(message);
    } finally {
      setSubmitting(false);
      setPhase("idle");
    }
  }

  return (
    <FormSubmittingContext.Provider value={submitting}>
      <FormPhaseContext.Provider value={phase}>
        <form id={id} onSubmit={submitTask} className={className}>
          {error ? <div className="m-5 rounded-md bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">{error}</div> : null}
          {children}
        </form>
      </FormPhaseContext.Provider>
    </FormSubmittingContext.Provider>
  );
}
