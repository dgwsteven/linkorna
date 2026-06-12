import Link from "next/link";
import { Header } from "@/components/Header";
import { getLinkornaAuthContext } from "@/lib/linkorna-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthCheckPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = next?.startsWith("/") ? next : "/dashboard";
  const { user, source } = await getLinkornaAuthContext();

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase text-blue">Login check</p>
          <h1 className="mt-2 text-3xl font-black text-navy">
            {user ? "Login session ready" : "Login cookie was not received"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-steel">
            Auth source: <span className="font-black text-navy">{source}</span>
          </p>
          {user ? (
            <>
              <p className="mt-2 text-sm leading-6 text-steel">
                Signed in as <span className="font-black text-navy">{user.email}</span>.
              </p>
              <Link href={target} className="mt-6 inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
                Continue
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-steel">
                The account password may not have been accepted, or the login cookie was not stored after the server response.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex h-11 items-center rounded-md bg-blue px-5 text-sm font-black text-white">
                  Login again
                </Link>
                <Link href="/api/auth/status" className="inline-flex h-11 items-center rounded-md border border-line bg-white px-5 text-sm font-black text-navy">
                  Open status
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
