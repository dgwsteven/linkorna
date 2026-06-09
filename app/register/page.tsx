import Link from "next/link";
import { Header } from "@/components/Header";
import { register } from "./actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;

  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <form action={register} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-navy">Create your workforce account</h1>
          <p className="mt-2 text-sm text-steel">Start with AI employees for cross-border business operations.</p>
          {message ? <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</div> : null}
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
            <button className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white">Create Account</button>
          </div>
          <p className="mt-5 text-sm text-steel">
            Already have an account? <Link className="font-black text-navy" href="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
