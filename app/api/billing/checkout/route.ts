import { NextResponse } from "next/server";
import { billingPlans, isCheckoutChannel, isPlanName } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const plan = body.plan;
  const channel = body.channel;

  if (!isPlanName(plan) || !isCheckoutChannel(channel)) {
    return NextResponse.json({ error: "Invalid billing plan or payment channel." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single();
  if (!profile?.workspace_id) {
    return NextResponse.json({ error: "Workspace profile not found." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const selectedPlan = billingPlans[plan];
  const stripe = getStripe();

  const common = {
    customer_email: user.email || undefined,
    success_url: `${origin}/billing?checkout=success`,
    cancel_url: `${origin}/billing?checkout=cancelled`,
    metadata: {
      workspace_id: profile.workspace_id,
      user_id: user.id,
      plan,
      channel
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: {
            name: selectedPlan.name
          },
          unit_amount: selectedPlan.amount,
          ...(channel === "subscription"
            ? {
                recurring: {
                  interval: "month" as const
                }
              }
            : {})
        }
      }
    ]
  };

  const session =
    channel === "subscription"
      ? await stripe.checkout.sessions.create({
          ...common,
          mode: "subscription",
          subscription_data: {
            metadata: common.metadata
          }
        })
      : await stripe.checkout.sessions.create({
          ...common,
          mode: "payment",
          payment_method_types: ["alipay", "wechat_pay", "card"],
          payment_intent_data: {
            metadata: common.metadata
          }
        });

  return NextResponse.json({ url: session.url });
}
