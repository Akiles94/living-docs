import type { Extractor } from "../application/ports/extractor.js";
import type { GuideSettings } from "../domain/values/guide-settings.js";
import { TypeScriptExportsExtractor } from "../infra/typescript-exports-extractor.js";

/** What `living-docs.config.{js,mjs,ts}` default-exports; every field is optional. */
export interface LivingDocsConfig {
  readonly settings?: Partial<GuideSettings>;
  /** The repository's extractors, in order. Defaults to TSDoc coverage over `src/`. */
  readonly extractors?: (repoRoot: string) => readonly Extractor[];
}

/** Identity helper that types a config file. */
export function defineConfig(config: LivingDocsConfig): LivingDocsConfig {
  return config;
}

/** Settings used for every field a config leaves out. */
export const DEFAULT_SETTINGS: GuideSettings = {
  title: "Developer guide",
  flowsDir: "docs/flows",
  guideDir: "docs/guide",
  themeOrder: [],
  referenceKinds: [],
};

/** TSDoc coverage over `src/`: the extractor a repository gets when it configures none. */
export function defaultExtractors(repoRoot: string): Extractor[] {
  return [new TypeScriptExportsExtractor({ repoRoot, roots: ["src"], docRequired: () => true })];
}

/** Fills a (possibly missing) config with the defaults. */
export function resolveConfig(
  config: LivingDocsConfig | undefined,
  repoRoot: string,
): { settings: GuideSettings; extractors: readonly Extractor[] } {
  return {
    settings: { ...DEFAULT_SETTINGS, ...config?.settings },
    extractors: (config?.extractors ?? defaultExtractors)(repoRoot),
  };
}
