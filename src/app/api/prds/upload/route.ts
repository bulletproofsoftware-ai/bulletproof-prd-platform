import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!file.name.endsWith(".md")) return NextResponse.json({ error: "Only .md files are supported" }, { status: 400 });

  const content = await file.text();
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : file.name.replace(/\.md$/, "");

  const prd = await prisma.prd.create({
    data: { title, contentMd: content, source: "upload", status: "editing" },
  });
  return NextResponse.json(prd, { status: 201 });
}
