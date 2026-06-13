import Link from "next/link";
import { Download, FileText, Search } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { employees } from "@/lib/data";
import { getLinkornaAuthContext } from "@/lib/linkorna-session";

type DocumentTask = {
  id: string;
  title: string;
  status: string;
  employee_id: string;
  created_at: string;
};

function employeeName(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? employeeId;
}

function employeePlan(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId)?.plan ?? "Starter";
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DocumentsPage() {
  const { supabase, user } = await getLinkornaAuthContext();

  if (!user) {
    return (
      <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <section className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h1 className="text-lg font-black text-navy">Please login again.</h1>
            <p className="mt-2 text-sm leading-6 text-steel">
              LINKORNA could not confirm a secure browser login for this document library request.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/auth/check?next=/documents" className="inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
                Check login
              </Link>
              <Link href="/login?next=/documents" className="inline-flex h-11 items-center rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
                Login again
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();
  const workspaceId = profile?.workspace_id;

  const { data: tasks } = workspaceId
    ? await supabase
        .from("tasks")
        .select("id,title,status,employee_id,created_at")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(100)
        .returns<DocumentTask[]>()
    : { data: [] };

  const documents = tasks ?? [];
  const completed = documents.filter((task) => task.status === "completed").length;
  const employeeCount = new Set(documents.map((task) => task.employee_id)).size;

  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-navy">Documents</h1>
            <p className="mt-2 text-steel">Review generated outputs, open task results, and download Word reports.</p>
          </div>
          <Link href="/dashboard#employees" className="inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
            Create New Document
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Total documents</div>
            <div className="mt-2 text-3xl font-black text-navy">{documents.length}</div>
            <p className="mt-1 text-sm text-steel">Latest 100 generated tasks</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-accent bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Completed</div>
            <div className="mt-2 text-3xl font-black text-navy">{completed}</div>
            <p className="mt-1 text-sm text-steel">Ready to copy or download</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-amber bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Employees used</div>
            <div className="mt-2 text-3xl font-black text-navy">{employeeCount}</div>
            <p className="mt-1 text-sm text-steel">Across your AI workforce</p>
          </div>
        </div>

        <section className="mt-6 rounded-lg border border-line bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div>
              <h2 className="font-black text-navy">Document library</h2>
              <p className="mt-1 text-sm text-steel">Generated outputs are saved here automatically after each AI employee task.</p>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-md border border-line bg-mist px-3 text-sm font-bold text-steel">
              <Search className="h-4 w-4" />
              Latest generated documents
            </div>
          </div>

          {documents.length ? (
            <div className="divide-y divide-line">
              {documents.map((task) => (
                <div key={task.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_160px_120px_220px] lg:items-center">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-mist text-blue">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <Link href={`/tasks/${task.id}`} className="font-black text-navy hover:text-blue">
                        {task.title}
                      </Link>
                      <div className="mt-1 text-sm text-steel">{employeeName(task.employee_id)}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-graphite">{employeePlan(task.employee_id)}</div>
                  <div className="text-sm font-bold text-steel">{dateLabel(task.created_at)}</div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link href={`/tasks/${task.id}`} className="inline-flex h-10 items-center rounded-md border border-line bg-white px-3 text-sm font-black text-navy">
                      Open
                    </Link>
                    <Link href={`/api/tasks/${task.id}/word`} className="inline-flex h-10 items-center gap-2 rounded-md bg-blue px-3 text-sm font-black text-white">
                      <Download className="h-4 w-4" />
                      Word
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-mist text-blue">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-lg font-black text-navy">No documents yet</h2>
              <p className="mt-2 text-sm text-steel">Run any AI employee task and the result will appear here automatically.</p>
              <Link href="/dashboard#employees" className="mt-5 inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
                Start First Task
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
