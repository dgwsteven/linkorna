"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ message, next = "/dashboard" }: { message?: string; next?: string }) {
  const router = useRouter();
  const [error, setError] = useState(message || "");
  const [loading, setLoading] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    await fetch("/api/auth/status", { cache: "no-store", credentials: "same-origin" }).catch(() => null);
    router.refresh();
    router.push(next.startsWith("/") ? next : "/dashboard");
  }

  return (
    <form onSubmit={submitLogin} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
      <h1 className="text-2xl font-black text-navy">Login to LINKORNA</h1>
      <p className="mt-2 text-sm text-steel">Access your AI workforce console.</p>
      {error ? <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800">{error}</div> : null}
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="label">Work email</span>
          <input name="email" className="field" placeholder="team@company.com" type="email" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input name="password" className="field" placeholder="Password" type="password" required />
        </label>
        <button disabled={loading} className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white disabled:cursor-wait disabled:opacity-75">
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
      <p className="mt-5 text-sm text-steel">
        New to LINKORNA? <Link className="font-black text-navy" href="/register">Create account</Link>
      </p>
    </form>
  );
}
