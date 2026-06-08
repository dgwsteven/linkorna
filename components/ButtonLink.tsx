import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ButtonLink({ href, children, variant = "dark" }: { href: string; children: React.ReactNode; variant?: "dark" | "light" }) {
  const classes =
    variant === "dark"
      ? "bg-blue text-white hover:bg-navy"
      : "border border-line bg-white text-navy hover:border-navy";

  return (
    <Link href={href} className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-extrabold shadow-sm transition ${classes}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
