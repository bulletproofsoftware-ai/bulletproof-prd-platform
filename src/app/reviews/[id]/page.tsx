import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ScanResults } from "@/components/reviews/scan-results";
import { CommentThread } from "@/components/reviews/comment-thread";
import { ReviewActions } from "./review-actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({
    where: { id },
    include: { prd: true, comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!review) notFound();

  const securityFindings = (review.securityScan as unknown as Array<{ severity: string; title: string; description: string }>) || [];
  const duplicationResults = (review.duplicationScan as unknown as Array<{ overlap: string; references: string[] }>) || [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Review: {review.prd.title}</h1>
        <ReviewActions reviewId={review.id} status={review.status} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 overflow-auto border-r p-4">
          <ScanResults
            summary={review.aiSummary || "Summary not available."}
            securityFindings={securityFindings}
            duplicationResults={duplicationResults}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <Card>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none py-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.prd.contentMd}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
          <div className="border-t p-4">
            <CommentThread
              reviewId={review.id}
              comments={review.comments.map((c) => ({
                id: c.id, author: c.author, body: c.body,
                sectionRef: c.sectionRef, createdAt: c.createdAt.toISOString(),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
