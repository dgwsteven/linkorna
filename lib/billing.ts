import type { PlanName } from "@/lib/data";

export type CheckoutChannel = "subscription" | "china-wallet";

export const billingPlans: Record<PlanName, { amount: number; taskLimit: number; name: string }> = {
  Starter: { amount: 4900, taskLimit: 80, name: "LINKORNA Starter" },
  Business: { amount: 9900, taskLimit: 150, name: "LINKORNA Business" },
  Executive: { amount: 19900, taskLimit: 300, name: "LINKORNA Executive" }
};

export function isPlanName(value: unknown): value is PlanName {
  return value === "Starter" || value === "Business" || value === "Executive";
}

export function isCheckoutChannel(value: unknown): value is CheckoutChannel {
  return value === "subscription" || value === "china-wallet";
}

export function paidUntilFromNow(days = 31) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}
