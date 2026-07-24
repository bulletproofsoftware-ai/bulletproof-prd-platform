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
  const body = await req.json();
  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.contentMd !== undefined) updateData.contentMd = body.contentMd;
  if (body.status !== undefined) updateData.status = body.status;

  const prd = await prisma.prd.update({ where: { id }, data: updateData });

  if (body.contentMd !== undefined) {
    const lastVersion = await prisma.prdVersion.findFirst({
      where: { prdId: id },
      orderBy: { versionNumber: "desc" },
    });
    await prisma.prdVersion.create({
      data: {
        prdId: id,
        contentMd: body.contentMd,
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
