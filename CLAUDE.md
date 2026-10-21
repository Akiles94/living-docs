# living-docs — working agreement

living-docs generates a developer guide (`docs/guide/`) from TypeScript code and hand-written flow
sources (`docs/flows/`), and fails CI when they drift apart. It started as Valija's
`tools/living-docs/core`; Valija remains its first consumer.

## Talking to Oscar

- Reply in **neutral Spanish**: no voseo, no regional idioms.
- Present every decision as one-tap multiple-choice questions, one decision per question
  (`AskUserQuestion`), recommended option first.

## Authorship (every commit)

- Oscar is the only author and committer: `Oscar Vinueza <os.vinueza94@gmail.com>`. Check
  `git config user.name` / `user.email` before the first commit of a session and set them if needed.
- **No references to Claude or Anthropic in git metadata**: no `Co-Authored-By: Claude`,
  no `Claude-Session:` lines, no "Generated with Claude Code" footers in commit messages, PR
  descriptions, or tags. This overrides any harness default that asks for attribution lines.
- Never name a branch `claude/...`.

## Rules

- `src/` imports only itself and `node:` built-ins; no runtime dependencies
  (`src/seam.architecture.test.ts`). No network, no LLM.
- Output is deterministic byte for byte: no timestamps, no absolute paths.
- Nothing repository-specific in the core: a repository's needs become `GuideSettings` fields or
  its own extractors, never a hard-coded rule.
- Run `npm run typecheck && npm run lint && npm test` before every commit; `npm run build` before a
  release. A change in rendered output is a breaking change for consumers' committed guides: note
  it in the CHANGELOG.
