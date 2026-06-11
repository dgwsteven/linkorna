"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import type { CheckoutChannel } from "@/lib/billing";
import type { PlanName } from "@/lib/data";

export function CheckoutButton({
  plan,
  channel,
  children
}: {
  plan: PlanName;
  channel: CheckoutChannel;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, channel }),
        credentials: "same-origin"
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Checkout could not be started.");
      }

      window.location.href = payload.url;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue px-4 text-sm font-black text-white disabled:cursor-wait disabled:opacity-75"
      >
        <CreditCard className="h-4 w-4" />
        {loading ? "Opening checkout..." : children}
      </button>
      {error ? <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs font-bold text-amber-800">{error}</div> : null}
    </div>
  );
}
