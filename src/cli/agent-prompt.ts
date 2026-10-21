/** What `living-docs prompt init` prints: instructions for an AI agent adopting living-docs. */
export const INIT_PROMPT = `# Adopt living-docs in this repository

living-docs builds a developer guide (docs/guide/) from two inputs: the TypeScript code (exported
symbols and their TSDoc, plus anything a repository extractor reports) and hand-written business
flows (docs/flows/*.md). \`living-docs check\` fails whenever the guide, the flows and the code
disagree, so the guide cannot silently rot. No network, no LLM at check time.

Work through these steps in order. Do not invent behavior: every claim in a flow must be traceable
to code you read.

## 1. Read the repository
README, package.json scripts, the entry points (CLI commands, HTTP routes, handlers, UI screens,
public API) and the module layout. Note the language of existing docs; flows are written in English.

## 2. Choose the flows
- 10–20 flows, each a user-visible capability ("Create an invoice", "Sync two devices"), not a
  module tour. Distinct mechanisms beat near-duplicates.
- Every entry point should be reached by at least one flow.
- Group them into 3–6 themes; the theme order goes into the config (step 6).

## 3. Write docs/flows/_overview.md
A short product summary (who it is for, what it does, what it never does), optionally one Mermaid
flowchart. It opens the guide.

## 4. Write one docs/flows/<slug>.md per flow
\`\`\`markdown
---
title: Create an invoice
theme: Billing
---

## Who
Plain language: who does this.

## Why
Plain language: what it is for. The first sentence is shown on the guide index.

## Business rules
- What always holds, in business terms.

## What can go wrong
- What the user can run into, and what happens then.

## Entry points
- HTTP: {{createInvoiceRoute}}

## Steps
1. [User → API] Posts the invoice — {{createInvoiceRoute}}
2. [API → CreateInvoice] Validates and stores it — {{CreateInvoice}}

## Errors
- What fails, and what the caller sees.
\`\`\`
- All seven sections are required, in this order.
- Steps read \`N. [From → To] text\`, numbered from 1. The sequence diagram is drawn from them, so
  From/To are its participants: keep their names short and consistent across flows.
- References are \`{{Name}}\` for an exported symbol, \`{{folder/Name}}\` when that name is exported
  from several files, and \`{{kind:name}}\` for catalogue items a repository extractor provides
  (step 5). A reference that does not resolve fails the check.

## 5. Decide whether the repository needs its own extractor
The built-in extractor covers exported symbols and their TSDoc. Write a repository extractor only
when the repository has an entry surface every flow should be held to: CLI commands, HTTP routes,
queue consumers, IPC channels, error codes. An extractor returns data only:

\`\`\`ts
import { createCatalogue, createExtractedFacts, type Extractor } from "living-docs";

export const routesExtractor = (routes: { method: string; path: string; file: string }[]): Extractor => ({
  name: "http-routes",
  async extract() {
    const names = routes.map((r) => \`\${r.method} \${r.path}\`);
    return createExtractedFacts({
      catalogues: [createCatalogue({
        id: "http-routes", page: "reference/http.md", title: "HTTP routes",
        columns: ["Route", "Defined in"],
        rows: routes.map((r, i) => ({
          key: { kind: "http", name: names[i]!, label: names[i]! },
          cells: [{ text: names[i]! }, { text: r.file, href: r.file }],
        })),
      })],
      requirements: [{ kind: "http", names, reason: "every route is part of a documented flow" }],
    });
  },
});
\`\`\`
Add its kind ("http") to \`settings.referenceKinds\`; flows then cite \`{{http:POST /invoices}}\`.
Prefer reading the surface statically (scan the sources) or through a side-effect-free factory;
never start servers, open databases or touch the network to introspect.

## 6. Configure and wire it
- \`living-docs.config.ts\` (Node ≥ 22.18) or \`.mjs\` at the repository root:
  \`\`\`ts
  import { defineConfig, TypeScriptExportsExtractor } from "living-docs";
  export default defineConfig({
    settings: {
      title: "<Project> developer guide",
      themeOrder: ["Billing", "Accounts"],
      referenceKinds: [],
      regenerateCommand: "npm run docs",
    },
    extractors: (repoRoot) => [
      new TypeScriptExportsExtractor({ repoRoot, roots: ["src"], docRequired: () => true }),
    ],
  });
  \`\`\`
  Omitting \`extractors\` means TSDoc coverage over \`src/\`.
- If an extractor must import the repository's own TypeScript (with \`.js\` import specifiers, path
  aliases…), skip the config file: bundle a small entry with the repo's bundler that calls
  \`runGuide({ repoRoot, settings, extractors, mode })\` from "living-docs" and prints
  \`formatGuideReport(report)\`.
- package.json scripts: \`"docs": "living-docs write"\`, \`"docs:check": "living-docs check"\`.
- CI: run \`npm run docs:check\` next to lint and tests.

## 7. Make it pass
- Every exported symbol needs TSDoc whose summary says more than its name. A class doc covers its
  methods. Re-exports are exempt.
- Run \`npx living-docs write\`, fix every finding (\`✗ [rule] file:line message\`), repeat until it
  prints \`✓ Guide written\`. Then \`npx living-docs check\` must pass.
- Commit docs/flows/, docs/guide/, the config and the scripts together. Never hand-edit
  docs/guide/: it is regenerated.
`;
