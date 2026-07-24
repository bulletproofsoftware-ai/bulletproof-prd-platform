import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const GEMINI_CLI = process.env.GEMINI_CLI_PATH || "gemini";
async function callViaProxy(query: string): Promise<string> {
  const res = await fetch(process.env.CLI_PROXY_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cli: "gemini", prompt: query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "CLI proxy request failed");
  return data.result;
}

async function callDirectly(query: string): Promise<string> {
  const { stdout } = await execFileAsync(GEMINI_CLI, ["-p", query], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 60_000,
  });
  return stdout.trim();
}

export async function geminiSearch(query: string): Promise<string> {
  return process.env.CLI_PROXY_URL ? callViaProxy(query) : callDirectly(query);
}

export function generateResearchQueries(prompt: string): string[] {
  return [
    `What are the best practices and design patterns for building ${prompt}?`,
    `What existing tools and competitors exist for ${prompt}? List their key features and differentiators.`,
    `What industry standards, frameworks, and specifications apply to ${prompt}?`,
    `What are common pitfalls, anti-patterns, and mistakes when building ${prompt}?`,
    `What security considerations and threat models apply to ${prompt}?`,
    `What UX patterns and user experience best practices apply to ${prompt}?`,
    `What integration patterns, API conventions, and interoperability standards apply to ${prompt}?`,
  ];
}

export async function runParallelResearch(
  queries: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ query: string; result: string }[]> {
  let completed = 0;
  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const result = await geminiSearch(query);
      completed++;
      onProgress?.(completed, queries.length);
      return { query, result };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{ query: string; result: string }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value);
}
