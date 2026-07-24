"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Comment = { id: string; author: string; body: string; sectionRef: string | null; createdAt: string };

export function CommentThread({ reviewId, comments: initialComments }: { reviewId: string; comments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    const res = await fetch(`/api/reviews/${reviewId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments([...comments, comment]);
      setBody("");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Comments ({comments.length})</h3>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{comment.author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a comment..." rows={3} />
        <Button type="submit" size="sm" disabled={submitting || !body.trim()}>{submitting ? "Posting..." : "Comment"}</Button>
      </form>
    </div>
  );
}
