"use client";

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("linkorna:open-cookie-settings"))}
    >
      Cookie Einstellungen öffnen
    </button>
  );
}
