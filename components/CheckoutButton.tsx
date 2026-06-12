"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

  async function syncBrowserSession() {
    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    let currentSession = session;

    if (!currentSession?.access_token || !currentSession?.refresh_token) {
      const {
        data: { session: refreshedSession }
      } = await supabase.auth.refreshSession();
      currentSession = refreshedSession;
    }

    if (!currentSession?.access_token || !currentSession?.refresh_token) {
      return false;
    }

    const response = await fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: currentSession.access_token,
        refreshToken: currentSession.refresh_token
      }),
      credentials: "same-origin"
    });

    return response.ok;
  }

  async function createCheckoutSession() {
    const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, channel }),
        credentials: "same-origin"
      });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  }

  async function startCheckout() {
    setError("");
    setLoading(true);

    try {
      let { response, payload } = await createCheckoutSession();

      if (response.status === 401) {
        const synced = await syncBrowserSession();
        if (synced) {
          ({ response, payload } = await createCheckoutSession());
        }
      }

      if (!response.ok || !payload?.url) {
        if (response.status === 401) {
          throw new Error("Please login once, then return to checkout.");
        }
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
