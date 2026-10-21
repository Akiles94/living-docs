#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { formatGuideReport } from "../application/dto/guide-report.js";
import { resolveConfig } from "../composition/config.js";
import { runGuide } from "../composition/run-guide.js";
import { INIT_PROMPT } from "./agent-prompt.js";
import { loadConfig } from "./load-config.js";

const USAGE = `usage: living-docs <command>

  write        regenerate the guide from the code and the flow sources
  check        report every way the guide, the code and the flows disagree (exit 1)
  prompt init  print instructions for an AI agent adopting living-docs here

Run from the repository root. Reads living-docs.config.{ts,mjs,js} when present.`;

/** `living-docs write | check | prompt init`: exit 0 clean, 1 findings, 2 misuse. */
async function main(args: readonly string[]): Promise<number> {
  const [command, sub] = args;
  if (command === "prompt" && sub === "init") {
    process.stdout.write(INIT_PROMPT);
    return 0;
  }
  if (command !== "write" && command !== "check") {
    console.error(USAGE);
    return command === "--help" || command === "-h" ? 0 : 2;
  }
  const repoRoot = process.cwd();
  const { settings, extractors } = resolveConfig(await loadConfig(repoRoot), repoRoot);
  if (!existsSync(join(repoRoot, settings.flowsDir))) {
    console.error(
      `living-docs: no ${settings.flowsDir}/ here; run from the repository root, or start with \`living-docs prompt init\``,
    );
    return 2;
  }
  const report = await runGuide({ repoRoot, settings, extractors, mode: command });
  for (const line of formatGuideReport(report)) console.log(line);
  return report.findings.length === 0 ? 0 : 1;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error: unknown) => {
    console.error(`living-docs: ${(error as Error).message}`);
    process.exit(2);
  },
);
