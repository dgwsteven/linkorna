import type { PlanName } from "@/lib/data";

export function PlanBadge({ plan }: { plan: PlanName }) {
  const tone =
    plan === "Starter"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : plan === "Business"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";
  return <span className={`rounded border px-2 py-1 text-xs font-extrabold ${tone}`}>{plan}</span>;
}
