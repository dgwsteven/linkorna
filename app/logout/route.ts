import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const cookiesToSet: Array<{ name: string; value: string; options: Parameters<NextResponse["cookies"]["set"]>[2] }> = [];
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

  await supabase.auth.signOut();
  const response = NextResponse.redirect(new URL("/", request.url));
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));

  return response;
}
