import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET, POST } from "@/app/api/brainstorm/route";
import {
  GET as GET_ID,
  DELETE,
} from "@/app/api/brainstorm/[id]/route";

const mockSessions = [
  {
    id: "bs-1",
    title: "Test Session",
    status: "active",
    updatedAt: new Date("2026-04-01"),
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/brainstorm", () => {
  it("returns all sessions", async () => {
    vi.mocked(prisma.brainstormSession.findMany).mockResolvedValue(
      mockSessions as never
    );

    const res = await GET();
    const data = await res.json();

    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test Session");
  });
});

describe("POST /api/brainstorm", () => {
  it("creates a session with provided title", async () => {
    vi.mocked(prisma.brainstormSession.create).mockResolvedValue({
      id: "bs-2",
      title: "Custom Title",
      status: "active",
      promotedTo: null,
      promotedId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/brainstorm", {
      method: "POST",
      body: JSON.stringify({ title: "Custom Title" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(prisma.brainstormSession.create).toHaveBeenCalledWith({
      data: { title: "Custom Title" },
    });
  });

  it("defaults title to 'New Brainstorm'", async () => {
    vi.mocked(prisma.brainstormSession.create).mockResolvedValue({
      id: "bs-3",
      title: "New Brainstorm",
      status: "active",
      promotedTo: null,
      promotedId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/api/brainstorm", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(prisma.brainstormSession.create).toHaveBeenCalledWith({
      data: { title: "New Brainstorm" },
    });
  });
});

describe("GET /api/brainstorm/[id]", () => {
  it("returns session with messages", async () => {
    vi.mocked(prisma.brainstormSession.findUnique).mockResolvedValue({
      ...mockSessions[0],
      messages: [
        { id: "msg-1", role: "user", content: "hello", createdAt: new Date() },
      ],
    } as never);

    const res = await GET_ID(
      new NextRequest("http://localhost/api/brainstorm/bs-1"),
      { params: Promise.resolve({ id: "bs-1" }) }
    );
    const data = await res.json();

    expect(data.title).toBe("Test Session");
    expect(data.messages).toHaveLength(1);
  });

  it("returns 404 for non-existent session", async () => {
    vi.mocked(prisma.brainstormSession.findUnique).mockResolvedValue(null as never);

    const res = await GET_ID(
      new NextRequest("http://localhost/api/brainstorm/fake"),
      { params: Promise.resolve({ id: "fake" }) }
    );

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/brainstorm/[id]", () => {
  it("deletes a session", async () => {
    vi.mocked(prisma.brainstormSession.delete).mockResolvedValue(
      mockSessions[0] as never
    );

    const res = await DELETE(
      new NextRequest("http://localhost/api/brainstorm/bs-1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "bs-1" }) }
    );
    const data = await res.json();

    expect(data.ok).toBe(true);
  });
});
