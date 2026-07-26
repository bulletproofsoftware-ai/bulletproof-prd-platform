"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/prds/status-badge";
import { Plus } from "lucide-react";

type Session = { id: string; title: string; status: string; updatedAt: string };

export default function BrainstormPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = useCallback(async () => {
    const res = await fetch("/api/brainstorm");
    setSessions(await res.json());
  }, []);

  // Await inside the effect so the state update lands in a microtask rather
  // than synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => { void (async () => { await fetchSessions(); })(); }, [fetchSessions]);

  async function handleNew() {
    const res = await fetch("/api/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const session = await res.json();
      router.push(`/brainstorm/${session.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brainstorm</h1>
        <Button onClick={handleNew}><Plus className="mr-1 h-4 w-4" /> New Session</Button>
      </div>
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link key={s.id} href={`/brainstorm/${s.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center justify-between py-3">
                <span className="font-medium">{s.title}</span>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="text-xs text-muted-foreground">{new Date(s.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {sessions.length === 0 && <p className="mt-8 text-center text-muted-foreground">No brainstorm sessions yet. Click &quot;New Session&quot; to start.</p>}
    </div>
  );
}
