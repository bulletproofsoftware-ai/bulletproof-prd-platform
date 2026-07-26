import { NextResponse } from "next/server";
import { cookieVerifier } from "@/middleware";

/**
 * Exchanges the shared secret for an httpOnly cookie so browser navigation
 * works without putting the key in localStorage or a query string.
 */
export async function POST(req: Request) {
  const expected = process.env.PRD_PLATFORM_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "PRD_PLATFORM_API_KEY is not set on the server." },
      { status: 503 },
    );
  }

  let key = "";
  try {
    const body = await req.json();
    key = typeof body?.key === "string" ? body.key : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Constant-time comparison — see the note in src/middleware.ts.
  let ok = key.length === expected.length;
  if (ok) {
    let diff = 0;
    for (let i = 0; i < key.length; i++) {
      diff |= key.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    ok = diff === 0;
  }

  if (!ok) {
    return NextResponse.json({ error: "Invalid key." }, { status: 401 });
  }

  // Store a derived verifier, never the shared secret itself: a cookie is
  // readable by anything that can reach the browser jar or a backup of it,
  // and the raw key would be replayable against the API directly.
  // The middleware accepts either this digest or the raw key in a header.
  const verifier = cookieVerifier(key);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("prd_platform_key", verifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
