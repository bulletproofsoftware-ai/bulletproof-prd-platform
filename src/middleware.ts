import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication gate for the whole app.
 *
 * This is a single-tenant, self-hosted tool: one shared secret, no user
 * accounts. It exists because every API route here is otherwise anonymous,
 * and several of them reach an LLM CLI running on the host under the
 * operator's own credentials — so an unauthenticated caller could spend the
 * operator's API budget and drive an agentic process.
 *
 * Supply the secret as either:
 *   Authorization: Bearer <PRD_PLATFORM_API_KEY>
 *   x-api-key: <PRD_PLATFORM_API_KEY>
 *
 * Browser sessions send it via the prd_platform_key cookie, set by the login
 * form at /login.
 */

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/health"];

function timingSafeEqual(a: string, b: string): boolean {
  // Constant-time comparison: never return early on first mismatch, so an
  // attacker cannot recover the key byte-by-byte from response timing.
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const expected = process.env.PRD_PLATFORM_API_KEY;

  // Fail closed. An unset key must not mean "allow everyone" — that is the
  // exact posture this middleware was added to remove.
  if (!expected) {
    return NextResponse.json(
      {
        error:
          "PRD_PLATFORM_API_KEY is not set. The server refuses requests until it is configured.",
      },
      { status: 503 },
    );
  }

  const header = req.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const supplied =
    bearer ??
    req.headers.get("x-api-key") ??
    req.cookies.get("prd_platform_key")?.value ??
    "";

  if (!supplied || !timingSafeEqual(supplied, expected)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = req.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
