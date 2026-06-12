import { NextResponse } from "next/server";
import { createRequestClient } from "@/lib/supabase/request";

export async function GET(request: Request) {
  const { supabase, user, source } = await createRequestClient(request);
  const cookieNames = (request.headers.get("cookie") || "")
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter(Boolean);

  if (!user) {
    return NextResponse.json({ authenticated: false, source, cookieNames });
  }

  const { data: profile } = await supabase.from("profiles").select("company_name, full_name").eq("id", user.id).single();

  return NextResponse.json({
    authenticated: true,
    source,
    cookieNames,
    email: user.email,
    companyName: profile?.company_name || null,
    fullName: profile?.full_name || null
  });
}
