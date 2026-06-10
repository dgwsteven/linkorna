import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  const { data: profile } = await supabase.from("profiles").select("company_name, full_name").eq("id", user.id).single();

  return NextResponse.json({
    authenticated: true,
    email: user.email,
    companyName: profile?.company_name || null,
    fullName: profile?.full_name || null
  });
}
