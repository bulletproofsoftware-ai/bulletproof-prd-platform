import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSummary, runSecurityScan, runDuplicationScan } from "@/lib/governance";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prd = await prisma.prd.findUnique({ where: { id } });
  if (!prd) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.prd.update({ where: { id }, data: { status: "review" } });

  const existingPrds = await prisma.prd.findMany({
    where: { id: { not: id }, status: { in: ["approved", "review", "editing"] } },
    select: { title: true, contentMd: true },
  });
  const existingSummaries = existingPrds.map((p) => `${p.title}: ${p.contentMd.slice(0, 200)}`);

  const [aiSummary, securityScan, duplicationScan] = await Promise.all([
    generateSummary(prd.contentMd),
    runSecurityScan(prd.contentMd),
    runDuplicationScan(prd.contentMd, existingSummaries),
  ]);

  const review = await prisma.review.create({
    data: {
      prdId: id,
      aiSummary,
      securityScan: securityScan as unknown as object,
      duplicationScan: duplicationScan as unknown as object,
      status: "pending",
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
