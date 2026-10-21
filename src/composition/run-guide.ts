import type { GuideReport } from "../application/dto/guide-report.js";
import type { Extractor } from "../application/ports/extractor.js";
import { GenerateGuide } from "../application/use-cases/generate-guide.use-case.js";
import { type GuideSettings, generatedBanner } from "../domain/values/guide-settings.js";
import { FileGuideWorkspace } from "../infra/file-guide-workspace.js";
import { MarkdownGuideRenderer } from "../infra/markdown-guide-renderer.js";

/** One run: where the repository is, its settings, its extractors, and write or check. */
export interface RunGuideOptions {
  readonly repoRoot: string;
  readonly settings: GuideSettings;
  readonly extractors: readonly Extractor[];
  readonly mode: "write" | "check";
}

/** Wires the file workspace and the Markdown renderer around `GenerateGuide` and runs it. */
export function runGuide(options: RunGuideOptions): Promise<GuideReport> {
  const { repoRoot, settings, extractors, mode } = options;
  const workspace = new FileGuideWorkspace({
    repoRoot,
    flowsDir: settings.flowsDir,
    guideDir: settings.guideDir,
    banner: generatedBanner(settings),
  });
  return new GenerateGuide(extractors, workspace, new MarkdownGuideRenderer(), settings).execute({
    mode,
  });
}
