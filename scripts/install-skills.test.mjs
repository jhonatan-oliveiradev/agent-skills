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

test("rejects an unknown skill before copying selected skills", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-selection-"));
  await writeFile(path.join(destination, "preserve.txt"), "keep me");

  await assert.rejects(
    installSkills({ repoRoot, destination, names: ["beta", "missing"] }),
    /Unknown skill: missing/,
  );
  assert.equal(await readFile(path.join(destination, "preserve.txt"), "utf8"), "keep me");
  await assert.rejects(readFile(path.join(destination, "beta", "SKILL.md")), { code: "ENOENT" });
});

test("deduplicates and sorts explicit skill names", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-sorted-"));

  assert.deepEqual(
    await installSkills({ repoRoot, destination, names: ["beta", "alpha", "beta"] }),
    ["alpha", "beta"],
  );
});
