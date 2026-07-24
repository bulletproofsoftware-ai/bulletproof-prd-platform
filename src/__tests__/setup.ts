import { vi } from "vitest";

// Mock Prisma client
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    idea: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    prd: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    prdVersion: {
      findMany: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
    },
    brainstormSession: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    brainstormMessage: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    researchSession: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    review: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    reviewComment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

// Mock Claude CLI
vi.mock("@/lib/claude", () => ({
  claudeGenerate: vi.fn().mockResolvedValue("Mock Claude response"),
  claudeGenerateWithContext: vi.fn().mockResolvedValue("Mock Claude response with context"),
}));

// Mock Gemini CLI
vi.mock("@/lib/gemini", () => ({
  geminiSearch: vi.fn().mockResolvedValue("Mock Gemini response"),
  generateResearchQueries: vi.fn((prompt: string) => [
    `Query 1 about ${prompt}`,
    `Query 2 about ${prompt}`,
  ]),
  runParallelResearch: vi.fn().mockResolvedValue([
    { query: "test query", result: "test result" },
  ]),
}));
