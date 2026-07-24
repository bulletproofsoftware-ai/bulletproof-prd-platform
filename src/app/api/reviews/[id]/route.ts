import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({
    where: { id },
    include: { prd: true, comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(review);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.review.update({ where: { id }, data: { status: body.status } });

  if (body.status === "approved") {
    const prd = await prisma.prd.update({
      where: { id: review.prdId },
      data: { status: "approved" },
    });

    // Export markdown to prds/ directory
    const prdsDir = join(process.cwd(), "prds");
    await mkdir(prdsDir, { recursive: true });
    const filename = prd.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await writeFile(join(prdsDir, `${filename}.md`), prd.contentMd, "utf-8");
  } else if (body.status === "rejected") {
    await prisma.prd.update({ where: { id: review.prdId }, data: { status: "rejected" } });
  } else if (body.status === "changes_requested") {
    await prisma.prd.update({ where: { id: review.prdId }, data: { status: "editing" } });
  }

  return NextResponse.json(updated);
}
