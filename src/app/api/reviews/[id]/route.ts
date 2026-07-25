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

// The only statuses a review may be moved to — mirrors the ReviewStatus enum
// in prisma/schema.prisma. Anything else is rejected rather than written
// straight through to the database.
const ALLOWED_STATUSES = [
  "pending",
  "in_progress",
  "approved",
  "rejected",
  "changes_requested",
] as const;

type ReviewStatusValue = (typeof ALLOWED_STATUSES)[number];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = (body as { status?: unknown })?.status;
  if (
    typeof raw !== "string" ||
    !(ALLOWED_STATUSES as readonly string[]).includes(raw)
  ) {
    return NextResponse.json(
      { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }
  const status = raw as ReviewStatusValue;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.review.update({ where: { id }, data: { status } });

  if (status === "approved") {
    const prd = await prisma.prd.update({
      where: { id: review.prdId },
      data: { status: "approved" },
    });

    // Export markdown to prds/ directory. The slug is derived from the title,
    // so fall back to the PRD id when a title slugifies to nothing (e.g. a
    // title of only punctuation or non-Latin characters) rather than writing
    // to ".md".
    const prdsDir = join(process.cwd(), "prds");
    await mkdir(prdsDir, { recursive: true });
    const slug =
      prd.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || prd.id;
    await writeFile(join(prdsDir, `${slug}.md`), prd.contentMd, "utf-8");
  } else if (status === "rejected") {
    await prisma.prd.update({ where: { id: review.prdId }, data: { status: "rejected" } });
  } else if (status === "changes_requested") {
    await prisma.prd.update({ where: { id: review.prdId }, data: { status: "editing" } });
  }

  return NextResponse.json(updated);
}
