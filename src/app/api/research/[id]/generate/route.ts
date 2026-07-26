import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { claudeGenerateWithContext } from "@/lib/claude";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.researchSession.findUnique({ where: { id } });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.status !== "completed") return NextResponse.json({ error: "Research not completed" }, { status: 400 });

  // `results` is a nullable JSON column. The cast asserted an array without
  // checking, so a completed session that stored null (or a non-array shape)
  // crashed here with "results.map is not a function" instead of returning a
  // useful error.
  const rawResults = session.results;
  if (!Array.isArray(rawResults) || rawResults.length === 0) {
    return NextResponse.json(
      { error: "Research session has no results to generate from" },
      { status: 400 },
    );
  }
  const results = rawResults as Array<{ query: string; result: string }>;
  const researchContext = results.map((r) => `### Research: ${r.query}\n\n${r.result}`).join("\n\n---\n\n");

  const prompt = `Based on the research findings below, generate a comprehensive PRD in markdown format with sections:
# [Title]
## Overview
## Problem Statement
## Goals
## Requirements
### Functional Requirements
### Non-Functional Requirements
## Architecture
## Security Considerations
## Success Criteria
## Open Questions

The original research prompt was: "${session.prompt}"

Generate the full PRD content in markdown.`;

  const contentMd = await claudeGenerateWithContext(prompt, researchContext);
  const titleMatch = contentMd.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : session.prompt.slice(0, 80);

  const prd = await prisma.prd.create({
    data: { title, contentMd, source: "research", status: "draft" },
  });

  await prisma.researchSession.update({ where: { id }, data: { prdId: prd.id } });

  return NextResponse.json({ prd }, { status: 201 });
}
