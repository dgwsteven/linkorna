import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { plans } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PricingPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-steel hover:text-navy">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <p className="text-sm font-black uppercase text-accent">Pricing</p>
        <h1 className="mt-3 text-4xl font-black text-navy">Choose your AI workforce</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-steel">
          Plans are organized by employee capability, from cross-border communication to commerce intelligence and executive meeting documentation.
        </p>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => <PricingCard key={plan.name} plan={plan} featured={index === 1} />)}
        </div>
      </section>
    </main>
  );
}
