import { ClipboardList, CopyCheck, FileInput, Users } from "lucide-react";

const steps = [
  { title: "Choose AI employee", icon: Users },
  { title: "Upload file or paste text", icon: FileInput },
  { title: "Get structured business output", icon: ClipboardList },
  { title: "Copy, download or save result", icon: CopyCheck }
];

export function WorkflowSteps() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-blue text-white">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-black text-steel">STEP {index + 1}</span>
            </div>
            <h3 className="mt-5 text-base font-black text-navy">{step.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
