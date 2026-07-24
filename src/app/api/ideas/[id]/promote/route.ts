import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (idea.status === "promoted") {
    return NextResponse.json({ error: "Already promoted" }, { status: 400 });
  }

  const prd = await prisma.prd.create({
    data: {
      title: idea.title,
      contentMd: `# ${idea.title}\n\n## Overview\n\n${idea.description}\n\n## Problem Statement\n\n\n\n## Goals\n\n\n\n## Requirements\n\n### Functional\n\n\n\n### Non-Functional\n\n\n\n## Architecture\n\n\n\n## Security Considerations\n\n\n\n## Success Criteria\n\n\n\n## Open Questions\n\n`,
      source: "idea",
      status: "draft",
    },
  });

  await prisma.idea.update({
    where: { id },
    data: { status: "promoted", prdId: prd.id },
  });

  return NextResponse.json({ prd, idea: { ...idea, status: "promoted", prdId: prd.id } }, { status: 201 });
}
