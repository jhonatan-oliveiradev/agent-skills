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
const packPath = path.join(repositoryRoot, "catalog", "packs", "backend-data.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const backendSkills = [
  "designing-relational-data-models",
  "building-reliable-node-api-boundaries",
  "evolving-postgres-schemas-safely",
  "profiling-postgres-query-performance",
];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("promotes backend-data to an active four-method pack", async () => {
  const pack = await readJson(packPath);

  assert.equal(pack.status, "active");
  assert.deepEqual(pack.skills, backendSkills);
});

test("adds backend-data as a first-class catalog category", async () => {
  const schema = await readJson(schemaPath);

  assert.ok(schema.properties.category.enum.includes("backend-data"));
});

test("publishes concise canonical skills with discovery-first triggers", async () => {
  for (const slug of backendSkills) {
    const skillPath = path.join(repositoryRoot, "skills", slug, "SKILL.md");
    const source = await readFile(skillPath, "utf8");

    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
  }
});

test("publishes bilingual metadata with bidirectional backend pack membership", async () => {
  for (const slug of backendSkills) {
    const metadata = await readJson(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`));

    assert.equal(metadata.category, "backend-data");
    assert.ok(metadata.packs.includes("backend-data"));
    assert.equal(metadata.maturity, "beta");
    assert.ok(metadata.locales.en.displayName);
    assert.ok(metadata.locales["pt-BR"].displayName);
    assert.ok(metadata.locales.en.examplePrompts.length > 0);
    assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
  }
});

test("installs only the four Backend & Data methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-backend-data-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "backend-data",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...backendSkills].sort());
  for (const slug of backendSkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});
