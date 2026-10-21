import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { LivingDocsConfig } from "../composition/config.js";

/** Config file names, in lookup order. */
export const CONFIG_FILES = [
  "living-docs.config.ts",
  "living-docs.config.mjs",
  "living-docs.config.js",
] as const;

/** Imports the first config file found in `repoRoot`, or returns undefined when there is none. */
export async function loadConfig(repoRoot: string): Promise<LivingDocsConfig | undefined> {
  const file = CONFIG_FILES.map((name) => join(repoRoot, name)).find((path) => existsSync(path));
  if (file === undefined) return undefined;
  const loaded = (await import(pathToFileURL(file).href)) as { default?: LivingDocsConfig };
  if (loaded.default === undefined) throw new Error(`${file} has no default export`);
  return loaded.default;
}
