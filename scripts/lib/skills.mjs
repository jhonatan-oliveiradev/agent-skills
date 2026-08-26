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

export async function inspectSkillsRoot(repoRoot) {
  const root = getSkillsRoot(repoRoot);
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return { skills: [], symbolicLinks: [] };
    throw error;
  }
  const skills = [];
  const symbolicLinks = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      symbolicLinks.push(entry.name);
      continue;
    }
    if (!entry.isDirectory()) continue;
    const directory = path.join(root, entry.name);
    const skillFile = path.join(directory, "SKILL.md");
    if (!(await exists(skillFile))) continue;
    skills.push({ name: entry.name, directory, skillFile });
  }
  return {
    skills: skills.sort((left, right) => left.name.localeCompare(right.name)),
    symbolicLinks: symbolicLinks.sort((left, right) => left.localeCompare(right)),
  };
}

export async function listSkills(repoRoot) {
  return (await inspectSkillsRoot(repoRoot)).skills;
}
