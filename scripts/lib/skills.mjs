import { access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function getSkillsRoot(repoRoot) {
  return path.join(path.resolve(repoRoot), "skills");
}

export async function listSkills(repoRoot) {
  const root = getSkillsRoot(repoRoot);
  const entries = await readdir(root, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(root, entry.name);
    const skillFile = path.join(directory, "SKILL.md");
    if (!(await exists(skillFile))) continue;
    skills.push({ name: entry.name, directory, skillFile });
  }
  return skills.sort((left, right) => left.name.localeCompare(right.name));
}
