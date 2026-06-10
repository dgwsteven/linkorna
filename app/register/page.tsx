import { Header } from "@/components/Header";
import { RegisterForm } from "@/components/RegisterForm";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;

  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <RegisterForm message={message} />
      </section>
    </main>
  );
}
