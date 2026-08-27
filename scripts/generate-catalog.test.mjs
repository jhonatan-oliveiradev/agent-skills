import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { checkGeneratedCatalog, generateCatalog, serializeCatalog } from "./generate-catalog.mjs";
import { catalogFixture } from "./test-support/catalog-fixture.mjs";

test("generates stable sorted data independent of file creation order", async () => {
  const first = await catalogFixture({ creationOrder: ["beta", "alpha"] });
  const second = await catalogFixture({ creationOrder: ["alpha", "beta"] });
  const firstGenerated = await generateCatalog(first);
  const secondGenerated = await generateCatalog(second);

  assert.equal(serializeCatalog(firstGenerated), serializeCatalog(secondGenerated));
  assert.deepEqual(firstGenerated.skills.map(({ slug }) => slug), ["alpha", "beta"]);
  assert.deepEqual(firstGenerated.packs.map(({ slug }) => slug), ["starter", "future"]);
});

test("includes filters, counts, resolved packs, and a stable source digest", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.category = "frontend";
      record.maturity = "beta";
      record.difficulty = "advanced";
      record.tags = ["zeta", "alpha"];
      record.compatibility = {
        surfaces: ["codex"],
        operatingSystems: ["windows"],
        installModes: ["filesystem"],
      };
      record.dependencies = [
        { name: "zeta-lib", type: "library", required: true, url: "https://www.npmjs.com/package/zeta-lib" },
        { name: "alpha-tool", type: "tool", required: false },
      ];
    },
  });
  const generated = await generateCatalog(root);

  assert.equal(generated.skills.length, 2);
  assert.deepEqual(generated.packs[0].skillSlugs, ["alpha"]);
  assert.deepEqual(generated.packs[0].skills[0], {
    slug: "alpha",
    displayName: { en: "alpha English", "pt-BR": "alpha Português" },
    summary: { en: "alpha English summary", "pt-BR": "alpha Português summary" },
    difficulty: "advanced",
    maturity: "beta",
  });
  assert.deepEqual(generated.filters, {
    categories: ["frontend", "meta"],
    packs: ["future", "starter"],
    tags: ["alpha", "beta", "zeta"],
    maturity: ["beta", "stable"],
    difficulty: ["advanced", "beginner"],
    surfaces: ["chatgpt", "codex"],
    operatingSystems: ["linux", "macos", "windows"],
    installModes: ["filesystem", "plugin"],
    dependencies: ["alpha-tool", "zeta-lib"],
  });
  assert.deepEqual(generated.counts, {
    skills: 2,
    packs: { total: 2, active: 1, planned: 1 },
    categories: { frontend: 1, meta: 1 },
    maturity: { beta: 1, stable: 1 },
    difficulty: { advanced: 1, beginner: 1 },
    activePackMembership: { starter: 1 },
  });
  assert.match(generated.sourceDigest, /^[a-f0-9]{64}$/);
  assert.equal(serializeCatalog(generated).includes(root), false);
  assert.equal(Object.hasOwn(generated, "generatedAt"), false);
});

test("changes the source digest when canonical source data changes", async () => {
  const unchanged = await catalogFixture();
  const changed = await catalogFixture({
    mutateAlpha(record) {
      record.locales.en.summary = "A changed summary";
    },
  });

  assert.notEqual((await generateCatalog(unchanged)).sourceDigest, (await generateCatalog(changed)).sourceDigest);
});

test("throws one aggregate error when catalog sources are invalid", async () => {
  const root = await catalogFixture({ omitSkillRecord: "beta" });

  await assert.rejects(
    generateCatalog(root),
    (error) => error instanceof AggregateError
      && error.message === "Catalog source validation failed with 1 issue(s)"
      && error.errors[0].message === "skills/beta/SKILL.md: beta: missing catalog metadata",
  );
});

test("serializes with two spaces and one final newline", () => {
  assert.equal(serializeCatalog({ alpha: { beta: true } }), '{\n  "alpha": {\n    "beta": true\n  }\n}\n');
});

test("detects stale generated catalog bytes", async () => {
  const root = await catalogFixture();
  const target = path.join(root, "catalog", "generated", "catalog.json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, "{not-json\n");

  assert.deepEqual(await checkGeneratedCatalog(root), [
    "catalog/generated/catalog.json is stale; run npm run catalog:generate",
  ]);

  await writeFile(target, serializeCatalog(await generateCatalog(root)));
  assert.deepEqual(await checkGeneratedCatalog(root), []);
  assert.equal((await readFile(target, "utf8")).endsWith("\n"), true);
});
