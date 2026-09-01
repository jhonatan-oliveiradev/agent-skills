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
const packPath = path.join(repositoryRoot, "catalog", "packs", "architecture-engineering.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const architectureSkills = [
  "choosing-application-architecture",
  "designing-software-boundaries",
  "documenting-architecture-decisions",
  "planning-safe-refactors",
];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("promotes architecture-engineering to an active four-method pack", async () => {
  const pack = await readJson(packPath);

  assert.equal(pack.status, "active");
  assert.equal(pack.color, "cyan");
  assert.deepEqual(pack.skills, architectureSkills);
});

test("adds architecture-engineering as a first-class catalog category", async () => {
  const schema = await readJson(schemaPath);

  assert.ok(schema.properties.category.enum.includes("architecture-engineering"));
});

test("publishes concise architecture skills with discovery-first triggers", async () => {
  for (const slug of architectureSkills) {
    const source = await readFile(path.join(repositoryRoot, "skills", slug, "SKILL.md"), "utf8");

    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.ok(source.length < 6500, `${slug} should stay concise enough to load on demand`);
  }
});

test("publishes bilingual metadata with bidirectional architecture pack membership", async () => {
  for (const slug of architectureSkills) {
    const metadata = await readJson(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`));

    assert.equal(metadata.category, "architecture-engineering");
    assert.ok(metadata.packs.includes("architecture-engineering"));
    assert.equal(metadata.maturity, "beta");
    assert.ok(metadata.locales.en.displayName);
    assert.ok(metadata.locales["pt-BR"].displayName);
    assert.ok(metadata.locales.en.examplePrompts.length > 0);
    assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
  }
});

test("installs only the four Architecture & Engineering methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-architecture-engineering-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "architecture-engineering",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...architectureSkills].sort());
  for (const slug of architectureSkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});
