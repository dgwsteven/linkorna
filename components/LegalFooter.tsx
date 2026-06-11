import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-steel sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-base font-black text-navy">LINKORNA</div>
            <p className="mt-1">A service of GL Eudepot GmbH</p>
          </div>
          <nav className="flex flex-wrap gap-4 font-bold text-graphite">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/cookies">Cookie Einstellungen</Link>
          </nav>
        </div>
        <div className="text-xs leading-5 text-steel">
          © {new Date().getFullYear()} GL Eudepot GmbH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
