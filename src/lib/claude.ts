import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CLAUDE_CLI = process.env.CLAUDE_CLI_PATH || "claude";
async function callViaProxy(prompt: string): Promise<string> {
  const res = await fetch(process.env.CLI_PROXY_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cli: "claude", prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "CLI proxy request failed");
  return data.result;
}

async function callDirectly(prompt: string): Promise<string> {
  const { stdout } = await execFileAsync(CLAUDE_CLI, ["-p", prompt, "--no-input"], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 120_000,
  });
  return stdout.trim();
}

export async function claudeGenerate(prompt: string): Promise<string> {
  return process.env.CLI_PROXY_URL ? callViaProxy(prompt) : callDirectly(prompt);
}

export async function claudeGenerateWithContext(
  prompt: string,
  context: string
): Promise<string> {
  const fullPrompt = `${context}\n\n---\n\n${prompt}`;
  return claudeGenerate(fullPrompt);
}
