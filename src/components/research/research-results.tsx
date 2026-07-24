"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/prds/status-badge";
import { FileText, Trash2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ResearchResult = { query: string; result: string };
type ResearchSession = {
  id: string; prompt: string; status: string;
  queries: string[]; results: ResearchResult[];
  prd: { id: string; title: string } | null; createdAt: string;
};

export function ResearchResults({ session }: { session: ResearchSession }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    const res = await fetch(`/api/research/${session.id}/generate`, { method: "POST" });
    if (res.ok) {
      const { prd } = await res.json();
      router.push(`/prds/${prd.id}`);
    }
    setGenerating(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this research session?")) return;
    await fetch(`/api/research/${session.id}`, { method: "DELETE" });
    router.push("/research");
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/research")} className="mb-2">
        <ArrowLeft className="mr-1 h-3 w-3" /> Back to Research
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{session.prompt}</h2>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={session.status} />
            <span className="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {session.status === "completed" && !session.prd && (
          <Button onClick={handleGenerate} disabled={generating}>
            <FileText className="mr-1 h-4 w-4" /> {generating ? "Generating PRD..." : "Generate PRD"}
          </Button>
        )}
        {session.prd && (
          <Button variant="outline" onClick={() => router.push(`/prds/${session.prd!.id}`)}>
            <FileText className="mr-1 h-4 w-4" /> View PRD: {session.prd.title}
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-1 h-3 w-3" /> Delete
        </Button>
      </div>
      {session.results.length > 0 && (
        <Accordion multiple className="space-y-2">
          {session.results.map((result, i) => (
            <AccordionItem key={i} value={`result-${i}`}>
              <AccordionTrigger className="text-sm">{result.query}</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none py-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.result}</ReactMarkdown>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
