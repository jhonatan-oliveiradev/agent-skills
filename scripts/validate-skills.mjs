import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const entries = await readdir(root);
const skillDirs = [];

for (const entry of entries) {
  const full = path.join(root, entry);
  if ((await stat(full)).isDirectory()) {
    try {
      await stat(path.join(full, "SKILL.md"));
      skillDirs.push(entry);
    } catch {}
  }
}

const errors = [];
const names = new Set();
const forbiddenPrivatePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:sk|sk-proj)-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /https?:\/\/(?:[^\s/]+\.)?internal(?:[./:]|\b)/i,
];

for (const dir of skillDirs.sort()) {
  const file = path.join(root, dir, "SKILL.md");
  const text = await readFile(file, "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    errors.push(`${dir}: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();

  if (!name) errors.push(`${dir}: missing name`);
  if (name && name !== dir) errors.push(`${dir}: name must match directory (${name})`);
  if (name && !/^[a-z0-9-]+$/.test(name)) errors.push(`${dir}: invalid skill name`);
  if (name && names.has(name)) errors.push(`${dir}: duplicate skill name ${name}`);
  if (name) names.add(name);
  if (!description) errors.push(`${dir}: missing description`);
  if (description && !description.startsWith("Use when")) errors.push(`${dir}: description should start with 'Use when'`);
  if (description && description.length > 500) errors.push(`${dir}: description exceeds 500 characters`);

  for (const pattern of forbiddenPrivatePatterns) {
    if (pattern.test(text)) errors.push(`${dir}: contains a forbidden private-data pattern`);
  }
}

if (skillDirs.length === 0) errors.push("No skill directories found");

if (errors.length) {
  console.error(`Skill validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skills successfully.`);
