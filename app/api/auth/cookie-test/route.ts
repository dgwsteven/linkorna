import { NextResponse } from "next/server";

const TEST_COOKIE = "linkorna_cookie_test";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieNames = cookieHeader
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter(Boolean);

  if (url.searchParams.get("clear") === "1") {
    const response = NextResponse.json({ ok: true, action: "cleared", cookieNames });
    response.cookies.set(TEST_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: ".linkorna.com",
      maxAge: 0
    });
    return response;
  }

  const hasTestCookie = cookieNames.includes(TEST_COOKIE);
  const response = NextResponse.json({
    ok: true,
    hasTestCookie,
    cookieNames,
    next: hasTestCookie ? "Cookie is working." : "Refresh this URL once. If hasTestCookie stays false, the browser is not saving this cookie."
  });

  response.cookies.set(TEST_COOKIE, "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: ".linkorna.com",
    maxAge: 60 * 10
  });

  return response;
}
