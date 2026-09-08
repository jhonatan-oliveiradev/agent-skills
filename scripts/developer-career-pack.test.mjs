import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packPath = path.join(repositoryRoot, "catalog", "packs", "developer-career.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const developerCareerSkills = [
  "assessing-developer-proficiency",
  "building-developer-career-roadmaps",
  "teaching-developer-concepts",
  "evaluating-developer-proficiency",
  "designing-developer-portfolio-evidence",
  "analyzing-developer-career-opportunities",
];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("publishes Developer Career as an ordered active 1.1.0 pack", async () => {
  const pack = await readJson(packPath);

  assert.equal(pack.slug, "developer-career");
  assert.equal(pack.status, "active");
  assert.equal(pack.version, "1.1.0");
  assert.deepEqual(pack.skills, developerCareerSkills);
});

test("adds developer-career as a first-class catalog category", async () => {
  const schema = await readJson(schemaPath);
  assert.ok(schema.properties.category.enum.includes("developer-career"));
});

test("publishes concise discovery-first canonical Developer Career skills", async () => {
  for (const slug of developerCareerSkills) {
    const source = await readFile(path.join(repositoryRoot, "skills", slug, "SKILL.md"), "utf8");
    assert.match(source, new RegExp(`^---\\nname: ${slug}\\ndescription: Use when `));
    const description = source.match(/^description: (.+)$/m)?.[1] ?? "";
    assert.ok(description.length <= 240, `${slug}: discovery description should remain concise`);
    assert.match(source, /## (?:Boundary|Boundaries|Avoid|Do not|Ownership boundaries)/i);
  }
});

test("publishes complete bilingual metadata for every Developer Career skill", async () => {
  for (const slug of developerCareerSkills) {
    const metadata = await readJson(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`));

    assert.equal(metadata.category, "developer-career");
    assert.deepEqual(metadata.packs, ["developer-career"]);
    assert.equal(metadata.maturity, "beta");
    assert.equal(metadata.version, "1.1.0");
    assert.ok(["beginner", "intermediate"].includes(metadata.difficulty));

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

test("installs exactly the six Developer Career methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-developer-career-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "developer-career",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...developerCareerSkills].sort());
});

test("each Developer Career method installs independently through the real CLI", async () => {
  for (const slug of developerCareerSkills) {
    const destination = await mkdtemp(path.join(tmpdir(), `agent-skills-${slug}-`));
    await execFileAsync(process.execPath, [
      path.join(repositoryRoot, "scripts", "install-skills.mjs"),
      "--destination",
      destination,
      "--skill",
      slug,
    ]);

    assert.deepEqual(await readdir(destination), [slug]);
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});

test("syncs the current 60-skill and 12-pack catalog into the web projection", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "agent-skills-catalog-sync-"));
  const fixtureWebRoot = path.join(fixtureRoot, "web");
  const generatedDirectory = path.join(fixtureRoot, "catalog", "generated");
  await mkdir(generatedDirectory, { recursive: true });
  await mkdir(fixtureWebRoot, { recursive: true });

  const catalog = {
    version: "1.1.0",
    locales: ["en", "pt-BR"],
    skills: Array.from({ length: 60 }, (_, index) => ({ slug: `skill-${index}` })),
    packs: Array.from({ length: 12 }, (_, index) => ({ slug: `pack-${index}` })),
  };
  await writeFile(path.join(fixtureRoot, "VERSION"), "1.1.0\n");
  await writeFile(path.join(generatedDirectory, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

  const syncModuleUrl = `${pathToFileURL(path.join(repositoryRoot, "apps", "web", "scripts", "sync-catalog.mjs")).href}?test=${Date.now()}`;
  const { syncCatalog } = await import(syncModuleUrl);
  const result = syncCatalog({ repoRoot: fixtureRoot, webRoot: fixtureWebRoot, runValidation: false });

  assert.equal(result.bytes, Buffer.byteLength(`${JSON.stringify(catalog, null, 2)}\n`));
  assert.deepEqual(
    await readJson(path.join(fixtureWebRoot, "src", "generated", "catalog.json")),
    catalog,
  );
});
