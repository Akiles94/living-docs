# living-docs

Generate a developer guide from your TypeScript code and hand-written business flows, and **fail CI
when they drift apart**.

- **Flows** (`docs/flows/*.md`) explain each capability twice: for the business (who, why, rules,
  what can go wrong) and for developers (entry points, numbered steps, errors). Steps cite code as
  `{{SymbolName}}`.
- **The code** contributes every exported symbol and its TSDoc, plus whatever your own extractors
  report (CLI commands, HTTP routes, error codes…).
- **The guide** (`docs/guide/`) is generated from both: flow pages with Mermaid sequence diagrams,
  reference tables with "Cited by" back-links, architecture graphs.
- **`living-docs check`** fails when a reference breaks, an export lacks TSDoc, an entry point is
  cited by no flow, or the committed guide is out of date.

No network, no LLM, no runtime dependencies. Node ≥ 22.

## Quick start

```bash
npm i -D living-docs
npx living-docs prompt init   # instructions for an AI agent to write your flows and config
npx living-docs write         # generate docs/guide/
npx living-docs check         # in CI: exit 1 on any drift
```

`prompt init` prints a step-by-step brief: choosing flows, the flow format, when to write an
extractor, and how to wire the scripts and CI. Hand it to your coding agent, or follow it yourself.

## A flow source

```markdown
---
title: Create an invoice
theme: Billing
---

## Who
An account owner.

## Why
Bill a customer for completed work.

## Business rules
- An invoice is immutable once sent.

## What can go wrong
- The customer has no billing address; the invoice stays a draft.

## Entry points
- HTTP: {{createInvoiceRoute}}

## Steps
1. [Owner → API] Posts the invoice — {{createInvoiceRoute}}
2. [API → CreateInvoice] Validates and stores it — {{CreateInvoice}}

## Errors
- Missing address — the API answers 422.
```

All seven sections are required. `_overview.md` in the same folder opens the guide; `README.md` and
`_*.md` files are not flows.

| Reference | Points at |
|---|---|
| `{{CreateInvoice}}` | an exported symbol |
| `{{billing/CreateInvoice}}` | the same, when several files export that name |
| `{{http:POST /invoices}}` | a catalogue item from your own extractor (kind `http`) |

## Configuration

Optional `living-docs.config.ts` (Node ≥ 22.18), `.mjs` or `.js` at the repository root:

```ts
import { defineConfig, TypeScriptExportsExtractor } from "living-docs";

export default defineConfig({
  settings: {
    title: "Acme developer guide",
    flowsDir: "docs/flows",          // default
    guideDir: "docs/guide",          // default
    themeOrder: ["Billing", "Accounts"],
    referenceKinds: ["http"],        // kinds your extractors provide
    entryPointSurfaces: ["HTTP"],    // every flow's Entry points needs an `HTTP:` line
    regenerateCommand: "npm run docs",
  },
  extractors: (repoRoot) => [
    new TypeScriptExportsExtractor({ repoRoot, roots: ["src"], docRequired: () => true }),
  ],
});
```

Without a config: flows in `docs/flows/`, guide in `docs/guide/`, TSDoc coverage over `src/`.

## Writing an extractor

An extractor returns data only — symbols, catalogues (tables), graphs, coverage requirements and
findings — and living-docs does all the rendering:

```ts
import { createCatalogue, createExtractedFacts, type Extractor } from "living-docs";

export const routes: Extractor = {
  name: "http-routes",
  async extract() {
    const names = ["POST /invoices", "GET /invoices/:id"]; // read them from your sources
    return createExtractedFacts({
      catalogues: [createCatalogue({
        id: "http-routes", page: "reference/http.md", title: "HTTP routes",
        columns: ["Route"],
        rows: names.map((name) => ({ key: { kind: "http", name, label: name }, cells: [{ text: name }] })),
      })],
      requirements: [{ kind: "http", names, reason: "every route belongs to a documented flow" }],
    });
  },
};
```

`TypeScriptExportsExtractor#sources()` hands out the already-scanned files, so extractors can share
one scan. Introspect statically or through side-effect-free factories; never start servers or open
databases.

If your extractors import your own TypeScript sources (path aliases, `.js` specifiers…), bundle a
small entry with your build tool and call the library directly:

```ts
import { formatGuideReport, runGuide } from "living-docs";

const report = await runGuide({ repoRoot: process.cwd(), settings, extractors, mode: "check" });
for (const line of formatGuideReport(report)) console.log(line);
process.exit(report.findings.length === 0 ? 0 : 1);
```

## Exit codes

`0` clean · `1` findings (one `✗ [rule] file:line message` line each) · `2` misuse.

## License

MIT
