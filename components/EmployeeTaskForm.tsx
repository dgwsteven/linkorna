"use client";

import { createContext, type FormEvent, type ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const FormSubmittingContext = createContext(false);
export type EmployeeTaskPhase = "idle" | "checking" | "preparing" | "analyzing" | "generating" | "saving" | "redirecting";
const FormPhaseContext = createContext<EmployeeTaskPhase>("idle");

const phaseCopy: Record<Exclude<EmployeeTaskPhase, "idle">, { title: string; body: string }> = {
  checking: {
    title: "Checking secure login",
    body: "LINKORNA is confirming your browser session before starting the task."
  },
  preparing: {
    title: "Preparing your material",
    body: "Files and form details are being uploaded, extracted, or transcribed into readable task input."
  },
  analyzing: {
    title: "AI employee is analyzing",
    body: "The employee is reading the context, selecting the right structure, and checking risks."
  },
  generating: {
    title: "Generating the result",
    body: "The final output is being written with the selected language, audience, and task settings."
  },
  saving: {
    title: "Saving your task",
    body: "LINKORNA is saving the result so it appears in Documents, Recent Tasks, and usage statistics."
  },
  redirecting: {
    title: "Opening result page",
    body: "Your output is ready. The result page will open automatically."
  }
};

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
  const [phase, setPhase] = useState<EmployeeTaskPhase>("idle");
  const [error, setError] = useState("");

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const timers: number[] = [];
    const schedulePhase = (nextPhase: EmployeeTaskPhase, delay: number) => {
      timers.push(window.setTimeout(() => setPhase(nextPhase), delay));
    };

    setError("");
    setSubmitting(true);
    setPhase("checking");
    try {
      const currentOrigin = window.location.origin;
      const currentHost = window.location.hostname;

      if (currentHost === "127.0.0.1" || currentHost === "localhost") {
        setError("Please generate tasks on https://linkorna.com. Local preview and production do not share the same login session.");
        return;
      }

      const authResponse = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });
      const authStatus = await authResponse.json().catch(() => null);

      if (!authStatus?.authenticated) {
        setError(`Your login session is not active on ${currentOrigin}. Please login again on linkorna.com, then return to this task.`);
        return;
      }

      setPhase("preparing");
      schedulePhase("analyzing", 900);
      schedulePhase("generating", 2600);
      const formData = new FormData(form);
      formData.set("employeeId", employeeId);

      const response = await fetch(`/api/tasks?employeeId=${encodeURIComponent(employeeId)}`, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        setError("Your login session expired while the employee was working. Please login again, then submit the task once more.");
        return;
      }

      if (response.status === 402) {
        setError(payload?.error || "This employee requires a higher plan or more available task quota.");
        return;
      }

      if (!response.ok || !payload?.taskUrl) {
        throw new Error(payload?.error || "Task could not be generated.");
      }

      setPhase("saving");
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      setPhase("redirecting");
      router.push(payload.taskUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Task could not be generated.";
      setError(message);
    } finally {
      timers.forEach((timer) => window.clearTimeout(timer));
      setSubmitting(false);
      setPhase("idle");
    }
  }

  return (
    <FormSubmittingContext.Provider value={submitting}>
      <FormPhaseContext.Provider value={phase}>
        <form id={id} onSubmit={submitTask} className={className}>
          {error ? <div className="m-5 rounded-md bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">{error}</div> : null}
          {submitting && phase !== "idle" ? (
            <div className="m-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-blue" />
                <div>
                  <div className="text-sm font-black text-navy">{phaseCopy[phase].title}</div>
                  <p className="mt-1 text-sm font-bold leading-6 text-steel">{phaseCopy[phase].body}</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-blue transition-all duration-500"
                  style={{
                    width:
                      phase === "checking"
                        ? "12%"
                        : phase === "preparing"
                          ? "28%"
                          : phase === "analyzing"
                            ? "48%"
                            : phase === "generating"
                              ? "72%"
                              : phase === "saving"
                                ? "90%"
                                : "100%"
                  }}
                />
              </div>
            </div>
          ) : null}
          {children}
        </form>
      </FormPhaseContext.Provider>
    </FormSubmittingContext.Provider>
  );
}
