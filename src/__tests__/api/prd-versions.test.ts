import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET } from "@/app/api/prds/[id]/versions/route";

const mockVersions = [
  { id: "v-2", versionNumber: 2, createdAt: new Date("2026-04-02") },
  { id: "v-1", versionNumber: 1, createdAt: new Date("2026-04-01") },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/prds/[id]/versions", () => {
  it("returns versions ordered by versionNumber desc", async () => {
    vi.mocked(prisma.prdVersion.findMany).mockResolvedValue(mockVersions as never);

    const res = await GET(
      new NextRequest("http://localhost/api/prds/prd-1/versions"),
      { params: Promise.resolve({ id: "prd-1" }) }
    );
    const data = await res.json();

    expect(data).toHaveLength(2);
    expect(data[0].versionNumber).toBe(2);
  });

  it("returns empty array when no versions exist", async () => {
    vi.mocked(prisma.prdVersion.findMany).mockResolvedValue([] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/prds/prd-1/versions"),
      { params: Promise.resolve({ id: "prd-1" }) }
    );
    const data = await res.json();

    expect(data).toHaveLength(0);
  });
});
