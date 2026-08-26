import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getSkillsRoot, listSkills } from "./skills.mjs";

test("discovers only canonical skill directories in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-discovery-"));
  await mkdir(path.join(root, "skills", "zeta"), { recursive: true });
  await mkdir(path.join(root, "skills", "alpha"), { recursive: true });
  await mkdir(path.join(root, "unrelated"), { recursive: true });
  await writeFile(path.join(root, "skills", "zeta", "SKILL.md"), "---\nname: zeta\ndescription: Use when zeta applies.\n---\n");
  await writeFile(path.join(root, "skills", "alpha", "SKILL.md"), "---\nname: alpha\ndescription: Use when alpha applies.\n---\n");
  await writeFile(path.join(root, "unrelated", "SKILL.md"), "---\nname: unrelated\ndescription: Use when ignored.\n---\n");

  assert.equal(getSkillsRoot(root), path.join(root, "skills"));
  assert.deepEqual((await listSkills(root)).map(({ name }) => name), ["alpha", "zeta"]);
});

test("returns no skills when the canonical skills directory is absent", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-discovery-empty-"));

  assert.deepEqual(await listSkills(root), []);
});

test("rethrows unexpected errors while reading the canonical skills directory", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-discovery-invalid-"));
  await writeFile(path.join(root, "skills"), "not a directory");

  await assert.rejects(listSkills(root), { code: "ENOTDIR" });
});
