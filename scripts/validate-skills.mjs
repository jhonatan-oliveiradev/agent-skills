import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectSkillsRoot } from "./lib/skills.mjs";
import { containsForbiddenPrivateData } from "./lib/privacy.mjs";

async function collectRegularFiles(directory, skillRoot, skillName, errors) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      const relative = path.relative(skillRoot, entryPath).split(path.sep).join("/");
      errors.push(`${skillName}/${relative}: symbolic links are not allowed`);
    } else if (entry.isDirectory()) {
      files.push(...await collectRegularFiles(entryPath, skillRoot, skillName, errors));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function validateSkills(root) {
  const { skills, symbolicLinks } = await inspectSkillsRoot(root);
  const errors = symbolicLinks.map((name) => `${name}: symbolic links are not allowed`);
  const names = new Set();

  for (const { name: directoryName, directory, skillFile } of skills) {
    const regularFiles = await collectRegularFiles(directory, directory, directoryName, errors);
    for (const file of regularFiles) {
      const fileText = await readFile(file, "utf8");
      if (containsForbiddenPrivateData(fileText)) {
        const relative = path.relative(directory, file).split(path.sep).join("/");
        errors.push(`${directoryName}/${relative}: contains a forbidden private-data pattern`);
      }
    }

    if (!regularFiles.includes(skillFile)) continue;
    const text = await readFile(skillFile, "utf8");
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) {
      errors.push(`${directoryName}: missing YAML frontmatter`);
      continue;
    }

    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) errors.push(`${directoryName}: missing name`);
    if (name && name !== directoryName) errors.push(`${directoryName}: name must match directory (${name})`);
    if (name && !/^[a-z0-9-]+$/.test(name)) errors.push(`${directoryName}: invalid skill name`);
    if (name && names.has(name)) errors.push(`${directoryName}: duplicate skill name ${name}`);
    if (name) names.add(name);
    if (!description) errors.push(`${directoryName}: missing description`);
    if (description && !description.startsWith("Use when")) errors.push(`${directoryName}: description should start with 'Use when'`);
    if (description && description.length > 500) errors.push(`${directoryName}: description exceeds 500 characters`);
  }

  if (skills.length === 0) errors.push("No skill directories found");
  return { errors, skillCount: skills.length };
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const repoRoot = path.resolve(path.dirname(scriptFile), "..");
  const { errors, skillCount } = await validateSkills(repoRoot);
  if (errors.length) {
    console.error(`Skill validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Validated ${skillCount} skills successfully.`);
  }
}
