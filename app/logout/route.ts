import { type NextRequest, NextResponse } from "next/server";
import { clearLinkornaSessionCookie } from "@/lib/linkorna-session";

export async function GET() {
  return new NextResponse(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Logout | LINKORNA</title>
      </head>
      <body style="font-family: Arial, sans-serif; background: #eef3ff; color: #071844; margin: 0; padding: 32px;">
        <main style="max-width: 560px; margin: 80px auto; background: white; border: 1px solid #d8e0ef; border-radius: 8px; padding: 28px;">
          <h1 style="margin: 0 0 12px;">Logout confirmation</h1>
          <p style="line-height: 1.6;">For account safety, LINKORNA only logs you out after you confirm this action.</p>
          <form method="post" action="/logout" style="margin-top: 24px; display: inline-block;">
            <button style="height: 44px; border: 0; border-radius: 6px; background: #1d4ed8; color: white; font-weight: 800; padding: 0 18px; cursor: pointer;">Logout</button>
          </form>
          <a href="/dashboard" style="display: inline-flex; align-items: center; height: 44px; margin-left: 10px; color: #071844; font-weight: 800; text-decoration: none;">Back to dashboard</a>
        </main>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store"
      }
    }
  );
}

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  clearLinkornaSessionCookie(response);

  return response;
}
