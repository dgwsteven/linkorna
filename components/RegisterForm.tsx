"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function RegisterForm({ message }: { message?: string }) {
  const router = useRouter();
  const [error, setError] = useState(message || "");
  const [loading, setLoading] = useState(false);

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const companyName = String(formData.get("companyName") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const useCase = String(formData.get("useCase") || "China-Europe trade");

    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, email, password, useCase }),
      credentials: "same-origin"
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.error || "Registration failed.");
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submitRegister} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
      <h1 className="text-2xl font-black text-navy">Create your workforce account</h1>
      <p className="mt-2 text-sm text-steel">Start with AI employees for cross-border business operations.</p>
      {error ? <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800">{error}</div> : null}
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="label">Company name</span>
          <input name="companyName" className="field" placeholder="LINKORNA Trading GmbH" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Work email</span>
          <input name="email" className="field" placeholder="team@company.com" type="email" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input name="password" className="field" placeholder="Create a password" type="password" minLength={8} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Primary use case</span>
          <select name="useCase" className="field">
            <option>China-Europe trade</option>
            <option>E-commerce listing</option>
            <option>Procurement</option>
            <option>Meeting documentation</option>
          </select>
        </label>
        <button disabled={loading} className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white disabled:cursor-wait disabled:opacity-75">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
      <p className="mt-5 text-sm text-steel">
        Already have an account? <Link className="font-black text-navy" href="/login">Login</Link>
      </p>
    </form>
  );
}
