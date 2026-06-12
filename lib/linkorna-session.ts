import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const LINKORNA_SESSION_COOKIE = "linkorna_session";

export type LinkornaSession = {
  accessToken: string;
  refreshToken: string;
};

export type LinkornaAuthContext = {
  supabase: SupabaseClient;
  user: User | null;
  source: "linkorna" | "none";
};

function encodeSession(session: LinkornaSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(value?: string | null): LinkornaSession | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    const accessToken = typeof parsed.accessToken === "string" ? parsed.accessToken : "";
    const refreshToken = typeof parsed.refreshToken === "string" ? parsed.refreshToken : "";
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  } catch {
    return null;
  }
}

export function sessionFromCookieHeader(cookieHeader: string | null) {
  const cookies = (cookieHeader || "").split(";").map((item) => item.trim());
  const match = cookies.find((item) => item.startsWith(`${LINKORNA_SESSION_COOKIE}=`));
  const value = match ? decodeURIComponent(match.slice(LINKORNA_SESSION_COOKIE.length + 1)) : "";
  return decodeSession(value);
}

export async function sessionFromServerCookies() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(LINKORNA_SESSION_COOKIE)?.value);
}

export function setLinkornaSessionCookie(response: NextResponse, session: LinkornaSession) {
  response.cookies.set(LINKORNA_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearLinkornaSessionCookie(response: NextResponse) {
  response.cookies.set(LINKORNA_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export function clientForAccessToken(accessToken: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}

export async function getLinkornaAuthContext(): Promise<LinkornaAuthContext> {
  const session = await sessionFromServerCookies();
  const supabase = session
    ? clientForAccessToken(session.accessToken)
    : createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );

  if (!session) {
    return { supabase, user: null, source: "none" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser(session.accessToken);

  return { supabase, user, source: user ? "linkorna" : "none" };
}
