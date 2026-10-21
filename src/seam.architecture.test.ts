import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { scanTypeScript } from "./infra/typescript-scanner.js";

const srcDir = import.meta.dirname;

function tsFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "dist" ? [] : tsFiles(path);
    return entry.name.endsWith(".ts") ? [path] : [];
  });
}

const posix = (path: string) => relative(srcDir, path).split(sep).join("/");

describe("living-docs package boundary", () => {
  it("src imports only itself and node: built-ins (tests may also import vitest)", () => {
    const violations = tsFiles(srcDir).flatMap((file) => {
      const scanned = scanTypeScript(readFileSync(file, "utf8"), { jsx: false });
      if (!scanned.ok) return [`${posix(file)}: unscannable (${scanned.error.reason})`];
      return scanned.value.imports.flatMap((specifier) => {
        if (specifier.startsWith("node:")) return [];
        if (specifier === "vitest" && file.endsWith(".test.ts")) return [];
        if (specifier.startsWith(".")) {
          const target = resolve(dirname(file), specifier);
          if (target.startsWith(srcDir + sep) && existsSync(target.replace(/\.js$/, ".ts"))) {
            return [];
          }
        }
        return [`${posix(file)} imports "${specifier}"`];
      });
    });
    expect(violations).toEqual([]);
  });

  it("the generator never touches the network", () => {
    const offenders = tsFiles(srcDir)
      .filter((file) => !file.endsWith("seam.architecture.test.ts"))
      .filter((file) => /\bfetch\(|node:https?\b|node:net\b/.test(readFileSync(file, "utf8")))
      .map(posix);
    expect(offenders).toEqual([]);
  });
});
