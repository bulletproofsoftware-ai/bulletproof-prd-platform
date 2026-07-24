import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ChatInterface } from "@/components/brainstorm/chat-interface";

export default async function BrainstormSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.brainstormSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) notFound();

  return (
    <ChatInterface session={{
      id: session.id, title: session.title, status: session.status,
      messages: session.messages.map((m) => ({
        id: m.id, role: m.role, content: m.content,
        extractedThemes: m.extractedThemes as string[] | null,
        createdAt: m.createdAt.toISOString(),
      })),
    }} />
  );
}
