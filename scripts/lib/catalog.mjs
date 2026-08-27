import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export function getCatalogPaths(repoRoot) {
  const root = path.join(path.resolve(repoRoot), "catalog");
  return {
    root,
    manifestFile: path.join(root, "catalog.json"),
    schemasDirectory: path.join(root, "schemas"),
    skillsDirectory: path.join(root, "skills"),
    packsDirectory: path.join(root, "packs"),
    generatedFile: path.join(root, "generated", "catalog.json"),
  };
}

export async function inspectJsonDirectory(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return { files: [], symbolicLinks: [] };
    throw error;
  }
  const files = [];
  const symbolicLinks = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isSymbolicLink()) symbolicLinks.push(entry.name);
    else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push({ slug: entry.name.slice(0, -5), file: path.join(directory, entry.name) });
    }
  }
  return { files, symbolicLinks };
}

export async function readJson(file) {
  try {
    return { value: JSON.parse(await readFile(file, "utf8")), error: null };
  } catch (error) {
    if (error instanceof SyntaxError) return { value: null, error: `${file}: invalid JSON` };
    if (error?.code === "ENOENT") return { value: null, error: `${file}: file does not exist` };
    throw error;
  }
}
