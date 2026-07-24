import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { claudeGenerate } from "@/lib/claude";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  await prisma.brainstormMessage.create({
    data: { sessionId: id, role: "user", content: body.content },
  });

  const messages = await prisma.brainstormMessage.findMany({
    where: { sessionId: id },
    orderBy: { createdAt: "asc" },
  });

  const conversationContext = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  const prompt = `You are a brainstorming partner helping explore and refine product ideas. Be creative, ask probing questions, suggest angles the user might not have considered, and help crystallize the concept.

After your response, extract key themes and emerging requirements as a JSON array of strings. Format your response as:

[Your conversational response here]

---THEMES---
["theme 1", "theme 2", ...]

Previous conversation:
${conversationContext}

Respond to the user's latest message.`;

  const response = await claudeGenerate(prompt);

  let content = response;
  let themes: string[] = [];
  const themesSplit = response.split("---THEMES---");
  if (themesSplit.length > 1) {
    content = themesSplit[0].trim();
    try { themes = JSON.parse(themesSplit[1].trim()); } catch { themes = []; }
  }

  const assistantMsg = await prisma.brainstormMessage.create({
    data: { sessionId: id, role: "assistant", content, extractedThemes: themes },
  });

  const session = await prisma.brainstormSession.findUnique({ where: { id } });
  if (session?.title === "New Brainstorm" && messages.length <= 2) {
    const titlePrompt = `Generate a short title (3-6 words) for a brainstorming session about: "${body.content}". Return only the title, no quotes.`;
    const title = await claudeGenerate(titlePrompt);
    await prisma.brainstormSession.update({ where: { id }, data: { title: title.slice(0, 100) } });
  }

  return NextResponse.json(assistantMsg, { status: 201 });
}
