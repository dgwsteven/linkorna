"use client";

import { useEffect, useState } from "react";

type CookieChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "linkorna_cookie_consent";

function defaultChoice(): CookieChoice {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString()
  };
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setOpen(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CookieChoice;
      setAnalytics(Boolean(parsed.analytics));
      setMarketing(Boolean(parsed.marketing));
    } catch {
      setOpen(true);
    }

    const openSettings = () => {
      setOpen(true);
      setSettingsOpen(true);
    };

    window.addEventListener("linkorna:open-cookie-settings", openSettings);
    return () => window.removeEventListener("linkorna:open-cookie-settings", openSettings);
  }, []);

  function saveChoice(choice: Partial<CookieChoice>) {
    const finalChoice = {
      ...defaultChoice(),
      analytics: Boolean(choice.analytics),
      marketing: Boolean(choice.marketing),
      updatedAt: new Date().toISOString()
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalChoice));
    setAnalytics(finalChoice.analytics);
    setMarketing(finalChoice.marketing);
    setOpen(false);
    setSettingsOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/98 shadow-panel backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-base font-black text-navy">Cookie Einstellungen</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-graphite">
              Wir nutzen notwendige Cookies fuer Login, Sicherheit und die Bereitstellung der Website. Optionale Cookies fuer Analyse oder Marketing verwenden wir nur mit Ihrer Zustimmung. Ihre Auswahl hat keinen Einfluss auf die Nutzung der AI Employees.
            </p>

            {settingsOpen ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="rounded-md border border-line bg-mist p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-navy">Notwendig</span>
                    <input type="checkbox" checked disabled className="h-4 w-4 accent-blue" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-steel">Erforderlich fuer Login, Formularschutz, Aufgaben und technische Bereitstellung.</p>
                </label>
                <label className="rounded-md border border-line bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-navy">Analyse</span>
                    <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.currentTarget.checked)} className="h-4 w-4 accent-blue" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-steel">Hilft uns, Nutzung und Performance der Website zu verstehen.</p>
                </label>
                <label className="rounded-md border border-line bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-navy">Marketing</span>
                    <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.currentTarget.checked)} className="h-4 w-4 accent-blue" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-steel">Erlaubt spaetere Kampagnenmessung und relevantere Inhalte.</p>
                </label>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {settingsOpen ? (
              <button type="button" onClick={() => saveChoice({ analytics, marketing })} className="h-10 rounded-md bg-blue px-4 text-sm font-black text-white">
                Auswahl speichern
              </button>
            ) : (
              <button type="button" onClick={() => setSettingsOpen(true)} className="h-10 rounded-md border border-line bg-white px-4 text-sm font-black text-navy">
                Teilweise zustimmen
              </button>
            )}
            <button type="button" onClick={() => saveChoice({ analytics: false, marketing: false })} className="h-10 rounded-md border border-line bg-white px-4 text-sm font-black text-navy">
              Nur notwendige
            </button>
            <button type="button" onClick={() => saveChoice({ analytics: true, marketing: true })} className="h-10 rounded-md bg-navy px-4 text-sm font-black text-white">
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
