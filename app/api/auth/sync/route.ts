import { type NextRequest, NextResponse } from "next/server";
import { clientForAccessToken, setSignedUserCookie } from "@/lib/linkorna-session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const accessToken = typeof body.accessToken === "string" ? body.accessToken : "";
  const refreshToken = typeof body.refreshToken === "string" ? body.refreshToken : "";

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Missing browser session tokens." }, { status: 400 });
  }

  const {
    data: { user },
    error
  } = await clientForAccessToken(accessToken).auth.getUser(accessToken);

  if (error || !user) {
    return NextResponse.json({ error: error?.message || "Invalid browser session." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  if (user) {
    setSignedUserCookie(response, user);
  }

  return response;
}
