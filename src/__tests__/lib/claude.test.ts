import { describe, it, expect, vi, afterEach } from "vitest";

vi.unmock("@/lib/claude");
vi.mock("node:child_process", () => ({
  execFile: vi.fn(),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { claudeGenerate, claudeGenerateWithContext } from "@/lib/claude";

describe("claudeGenerate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    mockFetch.mockReset();
  });

  it("uses CLI proxy when CLI_PROXY_URL is set", async () => {
    vi.stubEnv("CLI_PROXY_URL", "http://host.docker.internal:3199");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: "proxy response" }),
    });

    const result = await claudeGenerate("test prompt");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://host.docker.internal:3199",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("claude"),
      })
    );
    expect(result).toBe("proxy response");
  });

  it("throws when proxy returns error", async () => {
    vi.stubEnv("CLI_PROXY_URL", "http://host.docker.internal:3199");
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "CLI failed" }),
    });

    await expect(claudeGenerate("test")).rejects.toThrow("CLI failed");
  });
});

describe("claudeGenerateWithContext", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    mockFetch.mockReset();
  });

  it("combines context and prompt", async () => {
    vi.stubEnv("CLI_PROXY_URL", "http://host.docker.internal:3199");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: "response" }),
    });

    await claudeGenerateWithContext("prompt", "context");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.prompt).toContain("context");
    expect(body.prompt).toContain("prompt");
  });
});
