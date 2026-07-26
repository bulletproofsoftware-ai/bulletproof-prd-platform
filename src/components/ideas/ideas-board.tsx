"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { IdeaCard } from "./idea-card";
import { IdeaForm } from "./idea-form";

type Idea = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  prdId: string | null;
  createdAt: string;
};

export function IdeasBoard() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas");
    const data = await res.json();
    setIdeas(data);
  }, []);

  // Await inside the effect so the state update lands in a microtask rather
  // than synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    void (async () => { await fetchIdeas(); })();
  }, [fetchIdeas]);

  async function handleCreate(data: { title: string; description: string; tags: string[] }) {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchIdeas();
  }

  async function handleEdit(data: { title: string; description: string; tags: string[] }) {
    if (!editingIdea) return;
    await fetch(`/api/ideas/${editingIdea.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingIdea(null);
    fetchIdeas();
  }

  async function handlePromote(id: string) {
    const res = await fetch(`/api/ideas/${id}/promote`, { method: "POST" });
    if (res.ok) {
      const { prd } = await res.json();
      fetchIdeas();
      router.push(`/prds/${prd.id}`);
    }
  }

  async function handleArchive(id: string) {
    await fetch(`/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });
    fetchIdeas();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    fetchIdeas();
  }

  const filtered =
    filter === "all" ? ideas : ideas.filter((i) => i.status === filter);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="promoted">Promoted</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> New Idea
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onEdit={(idea) => setEditingIdea(idea)}
            onPromote={handlePromote}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No ideas yet. Click &quot;New Idea&quot; to add one.
        </p>
      )}
      <IdeaForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
      <IdeaForm
        open={!!editingIdea}
        onClose={() => setEditingIdea(null)}
        onSubmit={handleEdit}
        initialData={editingIdea || undefined}
      />
    </div>
  );
}
