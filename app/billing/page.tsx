import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PlanBadge } from "@/components/PlanBadge";
import { SessionRepair } from "@/components/SessionRepair";
import { Sidebar } from "@/components/Sidebar";
import { buildAccessState } from "@/lib/access-control";
import { plans, type PlanName } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type WorkspaceRow = {
  name: string | null;
  plan: PlanName | null;
  monthly_task_limit: number | null;
  created_at: string | null;
  subscription_status?: string | null;
  paid_until?: string | null;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <section className="p-4 sm:p-6 lg:p-8">
          <SessionRepair label="Opening your billing page..." />
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();
  const workspaceId = profile?.workspace_id;
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [{ data: workspace }, { count: monthlyUsed }] = await Promise.all([
    workspaceId
      ? supabase.from("workspaces").select("*").eq("id", workspaceId).single<WorkspaceRow>()
      : Promise.resolve({ data: null }),
    workspaceId
      ? supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("created_at", monthStart.toISOString())
      : Promise.resolve({ count: 0 })
  ]);

  const access = buildAccessState({ email: user.email, workspace, monthlyUsed: monthlyUsed ?? 0 });

  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-blue">Billing</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Plan and usage</h1>
            <p className="mt-2 text-steel">Manage trial status, task quota and plan upgrades.</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Current access</div>
            <div className="mt-2 flex items-center gap-3">
              <PlanBadge plan={access.plan} />
              <span className="text-sm font-bold text-graphite">
                {access.monthlyUsed} / {access.monthlyLimit} tasks used
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-line border-t-4 border-t-blue bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Trial status</div>
            <div className="mt-2 text-3xl font-black text-navy">{access.fullAccess ? "Test" : access.paidActive ? "Paid" : access.trialActive ? `${access.trialDaysRemaining}d` : "Ended"}</div>
            <p className="mt-1 text-sm text-steel">{access.fullAccess ? "Full test access enabled" : access.paidActive ? "Paid access active" : access.trialActive ? "Free trial remaining" : "Choose a paid plan to continue"}</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-accent bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Usage remaining</div>
            <div className="mt-2 text-3xl font-black text-navy">{access.usageRemaining}</div>
            <p className="mt-1 text-sm text-steel">Tasks available this month</p>
          </div>
          <div className="rounded-lg border border-line border-t-4 border-t-amber bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase text-steel">Payment provider</div>
            <div className="mt-2 text-3xl font-black text-navy">Stripe</div>
            <p className="mt-1 text-sm text-steel">Cards, PayPal, Alipay, WeChat Pay</p>
          </div>
        </div>

        <section className="mt-6 rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-accent" />
            <div>
              <h2 className="font-black text-navy">Access rules now active</h2>
              <p className="mt-2 text-sm leading-6 text-steel">
                New users get 30 days of free trial access to Starter employees with 80 tasks. Business and Executive employees require the matching paid plan. The test account keeps full access for product validation.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-navy">{plan.name}</h2>
                  <p className="mt-1 text-sm font-bold text-steel">{plan.subtitle}</p>
                </div>
                <PlanBadge plan={plan.name as PlanName} />
              </div>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-black text-navy">{plan.price}</span>
                <span className="pb-1 text-sm font-bold text-steel">/month</span>
              </div>
              <Link
                href={`/billing/checkout?plan=${encodeURIComponent(plan.name)}`}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-blue px-4 text-sm font-black text-white"
              >
                Choose plan
              </Link>
              <p className="mt-3 text-xs leading-5 text-steel">
                Payment method selection happens on the next step.
              </p>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-graphite">
                {plan.includes.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
