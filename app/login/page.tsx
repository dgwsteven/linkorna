import Link from "next/link";
import { Header } from "@/components/Header";
import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;

  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <form action={login} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-navy">Login to LINKORNA</h1>
          <p className="mt-2 text-sm text-steel">Access your AI workforce console.</p>
          {message ? <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</div> : null}
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Work email</span>
              <input name="email" className="field" placeholder="team@company.com" type="email" required />
            </label>
            <label className="grid gap-2">
              <span className="label">Password</span>
              <input name="password" className="field" placeholder="Password" type="password" required />
            </label>
            <button className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white">Login</button>
          </div>
          <p className="mt-5 text-sm text-steel">
            New to LINKORNA? <Link className="font-black text-navy" href="/register">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
