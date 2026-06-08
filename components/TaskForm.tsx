import { UploadCloud, Wand2 } from "lucide-react";

export function TaskForm({ fields }: { fields: string[] }) {
  return (
    <form className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="mb-5">
        <h2 className="font-black text-navy">Task Input</h2>
        <p className="text-sm text-steel">Complete the business form and generate a structured deliverable.</p>
      </div>
      <div className="grid gap-4">
        {fields.map((field) => {
          const lower = field.toLowerCase();
          if (lower.includes("upload")) {
            return (
              <label key={field} className="grid gap-2">
                <span className="label">{field}</span>
                <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-line bg-mist p-4 text-center text-sm font-bold text-steel">
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Select file
                </div>
              </label>
            );
          }
          if (lower.includes("tone") || lower.includes("language") || lower.includes("marketplace") || lower.includes("goal") || lower.includes("type")) {
            return (
              <label key={field} className="grid gap-2">
                <span className="label">{field}</span>
                <select className="field">
                  <option>Select option</option>
                  <option>Formal</option>
                  <option>German + Chinese explanation</option>
                  <option>Amazon</option>
                  <option>Pricing</option>
                </select>
              </label>
            );
          }
          return (
            <label key={field} className="grid gap-2">
              <span className="label">{field}</span>
              {lower.includes("paste") || lower.includes("describe") || lower.includes("features") ? (
                <textarea className="field min-h-28 resize-y" placeholder={`Enter ${field.toLowerCase()}`} />
              ) : (
                <input className="field" placeholder={`Enter ${field.toLowerCase()}`} />
              )}
            </label>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="inline-flex h-11 items-center gap-2 rounded-md bg-blue px-5 text-sm font-black text-white">
          <Wand2 className="h-4 w-4" />
          Generate
        </button>
        <button type="button" className="h-11 rounded-md border border-line bg-white px-5 text-sm font-black text-navy">Save Draft</button>
      </div>
    </form>
  );
}
