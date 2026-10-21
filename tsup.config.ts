import { defineConfig } from "tsup";

/** Library entry and the `living-docs` CLI; declarations come from `tsc -p tsconfig.build.json`. */
export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli/main.ts" },
  format: ["esm"],
  target: "node22",
  platform: "node",
  clean: true,
});
