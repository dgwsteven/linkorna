import { NextResponse } from "next/server";
import Stripe from "stripe";
import { billingPlans, isPlanName, paidUntilFromNow } from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

async function activateWorkspace(workspaceId: string, plan: string, source: string, stripeCustomerId?: string | null, stripeSubscriptionId?: string | null) {
  if (!isPlanName(plan)) return;

  const supabase = createAdminClient();
  const selectedPlan = billingPlans[plan];

  await supabase
    .from("workspaces")
    .update({
      plan,
      monthly_task_limit: selectedPlan.taskLimit
    })
    .eq("id", workspaceId);

  await supabase
    .from("workspaces")
    .update({
      subscription_status: "active",
      billing_provider: "stripe",
      billing_channel: source,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      paid_until: source === "china-wallet" ? paidUntilFromNow(31) : null
    })
    .eq("id", workspaceId);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspace_id;
    const plan = session.metadata?.plan;
    const channel = session.metadata?.channel || "subscription";

    if (workspaceId && plan) {
      await activateWorkspace(
        workspaceId,
        plan,
        channel,
        typeof session.customer === "string" ? session.customer : session.customer?.id,
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id
      );
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const workspaceId = subscription.metadata?.workspace_id;
    const plan = subscription.metadata?.plan;

    if (workspaceId && plan && isPlanName(plan)) {
      const supabase = createAdminClient();
      const active = subscription.status === "active" || subscription.status === "trialing";

      await supabase
        .from("workspaces")
        .update({
          plan: active ? plan : "Starter",
          monthly_task_limit: active ? billingPlans[plan].taskLimit : billingPlans.Starter.taskLimit
        })
        .eq("id", workspaceId);

      await supabase
        .from("workspaces")
        .update({
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
          paid_until: null
        })
        .eq("id", workspaceId);
    }
  }

  return NextResponse.json({ received: true });
}
