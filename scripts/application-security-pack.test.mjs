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
const packPath = path.join(repositoryRoot, "catalog", "packs", "application-security.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const applicationSecuritySkills = [
  "threat-modeling-applications",
  "reviewing-web-security",
  "reviewing-api-security",
  "auditing-dependency-risk",
];

test("publishes application-security as an active four-method pack", async () => {
  const pack = JSON.parse(await readFile(packPath, "utf8"));

  assert.equal(pack.status, "active");
  assert.equal(pack.color, "amber");
  assert.deepEqual(pack.skills, applicationSecuritySkills);
});

test("adds application-security as a first-class catalog category", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));

  assert.ok(schema.properties.category.enum.includes("application-security"));
});

test("publishes concise application-security skills with discovery-first triggers", async () => {
  for (const slug of applicationSecuritySkills) {
    const source = await readFile(path.join(repositoryRoot, "skills", slug, "SKILL.md"), "utf8");

    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.ok(source.length < 6500, `${slug} should stay concise enough to load on demand`);
  }
});

test("publishes bilingual metadata with bidirectional application-security pack membership", async () => {
  for (const slug of applicationSecuritySkills) {
    const metadata = JSON.parse(
      await readFile(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`), "utf8"),
    );

    assert.equal(metadata.category, "application-security");
    assert.ok(metadata.packs.includes("application-security"));
    assert.equal(metadata.maturity, "beta");
    assert.ok(metadata.locales.en.displayName);
    assert.ok(metadata.locales["pt-BR"].displayName);
    assert.ok(metadata.locales.en.examplePrompts.length > 0);
    assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
  }
});

test("installs only the four Application Security methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-application-security-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "application-security",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...applicationSecuritySkills].sort());
  for (const slug of applicationSecuritySkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});
