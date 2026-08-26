import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { validateSkills } from "./validate-skills.mjs";

async function fixture(skills) {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-validation-"));
  for (const [directory, source] of Object.entries(skills)) {
    const target = path.join(root, "skills", directory);
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, "SKILL.md"), source);
  }
  return root;
}

test("validates skills from the canonical nested directory", async () => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  assert.deepEqual(await validateSkills(root), { errors: [], skillCount: 1 });
});

test("reports trigger, duplicate-name, and private-data violations", async () => {
  const root = await fixture({
    alpha: "---\nname: shared\ndescription: Missing trigger prefix.\n---\n",
    beta: "---\nname: shared\ndescription: Use when beta applies.\n---\nghp_abcdefghijklmnopqrstuvwxyz",
  });
  const { errors, skillCount } = await validateSkills(root);
  assert.equal(skillCount, 2);
  assert.equal(errors.some((error) => error.includes("description should start")), true);
  assert.equal(errors.some((error) => error.includes("duplicate skill name")), true);
  assert.equal(errors.some((error) => error.includes("forbidden private-data pattern")), true);
});
