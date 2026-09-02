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
const slug = "selecting-working-methods";
const skillPath = path.join(repositoryRoot, "skills", slug, "SKILL.md");
const metadataPath = path.join(repositoryRoot, "catalog", "skills", `${slug}.json`);

test("publishes a concise routing method with explicit selection guardrails", async () => {
  const source = await readFile(skillPath, "utf8");

  assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
  assert.match(source, /^description: Use when /m);
  assert.match(source, /primary method/i);
  assert.match(source, /smallest sufficient/i);
  assert.match(source, /no skill/i);
  assert.match(source, /delegate/i);
  assert.ok(source.length < 6500, "selecting-working-methods should stay concise enough to load as a router");
});

test("routes neighboring methods by artifact, stage, and verification ownership", async () => {
  const source = await readFile(skillPath, "utf8");

  assert.match(source, /artifact owner/i);
  assert.match(source, /stage owner/i);
  assert.match(source, /verification owner/i);
  assert.match(source, /do not use a supporting method to redo the primary method/i);
  assert.ok(source.length < 6500, "ownership guidance must not turn the router into a decision table");
});

test("publishes selecting-working-methods as bilingual catalog-wide meta guidance", async () => {
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));

  assert.equal(metadata.slug, slug);
  assert.equal(metadata.category, "meta");
  assert.deepEqual(metadata.packs, []);
  assert.equal(metadata.maturity, "beta");
  assert.ok(metadata.relatedSkills.includes("turning-techniques-into-skills"));
  assert.ok(metadata.locales.en.displayName);
  assert.ok(metadata.locales["pt-BR"].displayName);
  assert.ok(metadata.locales.en.examplePrompts.length > 0);
  assert.ok(metadata.locales["pt-BR"].examplePrompts.length > 0);
});

test("installs selecting-working-methods independently through the real CLI", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-selecting-methods-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--skill",
    slug,
  ]);

  assert.deepEqual(await readdir(destination), [slug]);
  assert.match(await readFile(path.join(destination, slug, "SKILL.md"), "utf8"), new RegExp(`name: ${slug}`));
});
