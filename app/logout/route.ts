import { type NextRequest, NextResponse } from "next/server";
import { clearLinkornaSessionCookie } from "@/lib/linkorna-session";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearLinkornaSessionCookie(response);

  return response;
}
