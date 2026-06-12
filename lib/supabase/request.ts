import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { signedUserFromCookieHeader } from "@/lib/linkorna-session";
import { createAdminClient } from "@/lib/supabase/admin";

export type RequestAuth = {
  supabase: SupabaseClient;
  user: User | null;
  source: "signed" | "none";
};

export async function createRequestClient(request: Request): Promise<RequestAuth> {
  const signedUser = signedUserFromCookieHeader(request.headers.get("cookie"));
  if (signedUser) {
    return {
      supabase: createAdminClient() as SupabaseClient,
      user: { id: signedUser.userId, email: signedUser.email } as User,
      source: "signed"
    };
  }

  return {
    supabase: createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }) as SupabaseClient,
    user: null,
    source: "none"
  };
}
