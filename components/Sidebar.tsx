import Link from "next/link";
import { navItems } from "@/lib/data";

export function Sidebar() {
  return (
    <aside className="border-r border-line bg-white p-4 lg:min-h-screen">
      <Link href="/" className="mb-6 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-navy text-sm font-black text-white">L</div>
        <div>
          <div className="text-sm font-black text-navy">LINKORNA</div>
          <div className="text-xs text-steel">Workforce Console</div>
        </div>
      </Link>
      <nav className="grid gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-extrabold text-graphite hover:bg-mist">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
