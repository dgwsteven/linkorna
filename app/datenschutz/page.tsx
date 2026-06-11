import { Header } from "@/components/Header";
import { LegalFooter } from "@/components/LegalFooter";

const sections = [
  {
    title: "1. Verantwortlicher",
    body:
      "Verantwortlich fuer diese Website ist GL Eudepot GmbH, Basler Str. 3, 61352 Bad Homburg, Deutschland. Kontakt: Hallo@linkorna.com."
  },
  {
    title: "2. Verarbeitung beim Besuch der Website",
    body:
      "Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, etwa IP-Adresse, Zeitpunkt des Zugriffs, Browserinformationen und angeforderte Seiten. Diese Verarbeitung dient der sicheren Bereitstellung, Fehleranalyse und Abwehr von Missbrauch."
  },
  {
    title: "3. Nutzerkonto und AI-Employee-Aufgaben",
    body:
      "Wenn Sie ein Konto erstellen oder AI-Employee-Aufgaben ausfuehren, verarbeiten wir die von Ihnen eingegebenen Daten, hochgeladenen Dateien, Aufgabenparameter und generierten Ergebnisse. Diese Verarbeitung ist erforderlich, um den gewuenschten Dienst bereitzustellen."
  },
  {
    title: "4. Cookies und lokale Speicherung",
    body:
      "Wir verwenden notwendige Cookies und lokale Speichereintraege fuer Login, Sicherheit, Formularfunktionen und Cookie-Einstellungen. Optionale Analyse- oder Marketing-Cookies werden nur gesetzt, wenn Sie zustimmen. Die Ablehnung optionaler Cookies beeintraechtigt die Kernfunktionen der Website nicht."
  },
  {
    title: "5. Externe Dienstleister",
    body:
      "Die Website wird ueber Vercel bereitgestellt. Authentifizierung, Datenbank und gespeicherte Aufgaben koennen ueber Supabase verarbeitet werden. AI-Ausgaben koennen ueber angebundene Modellanbieter erzeugt werden. Dienstleister werden nur im Rahmen der Bereitstellung und Verbesserung des Produkts eingesetzt."
  },
  {
    title: "6. Rechtsgrundlagen",
    body:
      "Die Verarbeitung erfolgt je nach Zweck zur Vertragserfuellung, auf Grundlage berechtigter Interessen an Sicherheit und Betrieb der Website oder auf Grundlage Ihrer Einwilligung, insbesondere bei optionalen Cookies."
  },
  {
    title: "7. Speicherdauer",
    body:
      "Personenbezogene Daten werden nur so lange gespeichert, wie dies fuer den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Aufgaben und Ergebnisse koennen im Nutzerkonto gespeichert werden, damit Sie diese spaeter abrufen koennen."
  },
  {
    title: "8. Ihre Rechte",
    body:
      "Sie haben im Rahmen der gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Loeschung, Einschraenkung, Datenuebertragbarkeit und Widerspruch. Einwilligungen koennen Sie jederzeit fuer die Zukunft widerrufen."
  },
  {
    title: "9. Beschwerderecht",
    body:
      "Sie koennen sich bei einer Datenschutzaufsichtsbehoerde beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung personenbezogener Daten gegen Datenschutzrecht verstoesst."
  }
];

export default function DatenschutzPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-black text-navy">Datenschutzerklärung</h1>
        <p className="mt-4 text-sm leading-7 text-steel">
          Diese Datenschutzerklärung beschreibt, wie LINKORNA personenbezogene Daten verarbeitet. Sie ist als praktische Website-Erklärung formuliert und sollte vor dem produktiven Betrieb rechtlich final geprüft werden.
        </p>
        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-navy">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-graphite">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}
