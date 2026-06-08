import { Sidebar } from "@/components/Sidebar";
import { employees, plans, recentTasks } from "@/lib/data";

const customers = [
  { company: "SolarTrade GmbH", plan: "Starter", tasks: 12, status: "Active" },
  { company: "Hanse Commerce", plan: "Business", tasks: 34, status: "Trial" },
  { company: "CN-EU Procurement", plan: "Starter", tasks: 7, status: "Active" }
];

export default function AdminPage() {
  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <div>
          <p className="text-sm font-black uppercase text-blue">Internal admin</p>
          <h1 className="mt-2 text-3xl font-black text-navy">LINKORNA Operations</h1>
          <p className="mt-2 text-steel">Mock administration view for customers, usage, plans and task activity.</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Customers</div>
            <div className="mt-2 text-3xl font-black text-navy">{customers.length}</div>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-accent bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">AI employees</div>
            <div className="mt-2 text-3xl font-black text-navy">{employees.length}</div>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-amber bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Plans</div>
            <div className="mt-2 text-3xl font-black text-navy">{plans.length}</div>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Recent tasks</div>
            <div className="mt-2 text-3xl font-black text-navy">{recentTasks.length}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <h2 className="font-black text-navy">Customer workspaces</h2>
              <p className="mt-1 text-sm text-steel">This table will connect to Supabase profiles and subscriptions.</p>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-mist text-navy">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Tasks</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.company} className="border-t border-line">
                    <td className="p-4 font-bold text-navy">{customer.company}</td>
                    <td className="p-4 text-steel">{customer.plan}</td>
                    <td className="p-4 text-steel">{customer.tasks}</td>
                    <td className="p-4 text-accent">{customer.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="font-black text-navy">Next backend milestones</h2>
            <div className="mt-4 grid gap-3 text-sm text-graphite">
              <div className="rounded-md bg-mist p-3">Connect Supabase Auth and company workspaces.</div>
              <div className="rounded-md bg-mist p-3">Persist task inputs and generated outputs.</div>
              <div className="rounded-md bg-mist p-3">Add plan limits and locked employee permissions.</div>
              <div className="rounded-md bg-mist p-3">Connect OpenAI employee routes when API key is ready.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
