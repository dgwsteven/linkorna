"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function encoded(message: string) {
  return encodeURIComponent(message);
}

export async function register(formData: FormData) {
  const companyName = String(formData.get("companyName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const useCase = String(formData.get("useCase") ?? "China-Europe trade");

  if (!companyName || !email || !password) {
    redirect(`/register?message=${encoded("Please complete company name, email and password.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
        primary_use_case: useCase
      }
    }
  });

  if (error) {
    redirect(`/register?message=${encoded(error.message)}`);
  }

  redirect("/dashboard");
}
