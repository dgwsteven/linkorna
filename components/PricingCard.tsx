import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/lib/data";

type Plan = (typeof plans)[number];

export function PricingCard({ plan, featured }: { plan: Plan; featured?: boolean }) {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${featured ? "border-blue ring-2 ring-blue/10" : "border-line"}`}>
      <div className="flex min-h-20 items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-navy">{plan.name}</h3>
          <p className="mt-1 text-sm font-bold text-steel">{plan.subtitle}</p>
        </div>
        {featured ? <span className="rounded bg-blue/10 px-2 py-1 text-xs font-black text-blue">Popular</span> : null}
      </div>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-black text-navy">{plan.price}</span>
        <span className="pb-1 text-sm font-bold text-steel">/month</span>
      </div>
      <Link href="/register" className={`mt-6 flex h-11 items-center justify-center rounded-md text-sm font-black ${featured ? "bg-blue text-white" : "border border-line bg-white text-navy"}`}>
        {plan.button}
      </Link>
      <div className="mt-6">
        <div className="text-xs font-black uppercase text-steel">Employee capability</div>
        <ul className="mt-3 space-y-3">
          {plan.includes.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-5 text-graphite">
              <Check className="mt-0.5 h-4 w-4 flex-none text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-line pt-5">
        <div className="text-xs font-black uppercase text-steel">Best for</div>
        <p className="mt-2 text-sm leading-6 text-steel">{plan.targets.join(", ")}</p>
      </div>
    </div>
  );
}
