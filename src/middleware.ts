import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  const appBaseUrl = process.env.APP_BASE_URL;

  if (appBaseUrl) {
    try {
      const canonicalUrl = new URL(appBaseUrl);
      const incomingHost = request.headers.get("host")?.toLowerCase();
      const canonicalHost = canonicalUrl.host.toLowerCase();

      if (incomingHost && incomingHost !== canonicalHost) {
        const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalUrl.origin);
        return NextResponse.redirect(redirectUrl, { status: 307 });
      }
    } catch {
      // Ignore malformed APP_BASE_URL and continue normal middleware execution.
    }
  }

  const hasAuth0Env =
    Boolean(process.env.AUTH0_DOMAIN)
    && Boolean(process.env.AUTH0_CLIENT_ID)
    && Boolean(process.env.AUTH0_CLIENT_SECRET)
    && Boolean(process.env.AUTH0_SECRET);

  if (!hasAuth0Env) {
    // Allow public pages (including /demo) to keep working until Auth0 is configured.
    return NextResponse.next();
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/analyze",
    "/api/history",
    "/api/rescues",
    "/api/stats",
    "/auth/:path*",
  ],
};
