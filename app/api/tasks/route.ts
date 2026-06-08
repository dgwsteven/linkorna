import { NextResponse } from "next/server";
import { employeeForms, employees } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const employeeId = typeof body.employeeId === "string" ? body.employeeId : "german-email";
  const employee = employees.find((item) => item.id === employeeId) ?? employees[0];
  const output = employeeForms[employee.id]?.mock ?? employeeForms["german-email"].mock;

  return NextResponse.json({
    id: `mock-${Date.now()}`,
    status: "completed",
    employee: {
      id: employee.id,
      name: employee.name,
      plan: employee.plan
    },
    inputSummary: body.inputSummary ?? "Mock task generated from submitted business context.",
    output
  });
}
