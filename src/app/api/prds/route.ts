import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PrdStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where = status ? { status: status as PrdStatus } : {};
  const prds = await prisma.prd.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, status: true, source: true,
      author: true, createdAt: true, updatedAt: true,
    },
  });
  return NextResponse.json(prds);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prd = await prisma.prd.create({
    data: {
      title: body.title,
      contentMd: body.contentMd || "",
      source: body.source || "manual",
      status: body.status || "draft",
    },
  });
  return NextResponse.json(prd, { status: 201 });
}
