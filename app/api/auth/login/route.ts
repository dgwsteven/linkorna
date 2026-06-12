import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { setSignedUserCookie } from "@/lib/linkorna-session";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  const payload = isForm
    ? Object.fromEntries((await request.formData()).entries())
    : await request.json().catch(() => ({}));
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const next = typeof payload.next === "string" && payload.next.startsWith("/") ? payload.next : "/dashboard";

  if (!email || !password) {
    if (isForm) {
      return NextResponse.redirect(new URL("/login?message=Please%20enter%20your%20email%20and%20password.", request.url), 303);
    }
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
    if (isForm) {
      return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`, request.url), 303);
    }
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const response = isForm
    ? NextResponse.redirect(new URL(`/auth/check?next=${encodeURIComponent(next)}`, request.url), 303)
    : NextResponse.json({
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
