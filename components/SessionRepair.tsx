"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SessionRepair({ label = "Restoring your login session..." }: { label?: string }) {
  const [message, setMessage] = useState(label);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function repairSession() {
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
        if (!active) return;
        setMessage("Your browser login session is missing. Please login again.");
        setFailed(true);
        return;
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

      if (!response.ok) {
        if (!active) return;
        setMessage("Your login session could not be restored. Please login again.");
        setFailed(true);
        return;
      }

      window.location.reload();
    }

    repairSession().catch(() => {
      if (!active) return;
      setMessage("Your login session could not be restored. Please login again.");
      setFailed(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
      <div className="text-lg font-black text-navy">{message}</div>
      <p className="mt-2 text-sm leading-6 text-steel">
        If you were already logged in, LINKORNA is syncing the browser session with the server session so this page can open without sending you back to login.
      </p>
      {failed ? (
        <Link href="/login" className="mt-5 inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
          Login
        </Link>
      ) : null}
    </div>
  );
}
