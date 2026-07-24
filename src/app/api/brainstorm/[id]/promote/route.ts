import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { claudeGenerateWithContext } from "@/lib/claude";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const target = body.target as "idea" | "research" | "prd";

  const session = await prisma.brainstormSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const conversation = session.messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  let promotedId: string;

  if (target === "idea") {
    const summary = await claudeGenerateWithContext(
      "Summarize this brainstorm into a concise idea with a title (first line) and description (rest). Return only the title and description.",
      conversation
    );
    const lines = summary.split("\n").filter(Boolean);
    const title = lines[0] || session.title;
    const description = lines.slice(1).join("\n") || summary;
    const idea = await prisma.idea.create({ data: { title, description } });
    promotedId = idea.id;
  } else if (target === "research") {
    const prompt = await claudeGenerateWithContext(
      "Distill this brainstorm into a single research prompt (1-2 sentences). Return only the prompt.",
      conversation
    );
    return NextResponse.json({ target: "research", prompt, sessionId: id });
  } else {
    const contentMd = await claudeGenerateWithContext(
      `Based on this brainstorm, generate a comprehensive PRD in markdown with sections: Overview, Problem Statement, Goals, Requirements (Functional/Non-Functional), Architecture, Security Considerations, Success Criteria, Open Questions.`,
      conversation
    );
    const titleMatch = contentMd.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : session.title;
    const prd = await prisma.prd.create({
      data: { title, contentMd, source: "brainstorm", status: "draft" },
    });
    promotedId = prd.id;
  }

  await prisma.brainstormSession.update({
    where: { id },
    data: { status: "promoted", promotedTo: target, promotedId },
  });

  return NextResponse.json({ target, promotedId }, { status: 201 });
}
