import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const LINKORNA_SESSION_COOKIE = "linkorna_session";
export const LINKORNA_USER_COOKIE = "linkorna_user";

export type LinkornaSession = {
  accessToken: string;
  refreshToken: string;
};

export type LinkornaAuthContext = {
  supabase: SupabaseClient;
  user: User | null;
  source: "linkorna" | "signed" | "none";
};

export type SignedUserSession = {
  userId: string;
  email: string | null;
  expiresAt: number;
};

function signingSecret() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!secret) throw new Error("Linkorna session signing secret is not configured.");
  return secret;
}

function cookieDomain() {
  return process.env.VERCEL_ENV === "production" ? ".linkorna.com" : undefined;
}

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

function signPayload(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

function encodeSignedUserSession(session: SignedUserSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

function decodeSignedUserSession(value?: string | null): SignedUserSession | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = signPayload(payload);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const userId = typeof parsed.userId === "string" ? parsed.userId : "";
    const email = typeof parsed.email === "string" ? parsed.email : null;
    const expiresAt = typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;
    if (!userId || expiresAt < Date.now()) return null;
    return { userId, email, expiresAt };
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

export function signedUserFromCookieHeader(cookieHeader: string | null) {
  const cookies = (cookieHeader || "").split(";").map((item) => item.trim());
  const matches = cookies.filter((item) => item.startsWith(`${LINKORNA_USER_COOKIE}=`));

  for (const match of matches) {
    const value = decodeURIComponent(match.slice(LINKORNA_USER_COOKIE.length + 1));
    const session = decodeSignedUserSession(value);
    if (session) return session;
  }

  return null;
}

export async function sessionFromServerCookies() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(LINKORNA_SESSION_COOKIE)?.value);
}

export async function signedUserFromServerCookies() {
  const headerStore = await headers();
  const fromHeader = signedUserFromCookieHeader(headerStore.get("cookie"));
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  const allSignedCookies = cookieStore.getAll(LINKORNA_USER_COOKIE);

  for (const cookie of allSignedCookies) {
    const session = decodeSignedUserSession(cookie.value);
    if (session) return session;
  }

  return null;
}

export function setLinkornaSessionCookie(response: NextResponse, session: LinkornaSession) {
  response.cookies.set(LINKORNA_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: cookieDomain(),
    maxAge: 60 * 60 * 24 * 30
  });
}

export function setSignedUserCookie(response: NextResponse, user: { id: string; email?: string | null }) {
  const value = encodeSignedUserSession({
    userId: user.id,
    email: user.email ?? null,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
  });

  response.cookies.set(LINKORNA_USER_COOKIE, value, {
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
    domain: cookieDomain(),
    maxAge: 0
  });
  response.cookies.set(LINKORNA_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(LINKORNA_USER_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: cookieDomain(),
    maxAge: 0
  });
  response.cookies.set(LINKORNA_USER_COOKIE, "", {
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
  const signedUser = await signedUserFromServerCookies();
  if (signedUser) {
    return {
      supabase: createAdminClient() as SupabaseClient,
      user: { id: signedUser.userId, email: signedUser.email } as User,
      source: "signed"
    };
  }

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
