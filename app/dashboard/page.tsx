import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { PlanBadge } from "@/components/PlanBadge";
import { Sidebar } from "@/components/Sidebar";
import { employees, type PlanName } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type TaskRow = {
  id: string;
  title: string;
  status: string;
  employee_id: string;
  created_at: string;
};

type WorkspaceRow = {
  name: string | null;
  plan: PlanName | null;
  monthly_task_limit: number | null;
};

function employeeName(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? employeeId;
}

function hasFullEmployeeAccess(email?: string | null) {
  return email?.toLowerCase() === "s.dai@choicell.de";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please%20login%20before%20opening%20the%20dashboard.");
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id, full_name, company_name").eq("id", user.id).single();
  const workspaceId = profile?.workspace_id;

  const [{ data: workspace }, { data: recentTasks }] = await Promise.all([
    workspaceId
      ? supabase.from("workspaces").select("name, plan, monthly_task_limit").eq("id", workspaceId).single<WorkspaceRow>()
      : Promise.resolve({ data: null }),
    workspaceId
      ? supabase
          .from("tasks")
          .select("id,title,status,employee_id,created_at")
          .eq("workspace_id", workspaceId)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<TaskRow[]>()
      : Promise.resolve({ data: [] })
  ]);
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [{ count: monthlyTaskCount }, { count: completedTaskCount }] = await Promise.all([
    workspaceId
      ? supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("created_at", monthStart.toISOString())
      : Promise.resolve({ count: 0 }),
    workspaceId
      ? supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("status", "completed")
      : Promise.resolve({ count: 0 })
  ]);

  const tasks = recentTasks ?? [];
  const fullAccess = hasFullEmployeeAccess(user.email);
  const plan = fullAccess ? "Executive" : workspace?.plan ?? "Starter";
  const displayName = profile?.company_name || workspace?.name || profile?.full_name || "LINKORNA";
  const monthlyLimit = workspace?.monthly_task_limit ?? 80;
  const completedCount = completedTaskCount ?? 0;
  const usedThisMonth = monthlyTaskCount ?? 0;
  const unlockedEmployees = fullAccess ? employees.length : employees.filter((employee) => employee.plan === "Starter").length;

  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-navy">Welcome back, {displayName}</h1>
            <p className="mt-2 text-steel">Manage cross-border business tasks across your AI workforce.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
              <div className="text-xs font-black uppercase text-steel">Current plan</div>
              <div className="mt-2 flex items-center gap-3">
                <PlanBadge plan={plan} />
                <span className="text-sm font-bold text-graphite">
                  {usedThisMonth} / {monthlyLimit} tasks used
                </span>
              </div>
            </div>
            <Link href="/logout" className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-black text-navy shadow-sm">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Active employees</div>
            <div className="mt-2 text-3xl font-black text-navy">{unlockedEmployees}</div>
            <p className="mt-1 text-sm text-steel">{fullAccess ? "Full test access enabled" : "Starter workforce enabled"}</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-accent bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Completed outputs</div>
            <div className="mt-2 text-3xl font-black text-navy">{completedCount}</div>
            <p className="mt-1 text-sm text-steel">Ready to copy or save</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-amber bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Upgrade opportunity</div>
            <div className="mt-2 text-3xl font-black text-navy">3</div>
            <p className="mt-1 text-sm text-steel">Business and executive employees available</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-navy">Monthly usage</h2>
              <span className="text-sm font-bold text-steel">Live tasks</span>
            </div>
            <div className="mt-6 flex h-48 items-end gap-3">
              {[18, 28, 35, 42, 55, 62, 74, 82].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`w-full rounded-t ${index % 3 === 0 ? "bg-accent" : "bg-blue"}`} style={{ height: `${height}%` }} />
                  <span className="text-xs font-bold text-steel">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="tasks" className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="font-black text-navy">Recent tasks</h2>
            <div className="mt-4 grid gap-3">
              {tasks.length ? (
                tasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`} className="rounded-md border border-line p-3 transition hover:border-blue hover:bg-blue-50">
                    <div className="text-sm font-black text-navy">{task.title}</div>
                    <div className="mt-1 text-xs text-steel">
                      {employeeName(task.employee_id)} - {task.status}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-md border border-line bg-mist p-3 text-sm font-bold text-steel">
                  No saved tasks yet. Generate from any AI employee to see history here.
                </div>
              )}
            </div>
          </div>
        </div>

        <section id="employees" className="mt-8">
          <h2 className="text-2xl font-black text-navy">AI employees by plan</h2>
          {(["Starter", "Business", "Executive"] as const).map((employeePlan) => (
            <div key={employeePlan} className="mt-6">
              <div className="mb-3 flex items-center gap-3">
                <PlanBadge plan={employeePlan} />
                <span className="text-sm font-bold text-steel">{employeePlan} workforce</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {employees.filter((employee) => employee.plan === employeePlan).map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} locked={employeePlan !== "Starter" && !fullAccess} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
