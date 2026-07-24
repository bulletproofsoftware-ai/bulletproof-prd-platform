import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/prds/status-badge";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { prd: { select: { id: true, title: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Reviews</h1>
      <div className="space-y-2">
        {reviews.map((review) => (
          <Link key={review.id} href={`/reviews/${review.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center justify-between py-3">
                <span className="font-medium">{review.prd.title}</span>
                <div className="flex items-center gap-3">
                  <StatusBadge status={review.status} />
                  <span className="text-xs text-muted-foreground">
                    {review.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {reviews.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No reviews yet. Stage a PRD for review to get started.
        </p>
      )}
    </div>
  );
}
