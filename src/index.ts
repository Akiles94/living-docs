/**
 * Public API of living-docs: everything a repository's extractors and composition need. The CLI
 * (`living-docs write | check | prompt init`) is built on the same exports.
 */

export {
  createGuideReport,
  formatGuideReport,
  type GuideReport,
} from "./application/dto/guide-report.js";
export {
  createExtractedFacts,
  type ExtractedFacts,
  type Extractor,
} from "./application/ports/extractor.js";
export type { GuideRenderer } from "./application/ports/guide-renderer.js";
export type { FlowSource, GuideWorkspace } from "./application/ports/guide-workspace.js";
export { GenerateGuide } from "./application/use-cases/generate-guide.use-case.js";
export {
  DEFAULT_SETTINGS,
  defaultExtractors,
  defineConfig,
  type LivingDocsConfig,
  resolveConfig,
} from "./composition/config.js";
export { type RunGuideOptions, runGuide } from "./composition/run-guide.js";
export { FLOW_SECTIONS } from "./domain/entities/flow.js";
export { byCodeUnit, err, ok, type Result } from "./domain/result.js";
export { SYMBOL_ROW_KIND } from "./domain/services/guide-assembly.js";
export type { CoverageRequirement } from "./domain/services/guide-rules.js";
export {
  type Catalogue,
  type CatalogueRow,
  type Cell,
  createCatalogue,
  type ItemKey,
  itemAnchor,
  type Link,
} from "./domain/values/catalogue.js";
export type { DeclarationKind, DocumentedSymbol } from "./domain/values/documented-symbol.js";
export { createFinding, type Finding, type FindingRule } from "./domain/values/finding.js";
export { createGraph, type Graph, type GraphEdge, type GraphNode } from "./domain/values/graph.js";
export type { GuidePage } from "./domain/values/guide-page.js";
export {
  type GuideSettings,
  generatedBanner,
  regenerateCommandOf,
} from "./domain/values/guide-settings.js";
export {
  FileGuideWorkspace,
  type FileGuideWorkspaceOptions,
} from "./infra/file-guide-workspace.js";
export { MarkdownGuideRenderer } from "./infra/markdown-guide-renderer.js";
export {
  type SourceFile,
  TypeScriptExportsExtractor,
  type TypeScriptExportsOptions,
} from "./infra/typescript-exports-extractor.js";
export {
  type ScanFailure,
  type ScannedDeclaration,
  type ScannedFile,
  scanTypeScript,
} from "./infra/typescript-scanner.js";
