#!/usr/bin/env node

import { cp, mkdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { listSkills } from "./lib/skills.mjs";

export async function installSkills({ repoRoot, destination, names }) {
  const available = await listSkills(repoRoot);
  const byName = new Map(available.map((skill) => [skill.name, skill]));
  const selected = names?.length ? [...new Set(names)].sort() : available.map((skill) => skill.name);

  for (const name of selected) {
    if (!byName.has(name)) throw new Error(`Unknown skill: ${name}`);
  }

  const targetRoot = path.resolve(destination);
  if (targetRoot === path.parse(targetRoot).root) {
    throw new Error("Refusing to install into a filesystem root.");
  }

  await mkdir(targetRoot, { recursive: true });
  for (const name of selected) {
    const target = path.join(targetRoot, name);
    await rm(target, { recursive: true, force: true });
    await cp(byName.get(name).directory, target, { recursive: true });
  }

  return selected;
}

function parseArgs(argv) {
  const args = { destination: path.join(homedir(), ".agents", "skills"), names: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--destination" && argv[index + 1]) args.destination = argv[++index];
    else if (argument === "--skill" && argv[index + 1]) args.names.push(argv[++index]);
    else throw new Error(`Unknown option: ${argument}`);
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const installed = await installSkills({ repoRoot, ...args });
  for (const name of installed) console.log(`Installed ${name}`);
  console.log(`Skills installed in ${path.resolve(args.destination)}`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
