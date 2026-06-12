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
    ? new NextResponse(
        `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Logging in...</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 32px; color: #071844;">
            <h1>Login successful</h1>
            <p>LINKORNA is confirming your secure login session before opening the dashboard.</p>
            <p id="status">Checking session...</p>
            <p><a href="/auth/check?next=${encodeURIComponent(next)}">Open session check</a></p>
            <script>
              (async function () {
                const status = document.getElementById("status");
                for (let attempt = 0; attempt < 8; attempt += 1) {
                  try {
                    const response = await fetch("/api/auth/status", { credentials: "same-origin", cache: "no-store" });
                    const payload = await response.json();
                    if (payload && payload.authenticated) {
                      status.textContent = "Session ready. Opening dashboard...";
                      window.location.replace(${JSON.stringify(next)});
                      return;
                    }
                    status.textContent = "Waiting for session cookie...";
                  } catch (error) {
                    status.textContent = "Checking session again...";
                  }
                  await new Promise((resolve) => setTimeout(resolve, 350));
                }
                status.textContent = "Login succeeded, but the browser did not return the login cookie. Please open the session check link.";
              })();
            </script>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store"
          }
        }
      )
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
