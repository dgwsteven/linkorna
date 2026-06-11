import Link from "next/link";
import { LockKeyhole, Play } from "lucide-react";
import { PlanBadge } from "./PlanBadge";
import type { employees } from "@/lib/data";

type Employee = (typeof employees)[number];

export function EmployeeCard({ employee, locked }: { employee: Employee; locked?: boolean }) {
  const Icon = employee.icon;
  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-mist text-blue">
          <Icon className="h-5 w-5" />
        </div>
        <PlanBadge plan={employee.plan} />
      </div>
      <h3 className="text-lg font-black text-navy">{employee.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-steel">{employee.description}</p>
      <div className="mt-4 border-l-4 border-blue bg-slate-50 p-3 text-sm leading-6 text-graphite">
        <strong>Example task:</strong> {employee.example}
      </div>
      {locked ? (
        <Link href="/billing" className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-extrabold text-navy">
          <LockKeyhole className="h-4 w-4" />
          Upgrade to {employee.plan}
        </Link>
      ) : (
        <Link href={employee.route} className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue px-4 text-sm font-extrabold text-white">
          <Play className="h-4 w-4" />
          Start Task
        </Link>
      )}
    </div>
  );
}
