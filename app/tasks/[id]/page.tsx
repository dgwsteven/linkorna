import Link from "next/link";
import { Download, Save, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { OutputPanel } from "@/components/OutputPanel";
import { employeeForms, employees } from "@/lib/data";

export default async function TaskResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = employees[0];
  const result = employeeForms["german-email"].mock;

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase text-accent">Task Result</p>
              <h1 className="mt-2 text-3xl font-black text-navy">Generated output #{id}</h1>
              <p className="mt-2 text-steel">AI employee used: {employee.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Copy, label: "Copy" },
                { Icon: Download, label: "Download PDF" },
                { Icon: Save, label: "Save to history" }
              ].map(({ Icon, label }) => {
                return (
                  <button key={label} className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-black text-navy">
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 rounded-md bg-mist p-4">
            <div className="text-sm font-black text-navy">Input Summary</div>
            <p className="mt-1 text-sm leading-6 text-graphite">
              German client requested delivery timeline confirmation, updated commercial terms and a concise reply before proceeding.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <OutputPanel items={result} />
        </div>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-md bg-navy px-5 py-3 text-sm font-black text-white">Return to Dashboard</Link>
      </section>
    </main>
  );
}
