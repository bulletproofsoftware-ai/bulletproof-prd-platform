"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/prds/status-badge";
import { ArrowUpRight, Archive, Pencil, Trash2 } from "lucide-react";

type Idea = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  prdId: string | null;
  createdAt: string;
};

type IdeaCardProps = {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onPromote: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
};

export function IdeaCard({ idea, onEdit, onPromote, onArchive, onDelete }: IdeaCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{idea.title}</CardTitle>
          <StatusBadge status={idea.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-3">{idea.description}</p>
        {idea.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {idea.status === "open" && (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => onPromote(idea.id)}>
              <ArrowUpRight className="mr-1 h-3 w-3" /> Promote to PRD
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(idea)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onArchive(idea.id)}>
              <Archive className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(idea.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
