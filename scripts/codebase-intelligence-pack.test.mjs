import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir } from "node:fs/promises";
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

function localMarkdownTargets(source) {
  return [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1].split("#", 1)[0])
    .filter((target) => target && !target.startsWith("#") && !/^[a-z][a-z\d+.-]*:/i.test(target));
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

test("publishes Codebase Intelligence as an ordered active Stable pack", async () => {
  const pack = await readJson(packPath);

  assert.equal(pack.slug, "codebase-intelligence");
  assert.equal(pack.status, "active");
  assert.equal(pack.version, "1.0.0");
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
    assert.equal(metadata.version, "1.0.0");
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

test("each Codebase Intelligence skill installs alone with self-contained Markdown targets", async () => {
  const brokenTargets = [];

  for (const slug of codebaseIntelligenceSkills) {
    const destination = await mkdtemp(path.join(tmpdir(), `agent-skills-${slug}-`));
    await execFileAsync(process.execPath, [
      path.join(repositoryRoot, "scripts", "install-skills.mjs"),
      "--destination",
      destination,
      "--skill",
      slug,
    ]);

    const installedSkill = path.join(destination, slug);
    const source = await readFile(path.join(installedSkill, "SKILL.md"), "utf8");
    for (const target of localMarkdownTargets(source)) {
      const resolved = path.resolve(installedSkill, target);
      if (!isWithin(installedSkill, resolved)) {
        brokenTargets.push(`${slug}: ${target} escapes the installed skill directory`);
        continue;
      }
      try {
        await access(resolved);
      } catch {
        brokenTargets.push(`${slug}: ${target} is missing from the installed skill directory`);
      }
    }
  }

  assert.deepEqual(brokenTargets, []);
});
