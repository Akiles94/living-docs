# Changelog

All notable changes to living-docs. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [SemVer](https://semver.org/). A change in rendered output is breaking for
consumers' committed guides and is called out.

## [Unreleased]

### Changed
- `TypeScriptExportsExtractor` also skips `*.spec.ts(x)` and `*.stories.ts(x)` files, so React and
  Storybook projects no longer owe TSDoc on spec and story exports. **Breaking for committed
  guides:** symbols from those files disappear from the generated reference; run `living-docs write`
  after upgrading.

## [0.1.0] — 2026-10-21

### Added
- First release, extracted from Valija's `tools/living-docs/core`: flow parsing and rules, reference
  resolution, TSDoc coverage, the fail-closed TypeScript scanner, the Markdown + Mermaid renderer and
  the file workspace.
- `living-docs write | check | prompt init` CLI with an optional `living-docs.config.{ts,mjs,js}`.
- Library API (`runGuide`, `defineConfig`, the `Extractor` port and value factories).
- Settings `entryPointSurfaces` and `regenerateCommand`; both were hard-coded for Valija before.
