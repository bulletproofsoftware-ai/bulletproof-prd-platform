import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await prisma.reviewComment.findMany({
    where: { reviewId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const comment = await prisma.reviewComment.create({
    data: {
      reviewId: id,
      body: body.body,
      author: body.author || "local",
      sectionRef: body.sectionRef || null,
    },
  });
  return NextResponse.json(comment, { status: 201 });
}
