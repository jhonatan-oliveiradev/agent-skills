// @vitest-environment node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

describe("web package contract", () => {
  it("pins the application runtime and exposes every required gate", () => {
    const pkg = JSON.parse(readFileSync(resolve(webRoot, "package.json"), "utf8"));

    expect(pkg.private).toBe(true);
    expect(pkg.engines.node).toBe(">=20");
    expect(Object.keys(pkg.scripts)).toEqual(
      expect.arrayContaining(["dev", "build", "start", "lint", "typecheck", "test"]),
    );
    expect(pkg.dependencies.next).toBe("16.3.1");
    expect(pkg.dependencies.react).toBe("19.2.8");
    expect(pkg.dependencies["react-dom"]).toBe("19.2.8");
  });
});
