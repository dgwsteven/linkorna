import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { PlanBadge } from "@/components/PlanBadge";
import { Sidebar } from "@/components/Sidebar";
import { buildAccessState, canRunEmployee } from "@/lib/access-control";
import { employees, type PlanName } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type TaskRow = {
  id: string;
  title: string;
  status: string;
  employee_id: string;
  created_at: string;
};

type UsageTaskRow = {
  employee_id: string;
  created_at: string;
};

type WorkspaceRow = {
  name: string | null;
  plan: PlanName | null;
  monthly_task_limit: number | null;
  created_at: string | null;
};

function employeeName(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? employeeId;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shortDayLabel(key: string) {
  const date = new Date(`${key}T00:00:00.000Z`);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
}

const usageColors: Record<string, string> = {
  "german-email": "bg-blue",
  contract: "bg-navy",
  supplier: "bg-accent",
  listing: "bg-emerald-500",
  competitor: "bg-amber",
  meeting: "bg-slate-500"
};

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
      ? supabase.from("workspaces").select("name, plan, monthly_task_limit, created_at").eq("id", workspaceId).single<WorkspaceRow>()
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
  const usageStart = new Date();
  usageStart.setUTCDate(usageStart.getUTCDate() - 29);
  usageStart.setUTCHours(0, 0, 0, 0);

  const [{ count: monthlyTaskCount }, { count: completedTaskCount }, { data: usageTasks }] = await Promise.all([
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
      : Promise.resolve({ count: 0 }),
    workspaceId
      ? supabase
          .from("tasks")
          .select("employee_id,created_at")
          .eq("workspace_id", workspaceId)
          .gte("created_at", usageStart.toISOString())
          .order("created_at", { ascending: true })
          .returns<UsageTaskRow[]>()
      : Promise.resolve({ data: [] })
  ]);

  const tasks = recentTasks ?? [];
  const access = buildAccessState({ email: user.email, workspace, monthlyUsed: monthlyTaskCount ?? 0 });
  const fullAccess = access.fullAccess;
  const plan = access.plan;
  const displayName = profile?.company_name || workspace?.name || profile?.full_name || "LINKORNA";
  const monthlyLimit = access.monthlyLimit;
  const completedCount = completedTaskCount ?? 0;
  const usedThisMonth = access.monthlyUsed;
  const unlockedEmployees = employees.filter((employee) => canRunEmployee(access, employee.plan).allowed).length;
  const usageDays = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(usageStart);
    date.setUTCDate(usageStart.getUTCDate() + index);
    const key = dayKey(date);
    return { key, label: shortDayLabel(key), counts: {} as Record<string, number>, total: 0 };
  });
  const usageByDay = new Map(usageDays.map((day) => [day.key, day]));

  for (const task of usageTasks ?? []) {
    const key = dayKey(new Date(task.created_at));
    const day = usageByDay.get(key);
    if (!day) continue;
    day.counts[task.employee_id] = (day.counts[task.employee_id] ?? 0) + 1;
    day.total += 1;
  }

  const maxDailyUsage = Math.max(1, ...usageDays.map((day) => day.total));
  const employeeUsageTotals = employees
    .map((employee) => ({
      ...employee,
      total: usageDays.reduce((sum, day) => sum + (day.counts[employee.id] ?? 0), 0)
    }))
    .filter((employee) => employee.total > 0)
    .sort((a, b) => b.total - a.total);

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
              {!fullAccess ? (
                <div className="mt-2 text-xs font-bold text-steel">
                  {access.trialActive ? `${access.trialDaysRemaining} trial days remaining` : "Trial ended - choose a plan to continue"}
                </div>
              ) : null}
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
            <p className="mt-1 text-sm text-steel">{fullAccess ? "Full test access enabled" : access.trialActive ? "Free trial workforce enabled" : "Paid plan access"}</p>
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
              <div>
                <h2 className="font-black text-navy">AI employee usage</h2>
                <p className="mt-1 text-sm text-steel">Daily task volume over the last 30 days</p>
              </div>
              <span className="text-sm font-bold text-steel">{usageDays.reduce((sum, day) => sum + day.total, 0)} tasks</span>
            </div>
            <div className="mt-6 flex h-52 items-end gap-1.5 sm:gap-2">
              {usageDays.map((day, index) => {
                const height = Math.max(day.total ? 14 : 2, (day.total / maxDailyUsage) * 100);
                return (
                  <div key={day.key} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="relative flex h-44 w-full items-end rounded-t bg-slate-100">
                      <div className="flex w-full flex-col justify-end overflow-hidden rounded-t" style={{ height: `${height}%` }}>
                        {day.total ? (
                          employees.map((employee) => {
                            const count = day.counts[employee.id] ?? 0;
                            if (!count) return null;
                            return (
                              <div
                                key={employee.id}
                                className={usageColors[employee.id] || "bg-steel"}
                                style={{ height: `${Math.max(12, (count / day.total) * 100)}%` }}
                                title={`${employee.name}: ${count}`}
                              />
                            );
                          })
                        ) : (
                          <div className="h-full bg-line" />
                        )}
                      </div>
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-navy px-2 py-1 text-xs font-bold text-white group-hover:block">
                        {day.label}: {day.total}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-steel">{index % 5 === 0 || index === 29 ? day.label : ""}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {employeeUsageTotals.length ? (
                employeeUsageTotals.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-2 rounded-md border border-line bg-mist px-2.5 py-1.5 text-xs font-bold text-graphite">
                    <span className={`h-2.5 w-2.5 rounded-sm ${usageColors[employee.id] || "bg-steel"}`} />
                    {employee.name}: {employee.total}
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-line bg-mist px-3 py-2 text-sm font-bold text-steel">
                  No tasks in the last 30 days yet.
                </div>
              )}
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
                  <EmployeeCard key={employee.id} employee={employee} locked={!canRunEmployee(access, employee.plan).allowed} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
