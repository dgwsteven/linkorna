import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { CompetitorWorkspace } from "@/components/CompetitorWorkspace";
import { ContractWorkspace } from "@/components/ContractWorkspace";
import { GermanEmailWorkspace } from "@/components/GermanEmailWorkspace";
import { ListingWorkspace } from "@/components/ListingWorkspace";
import { MeetingWorkspace } from "@/components/MeetingWorkspace";
import { PlanBadge } from "@/components/PlanBadge";
import { SupplierWorkspace } from "@/components/SupplierWorkspace";
import { employees } from "@/lib/data";

export function generateStaticParams() {
  return employees.map((employee) => ({ id: employee.id }));
}

export default async function EmployeePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ audience?: string; language?: string; marketplace?: string; positioning?: string; goal?: string; detailLevel?: string }>;
}) {
  const { id } = await params;
  const { audience, language, marketplace, positioning, goal, detailLevel } = await searchParams;
  const employee = employees.find((item) => item.id === id);

  if (!employee) notFound();

  const Icon = employee.icon;

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-steel">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="mt-6 rounded-lg border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-md bg-navy text-white">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-navy">{employee.name}</h1>
                  <PlanBadge plan={employee.plan} />
                </div>
                <p className="mt-2 max-w-3xl text-steel">{employee.example}</p>
              </div>
            </div>
          </div>
        </div>

        {id === "german-email" ? (
          <GermanEmailWorkspace />
        ) : id === "contract" ? (
          <ContractWorkspace selectedAudience={audience} />
        ) : id === "supplier" ? (
          <SupplierWorkspace selectedLanguage={language} />
        ) : id === "listing" ? (
          <ListingWorkspace selectedMarketplace={marketplace} selectedLanguage={language} selectedPositioning={positioning} />
        ) : id === "competitor" ? (
          <CompetitorWorkspace selectedGoal={goal} />
        ) : id === "meeting" ? (
          <MeetingWorkspace selectedAudience={audience} selectedDetailLevel={detailLevel} />
        ) : (
          notFound()
        )}
      </section>
    </main>
  );
}
