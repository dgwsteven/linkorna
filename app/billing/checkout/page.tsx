import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CreditCard, WalletCards } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { PlanBadge } from "@/components/PlanBadge";
import { Sidebar } from "@/components/Sidebar";
import { billingPlans, isPlanName } from "@/lib/billing";
import { type PlanName } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BillingCheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: rawPlan } = await searchParams;
  const plan = isPlanName(rawPlan) ? rawPlan : null;

  if (!plan) {
    redirect("/billing");
  }

  const selectedPlan = billingPlans[plan];

  return (
    <main className="grid bg-mist lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="p-4 sm:p-6 lg:p-8">
        <Link href="/billing" className="inline-flex items-center gap-2 text-sm font-bold text-steel">
          <ArrowLeft className="h-4 w-4" />
          Back to billing
        </Link>

        <div className="mt-6 rounded-lg border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-blue">Checkout</p>
              <h1 className="mt-2 text-3xl font-black text-navy">Choose payment method</h1>
              <p className="mt-2 text-steel">Select the payment flow that best matches your region and payment preference.</p>
            </div>
            <div className="rounded-lg border border-line bg-mist p-4">
              <div className="flex items-center gap-3">
                <PlanBadge plan={plan as PlanName} />
                <span className="text-sm font-black text-navy">{selectedPlan.name}</span>
              </div>
              <div className="mt-3 text-3xl font-black text-navy">EUR {selectedPlan.amount / 100}</div>
              <div className="text-sm font-bold text-steel">per month</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-blue text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-navy">Card / PayPal subscription</h2>
                <p className="mt-2 text-sm leading-6 text-steel">
                  Best for German and international customers. This creates a monthly subscription and can support cards and PayPal when enabled in Stripe.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <CheckoutButton plan={plan as PlanName} channel="subscription">
                Continue with Card / PayPal
              </CheckoutButton>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-accent text-white">
                <WalletCards className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-navy">Alipay / WeChat monthly pass</h2>
                <p className="mt-2 text-sm leading-6 text-steel">
                  Best for Chinese customers. This creates a one-month access pass because Alipay and WeChat Pay are not reliable for recurring SaaS subscriptions.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <CheckoutButton plan={plan as PlanName} channel="china-wallet">
                Continue with Alipay / WeChat Pay
              </CheckoutButton>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
