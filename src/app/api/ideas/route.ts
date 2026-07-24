import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { prd: { select: { id: true, title: true } } },
  });
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const idea = await prisma.idea.create({
    data: {
      title: body.title,
      description: body.description || "",
      tags: body.tags || [],
    },
  });
  return NextResponse.json(idea, { status: 201 });
}
