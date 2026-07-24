import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET, POST } from "@/app/api/ideas/route";
import {
  GET as GET_ID,
  PUT,
  DELETE,
} from "@/app/api/ideas/[id]/route";

const mockIdeas = [
  {
    id: "idea-1",
    title: "Test Idea",
    description: "Test description",
    tags: ["test"],
    status: "open",
    prdId: null,
    createdAt: new Date("2026-04-01"),
    prd: null,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/ideas", () => {
  it("returns all ideas ordered by createdAt desc", async () => {
    vi.mocked(prisma.idea.findMany).mockResolvedValue(mockIdeas as never);

    const res = await GET();
    const data = await res.json();

    expect(prisma.idea.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      include: { prd: { select: { id: true, title: true } } },
    });
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test Idea");
  });

  it("returns empty array when no ideas exist", async () => {
    vi.mocked(prisma.idea.findMany).mockResolvedValue([] as never);

    const res = await GET();
    const data = await res.json();

    expect(data).toHaveLength(0);
  });
});

describe("POST /api/ideas", () => {
  it("creates an idea with all fields", async () => {
    const newIdea = { title: "New Idea", description: "Desc", tags: ["ai"] };
    vi.mocked(prisma.idea.create).mockResolvedValue({
      id: "idea-2",
      ...newIdea,
      status: "open",
      prdId: null,
      createdAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/ideas", {
      method: "POST",
      body: JSON.stringify(newIdea),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(prisma.idea.create).toHaveBeenCalledWith({
      data: { title: "New Idea", description: "Desc", tags: ["ai"] },
    });
  });

  it("defaults description to empty string and tags to empty array", async () => {
    vi.mocked(prisma.idea.create).mockResolvedValue({
      id: "idea-3",
      title: "Minimal",
      description: "",
      tags: [],
      status: "open",
      prdId: null,
      createdAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/ideas", {
      method: "POST",
      body: JSON.stringify({ title: "Minimal" }),
    });

    await POST(req);

    expect(prisma.idea.create).toHaveBeenCalledWith({
      data: { title: "Minimal", description: "", tags: [] },
    });
  });
});

describe("GET /api/ideas/[id]", () => {
  it("returns an idea by id", async () => {
    vi.mocked(prisma.idea.findUnique).mockResolvedValue(mockIdeas[0] as never);

    const res = await GET_ID(
      new NextRequest("http://localhost/api/ideas/idea-1"),
      { params: Promise.resolve({ id: "idea-1" }) }
    );
    const data = await res.json();

    expect(data.title).toBe("Test Idea");
  });

  it("returns 404 for non-existent idea", async () => {
    vi.mocked(prisma.idea.findUnique).mockResolvedValue(null as never);

    const res = await GET_ID(
      new NextRequest("http://localhost/api/ideas/fake"),
      { params: Promise.resolve({ id: "fake" }) }
    );

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/ideas/[id]", () => {
  it("updates an idea", async () => {
    vi.mocked(prisma.idea.update).mockResolvedValue({
      ...mockIdeas[0],
      title: "Updated",
    } as never);

    const req = new NextRequest("http://localhost/api/ideas/idea-1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "idea-1" }) });
    const data = await res.json();

    expect(data.title).toBe("Updated");
  });
});

describe("DELETE /api/ideas/[id]", () => {
  it("deletes an idea", async () => {
    vi.mocked(prisma.idea.delete).mockResolvedValue(mockIdeas[0] as never);

    const res = await DELETE(
      new NextRequest("http://localhost/api/ideas/idea-1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "idea-1" }) }
    );
    const data = await res.json();

    expect(data.ok).toBe(true);
    expect(prisma.idea.delete).toHaveBeenCalledWith({ where: { id: "idea-1" } });
  });
});
