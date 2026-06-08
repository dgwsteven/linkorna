import Link from "next/link";
import { Header } from "@/components/Header";

export default function LoginPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-navy">Login to LINKORNA</h1>
          <p className="mt-2 text-sm text-steel">Mock access for the MVP workforce console.</p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2"><span className="label">Work email</span><input className="field" placeholder="team@company.com" /></label>
            <label className="grid gap-2"><span className="label">Password</span><input className="field" placeholder="Password" type="password" /></label>
            <Link href="/dashboard" className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white">Login</Link>
          </div>
          <p className="mt-5 text-sm text-steel">New to LINKORNA? <Link className="font-black text-navy" href="/register">Create account</Link></p>
        </div>
      </section>
    </main>
  );
}
