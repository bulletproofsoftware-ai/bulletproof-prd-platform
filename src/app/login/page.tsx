"use client";

import { useState } from "react";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        // `next` is attacker-controllable. Unvalidated it is both an open
        // redirect (?next=https://evil.example) and an XSS sink
        // (?next=javascript:alert(1)) — CodeQL js/client-side-unvalidated-url-
        // redirection and js/xss.
        //
        // Resolve it against our own origin and compare origins, rather than
        // pattern-matching the raw string. The previous prefix test
        //   startsWith("/") && !startsWith("//") && !startsWith("/\\")
        // was bypassable: the URL parser strips tab, CR and LF before
        // resolving, so "/\t/evil.example" passed all three checks and the
        // browser then navigated to https://evil.example/. Parsing first means
        // the value we test is the value the browser will actually use.
        // javascript: and data: URLs fail the comparison because their origin
        // is opaque, never our own.
        const next = new URLSearchParams(window.location.search).get("next");
        let safeNext = "/";
        if (next) {
          try {
            const resolved = new URL(next, window.location.origin);
            if (resolved.origin === window.location.origin) {
              safeNext = resolved.pathname + resolved.search + resolved.hash;
            }
          } catch {
            // Unparseable target — fall through to "/".
          }
        }
        window.location.href = safeNext;
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid key.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-semibold">PRD Platform</h1>
          <p className="text-sm text-muted-foreground">
            Enter the access key configured as PRD_PLATFORM_API_KEY.
          </p>
        </div>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access key"
          autoFocus
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !key}
          className="w-full rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
