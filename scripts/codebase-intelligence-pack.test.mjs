import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packPath = path.join(repositoryRoot, "catalog", "packs", "codebase-intelligence.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const codebaseIntelligenceSkills = [
  "mapping-existing-codebase-structure",
  "tracing-code-execution-paths",
  "analyzing-change-blast-radius",
  "investigating-codebase-semantically",
  "planning-codebase-changes-with-evidence",
];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("publishes Codebase Intelligence as an ordered active RC pack", async () => {
  const pack = await readJson(packPath);

  assert.equal(pack.slug, "codebase-intelligence");
  assert.equal(pack.status, "active");
  assert.equal(pack.version, "1.0.0-rc.1");
  assert.deepEqual(pack.skills, codebaseIntelligenceSkills);
});

test("adds codebase-intelligence as a first-class catalog category", async () => {
  const schema = await readJson(schemaPath);

  assert.ok(schema.properties.category.enum.includes("codebase-intelligence"));
});

test("publishes complete bilingual metadata for every pack skill", async () => {
  for (const slug of codebaseIntelligenceSkills) {
    const metadata = await readJson(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`));

    assert.equal(metadata.category, "codebase-intelligence");
    assert.deepEqual(metadata.packs, ["codebase-intelligence"]);
    assert.equal(metadata.maturity, "beta");
    assert.equal(metadata.version, "1.0.0-rc.1");
    for (const locale of ["en", "pt-BR"]) {
      const localized = metadata.locales[locale];
      assert.ok(localized.displayName);
      assert.ok(localized.summary);
      assert.ok(localized.primaryBenefit);
      assert.ok(localized.whenToUse);
      assert.ok(localized.whenNotToUse);
      assert.ok(localized.useCases.length >= 2);
      assert.ok(localized.examplePrompts.length >= 1);
    }
  }
});

test("installs exactly the five Codebase Intelligence methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-codebase-intelligence-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "codebase-intelligence",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...codebaseIntelligenceSkills].sort());
  for (const slug of codebaseIntelligenceSkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});

