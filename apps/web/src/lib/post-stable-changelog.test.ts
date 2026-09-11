import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getProjectPages } from "./project-pages";

const repositoryRoot = resolve(process.cwd(), "../..");

describe("post-Stable changelog", () => {
  it("publishes Career Lab on the 1.1.0 development line without rewriting Stable history", async () => {
    const [changelog, readme, version] = await Promise.all([
      readFile(resolve(repositoryRoot, "CHANGELOG.md"), "utf8"),
      readFile(resolve(repositoryRoot, "README.md"), "utf8"),
      readFile(resolve(repositoryRoot, "VERSION"), "utf8"),
    ]);

    expect(version.trim()).toBe("1.1.0");
    expect(changelog).toMatch(/^## \[Unreleased\]/m);
    expect(changelog).toContain("Career Lab");
    expect(changelog).toMatch(/browser-local|local-first/i);
    expect(changelog).toMatch(/61 canonical skills/i);
    expect(changelog).toMatch(/12 active packs/i);
    expect(changelog).toContain("ChatGPT-ready skill ZIP");
    expect(changelog).toContain("Method Archive");

    expect(readme).toContain("Career Lab");
    expect(readme).toMatch(/browser-local|local-first/i);
    expect(readme).toMatch(/import[\s\S]*export[\s\S]*reset|import\/export\/reset/i);
    expect(readme).toMatch(/61 reusable skills across 12 active packs/i);
    expect(readme).toMatch(/`dev` is the pre-production integration branch/i);
    expect(readme).toMatch(/`main`.*production/i);

    const en = getProjectPages("en").changelog;
    const pt = getProjectPages("pt-BR").changelog;
    const enUnreleased = en.releases[0];
    const ptUnreleased = pt.releases[0];

    expect(enUnreleased.version).toBe(en.unreleased);
    expect(enUnreleased.date).toBe(en.unreleased);
    expect(ptUnreleased.version).toBe(pt.unreleased);
    expect(ptUnreleased.date).toBe(pt.unreleased);
    expect(enUnreleased.version).not.toBe("1.1.0");
    expect(ptUnreleased.version).not.toBe("1.1.0");

    const enUnreleasedText = JSON.stringify(enUnreleased);
    const ptUnreleasedText = JSON.stringify(ptUnreleased);
    expect(enUnreleasedText).toContain("Career Lab");
    expect(enUnreleasedText).toMatch(/browser-local|local-first/i);
    expect(enUnreleasedText).toMatch(/61 canonical skills/i);
    expect(enUnreleasedText).toMatch(/12 active packs/i);
    expect(enUnreleasedText).toContain("ChatGPT-ready skill ZIP");
    expect(enUnreleasedText).toContain("Method Archive");
    expect(ptUnreleasedText).toContain("Career Lab");
    expect(ptUnreleasedText).toMatch(/local|navegador/i);
    expect(ptUnreleasedText).toMatch(/61 skills canônicas/i);
    expect(ptUnreleasedText).toMatch(/12 pacotes ativos/i);
    expect(ptUnreleasedText).toContain("ZIP");
    expect(ptUnreleasedText).toContain("Method Archive");

    const enStable = en.releases[1];
    const ptStable = pt.releases[1];
    expect(enStable).toMatchObject({ version: "1.0.0", date: "2026-09-02" });
    expect(ptStable).toMatchObject({ version: "1.0.0", date: "2026-09-02" });
    expect(JSON.stringify(enStable)).toMatch(/54 canonical skills[\s\S]*11 active packs/i);
    expect(JSON.stringify(ptStable)).toMatch(/54 skills canônicas[\s\S]*11 pacotes ativos/i);
  });
});
