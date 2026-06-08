import Link from "next/link";
import { Header } from "@/components/Header";

export default function RegisterPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-navy">Create your workforce account</h1>
          <p className="mt-2 text-sm text-steel">Start with mock AI employees for cross-border business operations.</p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2"><span className="label">Company name</span><input className="field" placeholder="LINKORNA Trading GmbH" /></label>
            <label className="grid gap-2"><span className="label">Work email</span><input className="field" placeholder="team@company.com" /></label>
            <label className="grid gap-2"><span className="label">Primary use case</span><select className="field"><option>China-Europe trade</option><option>E-commerce listing</option><option>Procurement</option><option>Meeting documentation</option></select></label>
            <Link href="/dashboard" className="flex h-11 items-center justify-center rounded-md bg-navy text-sm font-black text-white">Create Account</Link>
          </div>
          <p className="mt-5 text-sm text-steel">Already have an account? <Link className="font-black text-navy" href="/login">Login</Link></p>
        </div>
      </section>
    </main>
  );
}
