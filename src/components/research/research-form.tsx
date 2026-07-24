"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

export function ResearchForm({ onStart }: { onStart: (sessionId: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setRunning(true);
    setProgress(null);

    const res = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data.type === "progress") setProgress({ completed: data.completed, total: data.total });
            else if (data.type === "completed") onStart(data.sessionId);
          }
        }
      }
    }

    setRunning(false);
    setPrompt("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want to research..." rows={4} disabled={running} />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={running || !prompt.trim()}>
          <Search className="mr-1 h-4 w-4" /> {running ? "Researching..." : "Start Research"}
        </Button>
        {progress && <span className="text-sm text-muted-foreground">{progress.completed} of {progress.total} queries complete</span>}
      </div>
    </form>
  );
}
