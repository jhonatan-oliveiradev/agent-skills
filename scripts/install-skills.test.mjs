import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { installSkills } from "./install-skills.mjs";

async function repositoryFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-install-source-"));
  for (const name of ["alpha", "beta"]) {
    const directory = path.join(root, "skills", name);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "SKILL.md"), `---\nname: ${name}\ndescription: Use when ${name} applies.\n---\n`);
  }
  return root;
}

test("installs all skills and removes stale contents", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-target-"));
  await mkdir(path.join(destination, "alpha"), { recursive: true });
  await writeFile(path.join(destination, "alpha", "stale.txt"), "remove me");

  assert.deepEqual(await installSkills({ repoRoot, destination }), ["alpha", "beta"]);
  await assert.rejects(readFile(path.join(destination, "alpha", "stale.txt")), { code: "ENOENT" });
  assert.match(await readFile(path.join(destination, "alpha", "SKILL.md"), "utf8"), /name: alpha/);
});

test("installs a selection and rejects unknown skills before copying", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-selection-"));
  assert.deepEqual(await installSkills({ repoRoot, destination, names: ["beta"] }), ["beta"]);
  await assert.rejects(installSkills({ repoRoot, destination, names: ["missing"] }), /Unknown skill: missing/);
});
