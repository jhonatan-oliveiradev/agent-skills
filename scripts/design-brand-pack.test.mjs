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
const packPath = path.join(repositoryRoot, "catalog", "packs", "design-brand.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const designBrandSkills = [
  "defining-brand-strategy",
  "naming-brands-and-products",
  "designing-visual-identities",
  "building-brand-guidelines",
  "writing-brand-voice-and-messaging",
];

test("publishes design-brand as an active five-method pack", async () => {
  const pack = JSON.parse(await readFile(packPath, "utf8"));

  assert.equal(pack.status, "active");
  assert.deepEqual(pack.skills, designBrandSkills);
});

test("adds brand-design as a first-class catalog category", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));

  assert.ok(schema.properties.category.enum.includes("brand-design"));
});

test("publishes concise brand-design skills with discovery-first triggers", async () => {
  for (const slug of designBrandSkills) {
    const source = await readFile(path.join(repositoryRoot, "skills", slug, "SKILL.md"), "utf8");

    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.ok(source.length < 6500, `${slug} should stay concise enough to load on demand`);
  }
});

test("publishes bilingual metadata with bidirectional design-brand pack membership", async () => {
  for (const slug of designBrandSkills) {
    const metadata = JSON.parse(
      await readFile(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`), "utf8"),
    );

    assert.equal(metadata.category, "brand-design");
    assert.ok(metadata.packs.includes("design-brand"));
    assert.equal(metadata.maturity, "beta");
    assert.ok(metadata.locales.en.displayName);
    assert.ok(metadata.locales["pt-BR"].displayName);
    assert.ok(metadata.locales.en.examplePrompts.length > 0);
    assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
  }
});

test("installs only the five Design & Brand methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-design-brand-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "design-brand",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...designBrandSkills].sort());
  for (const slug of designBrandSkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});
