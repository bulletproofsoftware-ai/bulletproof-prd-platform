"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemesPanel } from "./themes-panel";
import { Send, ArrowUpRight, Lightbulb, Search, FileText } from "lucide-react";

type Message = { id: string; role: string; content: string; extractedThemes: string[] | null; createdAt: string };
type Session = { id: string; title: string; status: string; messages: Message[] };

export function ChatInterface({ session }: { session: Session }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const allThemes = messages.flatMap((m) => m.extractedThemes || []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const userMsg: Message = {
      id: `temp-${Date.now()}`, role: "user", content: input,
      extractedThemes: null, createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch(`/api/brainstorm/${session.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: userMsg.content }),
    });
    if (res.ok) {
      const assistantMsg = await res.json();
      setMessages((prev) => [...prev, assistantMsg]);
    }
    setSending(false);
  }

  async function handlePromote(target: "idea" | "research" | "prd") {
    setPromoting(true);
    const res = await fetch(`/api/brainstorm/${session.id}/promote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.target === "idea") router.push("/ideas");
      else if (data.target === "research") router.push(`/research?prompt=${encodeURIComponent(data.prompt)}`);
      else if (data.target === "prd") router.push(`/prds/${data.promotedId}`);
    }
    setPromoting(false);
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share your idea..." rows={2} className="resize-none"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit" size="icon" disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={promoting || messages.length < 2}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handlePromote("idea")}>
                    <Lightbulb className="mr-2 h-4 w-4" /> Promote to Idea
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePromote("research")}>
                    <Search className="mr-2 h-4 w-4" /> Promote to Research
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePromote("prd")}>
                    <FileText className="mr-2 h-4 w-4" /> Promote to Draft PRD
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </div>
      </div>
      <div className="w-64 shrink-0 border-l p-4">
        <ThemesPanel themes={allThemes} />
      </div>
    </div>
  );
}
