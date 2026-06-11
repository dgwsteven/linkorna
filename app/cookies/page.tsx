import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { Header } from "@/components/Header";
import { LegalFooter } from "@/components/LegalFooter";

const cookieGroups = [
  {
    title: "Notwendige Cookies",
    status: "Immer aktiv",
    body:
      "Diese Cookies und lokalen Speichereintraege sind fuer Login, Sicherheit, Formularfunktionen, Aufgabenverarbeitung und Speicherung Ihrer Cookie-Auswahl erforderlich. Ohne sie kann LINKORNA nicht zuverlaessig funktionieren."
  },
  {
    title: "Analyse Cookies",
    status: "Optional",
    body:
      "Analyse Cookies helfen zu verstehen, welche Seiten und Funktionen genutzt werden. Sie werden nur aktiviert, wenn Sie zustimmen."
  },
  {
    title: "Marketing Cookies",
    status: "Optional",
    body:
      "Marketing Cookies koennen spaeter zur Kampagnenmessung und fuer relevantere Inhalte genutzt werden. Sie werden nur aktiviert, wenn Sie zustimmen."
  }
];

export default function CookiesPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase text-accent">Privacy</p>
        <h1 className="mt-3 text-3xl font-black text-navy">Cookie Einstellungen</h1>
        <p className="mt-4 text-sm leading-7 text-steel">
          Sie koennen optionale Cookies jederzeit akzeptieren, ablehnen oder Ihre Auswahl aendern. Notwendige Cookies bleiben aktiv, damit Login, AI Employees und Ergebnisanzeige funktionieren.
        </p>
        <div className="mt-6">
          <CookieSettingsButton className="h-11 rounded-md bg-blue px-5 text-sm font-black text-white" />
        </div>
        <div className="mt-8 grid gap-4">
          {cookieGroups.map((group) => (
            <section key={group.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-black text-navy">{group.title}</h2>
                <span className="rounded border border-line bg-mist px-2 py-1 text-xs font-black text-blue">{group.status}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-graphite">{group.body}</p>
            </section>
          ))}
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}
