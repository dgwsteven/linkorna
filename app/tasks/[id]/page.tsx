import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { TaskResultActions } from "@/components/TaskResultActions";
import { employees } from "@/lib/data";
import { getLinkornaAuthContext } from "@/lib/linkorna-session";
import type { GeneratedTaskOutput } from "@/lib/task-output";

type TaskRecord = {
  id: string;
  title: string;
  status: string;
  employee_id: string;
  input: Record<string, unknown> | null;
  output: GeneratedTaskOutput | null;
  created_at: string;
};

function formatInputSummary(input: Record<string, unknown> | null) {
  if (!input) return "No input summary saved.";

  const entries = Object.entries(input)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .slice(0, 6)
    .map(([key, value]) => {
      const printable = Array.isArray(value)
        ? value.join(", ")
        : typeof value === "object"
          ? "uploaded file"
          : String(value);
      return `${key}: ${printable}`;
    });

  return entries.length ? entries.join(" | ") : "No input summary saved.";
}

export default async function TaskResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getLinkornaAuthContext();

  if (!user) {
    return (
      <main>
        <Header />
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h1 className="text-lg font-black text-navy">Login session was not received.</h1>
            <p className="mt-2 text-sm leading-6 text-steel">
              LINKORNA could not read the secure login cookie on this task result request.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`/auth/check?next=/tasks/${id}`} className="inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
                Check login session
              </a>
              <a href={`/login?next=/tasks/${id}`} className="inline-flex h-11 items-center rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
                Login again
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { data: task } = await supabase.from("tasks").select("*").eq("id", id).single<TaskRecord>();

  if (!task) {
    notFound();
  }

  const employee = employees.find((item) => item.id === task.employee_id);
  const output = task.output;
  const sections = Array.isArray(output?.sections) ? output.sections : [];

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase text-accent">Task Result</p>
              <h1 className="mt-2 text-3xl font-black text-navy">{task.title || output?.title || "Generated output"}</h1>
              <p className="mt-2 text-steel">AI employee used: {employee?.name ?? task.employee_id}</p>
              <p className="mt-1 text-sm font-bold text-steel">
                {task.status} - {new Date(task.created_at).toLocaleString("en-GB")}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-md bg-mist p-4">
            <div className="text-sm font-black text-navy">Input Summary</div>
            <p className="mt-1 text-sm leading-6 text-graphite">{output?.summary ?? formatInputSummary(task.input)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {sections.map((section) => (
            <section key={section.label} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-base font-black text-navy">{section.label}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-graphite">{section.body}</p>
            </section>
          ))}
        </div>

        <TaskResultActions taskId={task.id} employeeId={task.employee_id} output={output} />
      </section>
    </main>
  );
}
