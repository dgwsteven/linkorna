import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string; next?: string }> }) {
  const { message, next } = await searchParams;

  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <LoginForm message={message} next={next || "/dashboard"} />
      </section>
    </main>
  );
}
