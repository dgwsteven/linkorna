import type { PlanName } from "@/lib/data";

export function PlanBadge({ plan }: { plan: PlanName }) {
  const tone = plan === "Starter" ? "bg-mist text-blue" : plan === "Business" ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800";
  return <span className={`rounded px-2 py-1 text-xs font-extrabold ${tone}`}>{plan}</span>;
}
