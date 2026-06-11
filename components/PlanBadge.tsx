import type { PlanName } from "@/lib/data";

export function PlanBadge({ plan }: { plan: PlanName }) {
  const tone =
    plan === "Starter"
      ? "border-blue bg-blue text-white"
      : plan === "Business"
        ? "border-accent bg-accent text-white"
        : "border-amber bg-amber text-white";
  return <span className={`rounded border px-2 py-1 text-xs font-extrabold ${tone}`}>{plan}</span>;
}
