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
        // redirection and js/xss. Only same-origin absolute paths are honoured;
        // "//host" is rejected because the browser reads it as protocol-relative.
        const next = new URLSearchParams(window.location.search).get("next");
        const safeNext =
          next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
            ? next
            : "/";
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
