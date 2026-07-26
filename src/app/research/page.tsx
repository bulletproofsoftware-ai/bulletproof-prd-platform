"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/prds/status-badge";
import { ResearchForm } from "@/components/research/research-form";

type ResearchSession = { id: string; prompt: string; status: string; createdAt: string; prd: { id: string; title: string } | null };

export default function ResearchPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ResearchSession[]>([]);

  const fetchSessions = useCallback(async () => {
    const res = await fetch("/api/research");
    setSessions(await res.json());
  }, []);

  // Await inside the effect so the state update lands in a microtask rather
  // than synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => { void (async () => { await fetchSessions(); })(); }, [fetchSessions]);

  function handleStart(sessionId: string) { router.push(`/research/${sessionId}`); }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Research</h1>
      <ResearchForm onStart={handleStart} />
      <h2 className="mb-4 mt-10 text-lg font-semibold">Past Sessions</h2>
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link key={s.id} href={`/research/${s.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center justify-between py-3">
                <span className="text-sm font-medium line-clamp-1">{s.prompt}</span>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {sessions.length === 0 && <p className="mt-4 text-center text-muted-foreground">No research sessions yet.</p>}
    </div>
  );
}
