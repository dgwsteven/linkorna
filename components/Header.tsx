import Link from "next/link";
import { ArrowRight, LogIn, LogOut } from "lucide-react";
import { getLinkornaAuthContext } from "@/lib/linkorna-session";

export async function Header() {
  const { user } = await getLinkornaAuthContext();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-navy text-sm font-black text-white">L</div>
          <div>
            <div className="text-sm font-black text-navy">LINKORNA</div>
            <div className="text-xs font-medium text-steel">Cross-border AI Employees</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-graphite md:flex">
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/employees/german-email">AI Employees</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <a href="/dashboard" className="flex h-10 items-center rounded-md bg-blue px-4 text-sm font-bold text-white">
                Dashboard
              </a>
              <form action="/logout" method="post" className="hidden sm:block">
                <button type="submit" className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-graphite">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-graphite sm:flex">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/employees/german-email" className="flex h-10 items-center gap-2 rounded-md bg-blue px-4 text-sm font-bold text-white">
                Start
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
