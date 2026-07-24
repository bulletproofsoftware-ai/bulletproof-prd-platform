#!/usr/bin/env node
/**
 * CLI Proxy Server
 * Runs on the HOST machine, exposes gemini and claude CLI tools via HTTP
 * so the Docker container can call them through host.docker.internal.
 *
 * Usage: node scripts/cli-proxy.mjs
 * Listens on port 3100
 */

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const PORT = 3199;

const CLAUDE_CLI = process.env.CLAUDE_CLI_PATH || "claude";
const GEMINI_CLI = process.env.GEMINI_CLI_PATH || "gemini";

async function handleRequest(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;

  try {
    const { cli, prompt } = JSON.parse(body);

    if (!cli || !prompt) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing cli or prompt" }));
      return;
    }

    let command, args;
    if (cli === "gemini") {
      command = GEMINI_CLI;
      args = ["-p", `search: ${prompt}`, "--output-format", "text"];
    } else if (cli === "claude") {
      command = CLAUDE_CLI;
      args = ["-p", prompt, "--output-format", "text"];
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Unknown cli: ${cli}` }));
      return;
    }

    console.log(`[${cli}] Running query (${prompt.length} chars)...`);
    const { stdout } = await execFileAsync(command, args, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: cli === "claude" ? 120_000 : 60_000,
    });

    console.log(`[${cli}] Done (${stdout.length} chars response)`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ result: stdout.trim() }));
  } catch (err) {
    console.error(`[error]`, err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = createServer(handleRequest);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`CLI Proxy listening on http://0.0.0.0:${PORT}`);
  console.log(`  Claude CLI: ${CLAUDE_CLI}`);
  console.log(`  Gemini CLI: ${GEMINI_CLI}`);
});
