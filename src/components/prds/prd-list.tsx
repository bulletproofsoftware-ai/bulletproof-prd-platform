"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./status-badge";

type Prd = { id: string; title: string; status: string; source: string; updatedAt: string };

export function PrdList() {
  const [prds, setPrds] = useState<Prd[]>([]);
  const [filter, setFilter] = useState("all");

  const fetchPrds = useCallback(async () => {
    const url = filter === "all" ? "/api/prds" : `/api/prds?status=${filter}`;
    const res = await fetch(url);
    setPrds(await res.json());
  }, [filter]);

  useEffect(() => { fetchPrds(); }, [fetchPrds]);

  return (
    <div>
      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="editing">Editing</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-2">
        {prds.map((prd) => (
          <Link key={prd.id} href={`/prds/${prd.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <span className="font-medium">{prd.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({prd.source})</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={prd.status} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(prd.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {prds.length === 0 && <p className="mt-8 text-center text-muted-foreground">No PRDs found.</p>}
    </div>
  );
}
