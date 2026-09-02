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
const packPath = path.join(repositoryRoot, "catalog", "packs", "writing-communication.json");
const schemaPath = path.join(repositoryRoot, "catalog", "schemas", "skill.schema.json");

const writingCommunicationSkills = [
  "planning-written-communication",
  "writing-conversion-copy",
  "writing-product-and-ux-copy",
  "editing-for-clarity-and-tone",
  "humanizing-generated-prose",
];

test("publishes writing-communication as an active five-method pack", async () => {
  const pack = JSON.parse(await readFile(packPath, "utf8"));

  assert.equal(pack.status, "active");
  assert.deepEqual(pack.skills, writingCommunicationSkills);
});

test("adds writing-communication as a first-class catalog category", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));

  assert.ok(schema.properties.category.enum.includes("writing-communication"));
});

test("publishes concise writing-communication skills with discovery-first triggers", async () => {
  for (const slug of writingCommunicationSkills) {
    const source = await readFile(path.join(repositoryRoot, "skills", slug, "SKILL.md"), "utf8");

    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.ok(source.length < 6500, `${slug} should stay concise enough to load on demand`);
  }
});

test("publishes bilingual metadata with bidirectional writing-communication pack membership", async () => {
  for (const slug of writingCommunicationSkills) {
    const metadata = JSON.parse(
      await readFile(path.join(repositoryRoot, "catalog", "skills", `${slug}.json`), "utf8"),
    );

    assert.equal(metadata.category, "writing-communication");
    assert.ok(metadata.packs.includes("writing-communication"));
    assert.equal(metadata.maturity, "beta");
    assert.ok(metadata.locales.en.displayName);
    assert.ok(metadata.locales["pt-BR"].displayName);
    assert.ok(metadata.locales.en.examplePrompts.length > 0);
    assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
  }
});

test("installs only the five Writing & Communication methods through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-writing-communication-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "writing-communication",
  ]);

  assert.deepEqual((await readdir(destination)).sort(), [...writingCommunicationSkills].sort());
  for (const slug of writingCommunicationSkills) {
    assert.match(
      await readFile(path.join(destination, slug, "SKILL.md"), "utf8"),
      new RegExp(`name: ${slug}`),
    );
  }
});
