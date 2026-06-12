import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { setLinkornaSessionCookie } from "@/lib/linkorna-session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const useCase = typeof body.useCase === "string" ? body.useCase : "China-Europe trade";
  const cookiesToSet: Array<{ name: string; value: string; options: Parameters<NextResponse["cookies"]["set"]>[2] }> = [];

  if (!companyName || !email || !password) {
    return NextResponse.json({ error: "Company name, email and password are required." }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(items) {
          cookiesToSet.push(...items);
        }
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

  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  if (data.session?.access_token && data.session?.refresh_token) {
    setLinkornaSessionCookie(response, {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  }

  return response;
}
