import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET, POST } from "@/app/api/prds/route";

const mockPrds = [
  {
    id: "prd-1",
    title: "Test PRD",
    status: "draft",
    source: "manual",
    author: "local",
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-01"),
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/prds", () => {
  it("returns all PRDs when no status filter", async () => {
    vi.mocked(prisma.prd.findMany).mockResolvedValue(mockPrds as never);

    const req = new NextRequest("http://localhost/api/prds");
    const res = await GET(req);
    const data = await res.json();

    expect(prisma.prd.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
    expect(data).toHaveLength(1);
  });

  it("filters by status when provided", async () => {
    vi.mocked(prisma.prd.findMany).mockResolvedValue(mockPrds as never);

    const req = new NextRequest("http://localhost/api/prds?status=draft");
    const res = await GET(req);
    await res.json();

    expect(prisma.prd.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: "draft" } })
    );
  });
});

describe("POST /api/prds", () => {
  it("creates a PRD with defaults", async () => {
    vi.mocked(prisma.prd.create).mockResolvedValue({
      id: "prd-2",
      title: "New PRD",
      contentMd: "",
      source: "manual",
      status: "draft",
      author: "local",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/prds", {
      method: "POST",
      body: JSON.stringify({ title: "New PRD" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(prisma.prd.create).toHaveBeenCalledWith({
      data: {
        title: "New PRD",
        contentMd: "",
        source: "manual",
        status: "draft",
      },
    });
  });

  it("accepts custom source and status", async () => {
    vi.mocked(prisma.prd.create).mockResolvedValue({
      id: "prd-3",
      title: "Research PRD",
      contentMd: "# Content",
      source: "research",
      status: "editing",
      author: "local",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/prds", {
      method: "POST",
      body: JSON.stringify({
        title: "Research PRD",
        contentMd: "# Content",
        source: "research",
        status: "editing",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(prisma.prd.create).toHaveBeenCalledWith({
      data: {
        title: "Research PRD",
        contentMd: "# Content",
        source: "research",
        status: "editing",
      },
    });
  });
});
