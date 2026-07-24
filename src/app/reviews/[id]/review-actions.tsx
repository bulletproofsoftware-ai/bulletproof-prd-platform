"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/prds/status-badge";
import { Check, X, RotateCcw } from "lucide-react";

export function ReviewActions({ reviewId, status }: { reviewId: string; status: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    router.refresh();
  }

  const isPending = status === "pending" || status === "in_progress";

  return (
    <div className="flex items-center gap-3">
      <StatusBadge status={status} />
      {isPending && (
        <>
          <Button size="sm" variant="default" onClick={() => updateStatus("approved")} disabled={updating}>
            <Check className="mr-1 h-3 w-3" /> Approve
          </Button>
          <Button size="sm" variant="outline" onClick={() => updateStatus("changes_requested")} disabled={updating}>
            <RotateCcw className="mr-1 h-3 w-3" /> Request Changes
          </Button>
          <Button size="sm" variant="destructive" onClick={() => updateStatus("rejected")} disabled={updating}>
            <X className="mr-1 h-3 w-3" /> Reject
          </Button>
        </>
      )}
    </div>
  );
}
