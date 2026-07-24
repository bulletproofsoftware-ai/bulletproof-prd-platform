import { describe, it, expect, vi } from "vitest";

// Unmock gemini so we test the real generateResearchQueries
vi.unmock("@/lib/gemini");

// Mock child_process so geminiSearch doesn't actually execute
vi.mock("node:child_process", () => ({
  execFile: vi.fn(),
}));

import { generateResearchQueries } from "@/lib/gemini";

describe("generateResearchQueries", () => {
  it("returns 7 queries", () => {
    const queries = generateResearchQueries("AI chatbot");
    expect(queries).toHaveLength(7);
  });

  it("interpolates the prompt into queries", () => {
    const queries = generateResearchQueries("AI chatbot");
    queries.forEach((q) => {
      expect(q).toContain("AI chatbot");
    });
  });

  it("covers different research angles", () => {
    const queries = generateResearchQueries("test topic");
    const angles = [
      "best practices",
      "competitors",
      "standards",
      "pitfalls",
      "security",
      "UX",
      "integration",
    ];
    angles.forEach((angle) => {
      expect(
        queries.some((q) => q.toLowerCase().includes(angle.toLowerCase()))
      ).toBe(true);
    });
  });
});
