import { AlertTriangle, FileText, Globe2, ShoppingCart } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { WorkflowSteps } from "@/components/WorkflowSteps";
import { employees, plans } from "@/lib/data";

const pains = [
  { title: "German client emails take too much time", icon: Globe2 },
  { title: "Contracts and documents are hard to understand", icon: FileText },
  { title: "E-commerce sellers need better listings and competitor analysis", icon: ShoppingCart },
  { title: "Meetings require translation, summaries and follow-ups", icon: AlertTriangle }
];

export default function Home() {
  return (
    <main>
      <Header />
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase text-sky-200">Cross-border AI Workforce Platform</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Your AI Workforce for Cross-border Business
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              LINKORNA helps exporters, e-commerce sellers and procurement teams handle emails, contracts, listings, competitor research and meeting records with AI employees.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard">Start with AI Employees</ButtonLink>
              <ButtonLink href="/pricing" variant="light">View Pricing</ButtonLink>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white p-5 shadow-panel">
            <div className="rounded-lg bg-navy p-5 text-white">
              <div className="text-sm font-bold text-slate-300">Workforce workflow</div>
              <div className="mt-4 grid gap-3">
                {["Choose an AI Employee", "Submit Task", "Receive Business Output"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-4">
                    <span className="grid h-8 w-8 place-items-center rounded bg-blue text-sm font-black text-white">{index + 1}</span>
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Contracts", "Listings", "Meetings"].map((item) => (
                <div key={item} className="rounded-md border border-line bg-white p-4">
                  <div className="text-xs font-black uppercase text-steel">{item}</div>
                  <div className="mt-3 h-2 rounded bg-line" />
                  <div className="mt-2 h-2 w-2/3 rounded bg-blue" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-navy">Cross-border work is operationally expensive</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {pains.map((pain) => {
            const Icon = pain.icon;
            return (
              <div key={pain.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <Icon className="h-6 w-6 text-accent" />
                <p className="mt-4 text-sm font-bold leading-6 text-graphite">{pain.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-navy">Hire task-specific AI employees</h2>
              <p className="mt-2 text-steel">Each employee has a dedicated business form and structured professional output.</p>
            </div>
            <ButtonLink href="/dashboard" variant="light">Open Dashboard</ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-navy">From task request to business deliverable</h2>
        <div className="mt-6">
          <WorkflowSteps />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy">Pricing built around employee capability</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => <PricingCard key={plan.name} plan={plan} featured={index === 1} />)}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black">Start your first AI employee task</h2>
            <p className="mt-2 text-slate-300">Launch a business task with a dedicated AI employee in minutes.</p>
          </div>
          <ButtonLink href="/register" variant="light">Start Task</ButtonLink>
        </div>
      </section>
    </main>
  );
}
