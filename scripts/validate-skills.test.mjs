import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
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

test("scans regular files recursively for private-data patterns", async () => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  await mkdir(path.join(root, "skills", "alpha", "references"));
  await mkdir(path.join(root, "skills", "alpha", "scripts"));
  await writeFile(path.join(root, "skills", "alpha", "references", "private.md"), "ghp_abcdefghijklmnopqrstuvwxyz");
  await writeFile(path.join(root, "skills", "alpha", "scripts", "private.txt"), "sk-proj-abcdefghijklmnopqrstuvwxyz");

  const { errors } = await validateSkills(root);
  assert.equal(errors.some((error) => error.includes("references/private.md") && error.includes("forbidden private-data pattern")), true);
  assert.equal(errors.some((error) => error.includes("scripts/private.txt") && error.includes("forbidden private-data pattern")), true);
});

test("rejects symbolic links inside skill directories", async (t) => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  const outside = path.join(root, "outside.txt");
  await writeFile(outside, "public fixture");
  try {
    await symlink(outside, path.join(root, "skills", "alpha", "linked.txt"), "file");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  const { errors } = await validateSkills(root);
  assert.equal(errors.some((error) => error.includes("linked.txt") && error.includes("symbolic links are not allowed")), true);
});

test("rejects a token-bearing skill symlink directly under the canonical skills directory", async (t) => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  const outside = await mkdtemp(path.join(tmpdir(), "agent-skills-validation-linked-skill-"));
  await writeFile(
    path.join(outside, "SKILL.md"),
    "---\nname: linked\ndescription: Use when linked applies.\n---\nghp_abcdefghijklmnopqrstuvwxyz",
  );
  try {
    await symlink(outside, path.join(root, "skills", "linked"), "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  const { errors, skillCount } = await validateSkills(root);
  assert.equal(skillCount, 1);
  assert.equal(errors.some((error) => error.includes("linked") && error.includes("symbolic links are not allowed")), true);
});

test("reports an absent canonical skills directory as an empty structured result", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-validation-empty-"));

  assert.deepEqual(await validateSkills(root), {
    errors: ["No skill directories found"],
    skillCount: 0,
  });
});
