import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sessions = await prisma.brainstormSession.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, status: true, updatedAt: true },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await prisma.brainstormSession.create({
    data: { title: body.title || "New Brainstorm" },
  });
  return NextResponse.json(session, { status: 201 });
}
