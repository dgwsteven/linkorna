import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { clientForAccessToken, sessionFromCookieHeader } from "@/lib/linkorna-session";

export type RequestAuth = {
  supabase: SupabaseClient;
  user: User | null;
  source: "linkorna" | "cookie" | "bearer" | "none";
};

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export async function createRequestClient(request: Request): Promise<RequestAuth> {
  const linkornaSession = sessionFromCookieHeader(request.headers.get("cookie"));
  if (linkornaSession) {
    const linkornaClient = clientForAccessToken(linkornaSession.accessToken);
    const {
      data: { user: linkornaUser }
    } = await linkornaClient.auth.getUser(linkornaSession.accessToken);

    if (linkornaUser) {
      return { supabase: linkornaClient, user: linkornaUser, source: "linkorna" };
    }
  }

  const cookieClient = await createServerSupabaseClient();
  const {
    data: { user: cookieUser }
  } = await cookieClient.auth.getUser();

  if (cookieUser) {
    return { supabase: cookieClient as SupabaseClient, user: cookieUser, source: "cookie" };
  }

  const token = bearerToken(request);

  if (!token) {
    return { supabase: cookieClient as SupabaseClient, user: null, source: "none" };
  }

  const bearerClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  const {
    data: { user: bearerUser }
  } = await bearerClient.auth.getUser(token);

  return { supabase: bearerClient, user: bearerUser, source: bearerUser ? "bearer" : "none" };
}
