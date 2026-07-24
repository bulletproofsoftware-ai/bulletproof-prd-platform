import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResearchQueries, runParallelResearch } from "@/lib/gemini";

export async function GET() {
  const sessions = await prisma.researchSession.findMany({
    orderBy: { createdAt: "desc" },
    include: { prd: { select: { id: true, title: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = body.prompt;
  const queries = generateResearchQueries(prompt);

  const session = await prisma.researchSession.create({
    data: { prompt, queries: queries, status: "running" },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      send({ type: "started", sessionId: session.id, totalQueries: queries.length });
      try {
        const results = await runParallelResearch(queries, (completed, total) => {
          send({ type: "progress", completed, total });
        });
        await prisma.researchSession.update({
          where: { id: session.id },
          data: { results: results as unknown as object, status: "completed" },
        });
        send({ type: "completed", sessionId: session.id });
      } catch (error) {
        await prisma.researchSession.update({
          where: { id: session.id },
          data: { status: "failed" },
        });
        send({ type: "error", message: String(error) });
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
