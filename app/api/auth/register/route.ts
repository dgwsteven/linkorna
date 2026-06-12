import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { setSignedUserCookie } from "@/lib/linkorna-session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const useCase = typeof body.useCase === "string" ? body.useCase : "China-Europe trade";

  if (!companyName || !email || !password) {
    return NextResponse.json({ error: "Company name, email and password are required." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
  const { data, error } = await supabase.auth.signUp({
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    accessToken: data.session?.access_token ?? null,
    refreshToken: data.session?.refresh_token ?? null
  });

  const user = data.user || data.session?.user;
  if (user) {
    setSignedUserCookie(response, user);
  }

  return response;
}
