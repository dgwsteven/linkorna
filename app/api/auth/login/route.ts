import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { setSignedUserCookie } from "@/lib/linkorna-session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    accessToken: data.session?.access_token ?? null,
    refreshToken: data.session?.refresh_token ?? null,
    cookieMode: "signed-only",
    hasUser: Boolean(data.user || data.session?.user)
  });

  const user = data.user || data.session?.user;
  if (user) {
    setSignedUserCookie(response, user);
  }

  return response;
}
