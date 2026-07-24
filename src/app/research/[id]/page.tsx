import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ResearchResults } from "@/components/research/research-results";

export default async function ResearchSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.researchSession.findUnique({
    where: { id },
    include: { prd: { select: { id: true, title: true } } },
  });
  if (!session) notFound();

  return (
    <div className="mx-auto max-w-4xl p-8">
      <ResearchResults session={{
        id: session.id, prompt: session.prompt, status: session.status,
        queries: session.queries as string[],
        results: session.results as Array<{ query: string; result: string }>,
        prd: session.prd, createdAt: session.createdAt.toISOString(),
      }} />
    </div>
  );
}
