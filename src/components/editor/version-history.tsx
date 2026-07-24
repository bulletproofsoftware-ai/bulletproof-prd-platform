"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

type Version = {
  id: string;
  versionNumber: number;
  createdAt: string;
};

export function VersionHistory({ prdId }: { prdId: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/prds/${prdId}/versions`)
      .then((r) => r.json())
      .then(setVersions);
  }, [prdId, open]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="print:hidden"
      >
        <History className="mr-1 h-3 w-3" /> History
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md border bg-popover p-2 shadow-lg print:hidden">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Version History
          </p>
          {versions.length === 0 ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              No versions saved yet
            </p>
          ) : (
            <ul className="max-h-48 space-y-1 overflow-auto">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <span className="font-medium">v{v.versionNumber}</span>
                  <span className="text-muted-foreground">
                    {new Date(v.createdAt).toLocaleDateString()}{" "}
                    {new Date(v.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
