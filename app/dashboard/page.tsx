import { EmployeeCard } from "@/components/EmployeeCard";
import { PlanBadge } from "@/components/PlanBadge";
import { Sidebar } from "@/components/Sidebar";
import { employees, recentTasks } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-navy">Welcome back, LINKORNA team</h1>
            <p className="mt-2 text-steel">Manage cross-border business tasks across your AI workforce.</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Current plan</div>
            <div className="mt-2 flex items-center gap-3">
              <PlanBadge plan="Starter" />
              <span className="text-sm font-bold text-graphite">12 / 80 tasks used</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Active employees</div>
            <div className="mt-2 text-3xl font-black text-navy">3</div>
            <p className="mt-1 text-sm text-steel">Starter workforce enabled</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-accent bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Completed outputs</div>
            <div className="mt-2 text-3xl font-black text-navy">8</div>
            <p className="mt-1 text-sm text-steel">Ready to copy or save</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-amber bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Upgrade opportunity</div>
            <div className="mt-2 text-3xl font-black text-navy">2</div>
            <p className="mt-1 text-sm text-steel">Business employees locked</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-navy">Monthly usage</h2>
              <span className="text-sm font-bold text-steel">Mock chart</span>
            </div>
            <div className="mt-6 flex h-48 items-end gap-3">
              {[38, 54, 46, 72, 58, 82, 64, 92].map((height, index) => (
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
              {recentTasks.map((task) => (
                <div key={task.id} className="rounded-md border border-line p-3">
                  <div className="text-sm font-black text-navy">{task.title}</div>
                  <div className="mt-1 text-xs text-steel">{task.employee} - {task.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="employees" className="mt-8">
          <h2 className="text-2xl font-black text-navy">AI employees by plan</h2>
          {(["Starter", "Business", "Executive"] as const).map((plan) => (
            <div key={plan} className="mt-6">
              <div className="mb-3 flex items-center gap-3">
                <PlanBadge plan={plan} />
                <span className="text-sm font-bold text-steel">{plan} workforce</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {employees.filter((employee) => employee.plan === plan).map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} locked={plan !== "Starter"} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
