import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET, PUT } from "@/app/api/reviews/[id]/route";

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

const mockReview = {
  id: "rev-1",
  prdId: "prd-1",
  status: "pending",
  aiSummary: "Summary text",
  securityScan: [],
  duplicationScan: [],
  createdAt: new Date("2026-04-01"),
  prd: {
    id: "prd-1",
    title: "Test PRD",
    contentMd: "# Test PRD\nContent here",
    status: "review",
  },
  comments: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/reviews/[id]", () => {
  it("returns review with PRD and comments", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(mockReview as never);

    const res = await GET(
      new NextRequest("http://localhost/api/reviews/rev-1"),
      { params: Promise.resolve({ id: "rev-1" }) }
    );
    const data = await res.json();

    expect(data.id).toBe("rev-1");
    expect(data.prd.title).toBe("Test PRD");
  });

  it("returns 404 for non-existent review", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(null as never);

    const res = await GET(
      new NextRequest("http://localhost/api/reviews/fake"),
      { params: Promise.resolve({ id: "fake" }) }
    );

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/reviews/[id]", () => {
  it("approves review and updates PRD status", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(mockReview as never);
    vi.mocked(prisma.review.update).mockResolvedValue({
      ...mockReview,
      status: "approved",
    } as never);
    vi.mocked(prisma.prd.update).mockResolvedValue({
      ...mockReview.prd,
      status: "approved",
    } as never);

    const req = new NextRequest("http://localhost/api/reviews/rev-1", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "rev-1" }) });
    const data = await res.json();

    expect(data.status).toBe("approved");
    expect(prisma.prd.update).toHaveBeenCalledWith({
      where: { id: "prd-1" },
      data: { status: "approved" },
    });
  });

  it("rejects review and updates PRD status", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(mockReview as never);
    vi.mocked(prisma.review.update).mockResolvedValue({
      ...mockReview,
      status: "rejected",
    } as never);
    vi.mocked(prisma.prd.update).mockResolvedValue({
      ...mockReview.prd,
      status: "rejected",
    } as never);

    const req = new NextRequest("http://localhost/api/reviews/rev-1", {
      method: "PUT",
      body: JSON.stringify({ status: "rejected" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "rev-1" }) });

    expect(prisma.prd.update).toHaveBeenCalledWith({
      where: { id: "prd-1" },
      data: { status: "rejected" },
    });
  });

  it("requests changes and sets PRD to editing", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(mockReview as never);
    vi.mocked(prisma.review.update).mockResolvedValue({
      ...mockReview,
      status: "changes_requested",
    } as never);
    vi.mocked(prisma.prd.update).mockResolvedValue({
      ...mockReview.prd,
      status: "editing",
    } as never);

    const req = new NextRequest("http://localhost/api/reviews/rev-1", {
      method: "PUT",
      body: JSON.stringify({ status: "changes_requested" }),
    });

    await PUT(req, { params: Promise.resolve({ id: "rev-1" }) });

    expect(prisma.prd.update).toHaveBeenCalledWith({
      where: { id: "prd-1" },
      data: { status: "editing" },
    });
  });

  it("returns 404 when review not found", async () => {
    vi.mocked(prisma.review.findUnique).mockResolvedValue(null as never);

    const req = new NextRequest("http://localhost/api/reviews/fake", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "fake" }) });
    expect(res.status).toBe(404);
  });

  it("exports markdown file on approval", async () => {
    const { writeFile, mkdir } = await import("node:fs/promises");

    vi.mocked(prisma.review.findUnique).mockResolvedValue(mockReview as never);
    vi.mocked(prisma.review.update).mockResolvedValue({
      ...mockReview,
      status: "approved",
    } as never);
    vi.mocked(prisma.prd.update).mockResolvedValue({
      ...mockReview.prd,
      status: "approved",
    } as never);

    const req = new NextRequest("http://localhost/api/reviews/rev-1", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });

    await PUT(req, { params: Promise.resolve({ id: "rev-1" }) });

    expect(mkdir).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining("test-prd.md"),
      "# Test PRD\nContent here",
      "utf-8"
    );
  });
});
