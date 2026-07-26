import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prd = await prisma.prd.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!prd) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prd);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      return NextResponse.json({ error: "title must be a string" }, { status: 400 });
    }
    updateData.title = body.title;
  }
  if (body.contentMd !== undefined) {
    if (typeof body.contentMd !== "string") {
      return NextResponse.json({ error: "contentMd must be a string" }, { status: 400 });
    }
    updateData.contentMd = body.contentMd;
  }

  // `approved` and `rejected` are outcomes of the review workflow
  // (PUT /api/reviews/:id), which writes them after validating the review.
  // Accepting them here let a caller self-approve a PRD and skip review
  // entirely. Only the authoring states may be set directly.
  if (body.status !== undefined) {
    const AUTHORING_STATUSES = ["draft", "research", "editing", "review"];
    if (typeof body.status !== "string" || !AUTHORING_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          error:
            `status must be one of: ${AUTHORING_STATUSES.join(", ")}. ` +
            "approved/rejected are set by the review workflow.",
        },
        { status: 400 },
      );
    }
    updateData.status = body.status;
  }

  const prd = await prisma.prd.update({ where: { id }, data: updateData });

  if (body.contentMd !== undefined) {
    const lastVersion = await prisma.prdVersion.findFirst({
      where: { prdId: id },
      orderBy: { versionNumber: "desc" },
    });
    await prisma.prdVersion.create({
      data: {
        prdId: id,
        contentMd: body.contentMd as string,
        versionNumber: (lastVersion?.versionNumber || 0) + 1,
      },
    });
  }

  return NextResponse.json(prd);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.prd.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
