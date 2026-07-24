import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type ScanFinding = {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
};

export async function runSecurityScan(content: string): Promise<ScanFinding[]> {
  try {
    const { stdout } = await execFileAsync(
      "python3",
      ["-c", `
import sys, json
sys.path.insert(0, "${process.env.GOVERNANCE_PLUGIN_PATH || "~/.claude/plugins/local/governance-plugin"}")
from governance.lib.llm_threat_detector import LLMThreatDetector
detector = LLMThreatDetector()
results = detector.scan_content(sys.stdin.read())
print(json.dumps(results))
`],
      { maxBuffer: 10 * 1024 * 1024, timeout: 30_000 }
    );
    return JSON.parse(stdout);
  } catch {
    return [];
  }
}

export async function runDuplicationScan(
  content: string,
  existingSummaries: string[]
): Promise<{ overlap: string; references: string[] }[]> {
  const { claudeGenerate } = await import("./claude");
  const context = existingSummaries.length > 0
    ? `Existing PRDs in the system:\n${existingSummaries.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    : "No existing PRDs in the system.";

  const prompt = `Analyze this PRD for functional duplication with existing PRDs. Return a JSON array of overlaps. Each overlap should have "overlap" (description) and "references" (list of existing PRD titles that overlap). If no overlaps, return [].

${context}

---

PRD to analyze:
${content}

Return ONLY the JSON array, no other text.`;

  const result = await claudeGenerate(prompt);
  try {
    return Array.isArray(JSON.parse(result)) ? JSON.parse(result) : [];
  } catch {
    return [];
  }
}

export async function generateSummary(content: string): Promise<string> {
  const { claudeGenerate } = await import("./claude");
  return claudeGenerate(
    `Write a concise executive summary (3-5 sentences) of this PRD. Cover what it proposes, key requirements, and scope.\n\n${content}`
  );
}
