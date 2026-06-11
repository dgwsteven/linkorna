import { Header } from "@/components/Header";
import { LegalFooter } from "@/components/LegalFooter";

export default function ImpressumPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-black text-navy">Impressum</h1>

        <div className="mt-8 space-y-8 rounded-lg border border-line bg-white p-6 text-sm leading-7 text-graphite shadow-sm">
          <section>
            <h2 className="text-lg font-black text-navy">Angaben gemaess § 5 DDG</h2>
            <p className="mt-3">
              GL Eudepot GmbH<br />
              Basler Str. 3<br />
              61352 Bad Homburg<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-navy">Registereintrag</h2>
            <p className="mt-3">
              HRB 13987<br />
              Registergericht: Bad Homburg v. d. Höhe
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-navy">Vertreten durch</h2>
            <p className="mt-3">Dai, Guowei, Oberursel / Deutschland</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-navy">Kontakt</h2>
            <p className="mt-3">
              E-Mail: <a className="font-bold text-blue" href="mailto:Hallo@linkorna.com">Hallo@linkorna.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-navy">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p className="mt-3">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}
