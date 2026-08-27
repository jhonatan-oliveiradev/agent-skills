import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const staleGeneratedCatalogError = "catalog/generated/catalog.json is stale; run npm run catalog:generate";

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedUnique(values) {
  return [...new Set(values)].sort(compareStrings);
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Object.fromEntries([...counts].sort(([left], [right]) => compareStrings(left, right)));
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort(compareStrings).map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function serializeCatalog(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function localizedValue(skill, locales, field) {
  return Object.fromEntries(locales.map((locale) => [locale, skill.locales[locale][field]]));
}

function expandPack(pack, skillIndex, locales) {
  const { skills: skillSlugs, ...properties } = pack;
  return {
    ...properties,
    skillSlugs: [...skillSlugs],
    skills: skillSlugs.map((slug) => {
      const skill = skillIndex.get(slug);
      return {
        slug,
        displayName: localizedValue(skill, locales, "displayName"),
        summary: localizedValue(skill, locales, "summary"),
        difficulty: skill.difficulty,
        maturity: skill.maturity,
      };
    }),
  };
}

export function assembleCatalog({ manifest, skills: sourceSkills, packs: sourcePacks }) {
  const skills = [...sourceSkills].sort((left, right) => compareStrings(left.slug, right.slug));
  const packs = [
    ...sourcePacks.filter((pack) => pack.status === "active"),
    ...sourcePacks.filter((pack) => pack.status === "planned"),
  ];
  const skillIndex = new Map(skills.map((skill) => [skill.slug, skill]));
  const activePacks = packs.filter((pack) => pack.status === "active");
  const sourceDigest = createHash("sha256")
    .update(JSON.stringify(canonicalize({ manifest, skills, packs })))
    .digest("hex");

  return {
    schemaVersion: manifest.schemaVersion,
    version: manifest.version,
    defaultLocale: manifest.defaultLocale,
    locales: [...manifest.locales],
    sourceDigest,
    filters: {
      categories: sortedUnique(skills.map((skill) => skill.category)),
      packs: sortedUnique(packs.map((pack) => pack.slug)),
      tags: sortedUnique(skills.flatMap((skill) => skill.tags)),
      maturity: sortedUnique(skills.map((skill) => skill.maturity)),
      difficulty: sortedUnique(skills.map((skill) => skill.difficulty)),
      surfaces: sortedUnique(skills.flatMap((skill) => skill.compatibility.surfaces)),
      operatingSystems: sortedUnique(skills.flatMap((skill) => skill.compatibility.operatingSystems)),
      installModes: sortedUnique(skills.flatMap((skill) => skill.compatibility.installModes)),
      dependencies: sortedUnique(skills.flatMap((skill) => skill.dependencies.map(({ name }) => name))),
    },
    counts: {
      skills: skills.length,
      packs: {
        total: packs.length,
        active: activePacks.length,
        planned: packs.length - activePacks.length,
      },
      categories: countValues(skills.map((skill) => skill.category)),
      maturity: countValues(skills.map((skill) => skill.maturity)),
      difficulty: countValues(skills.map((skill) => skill.difficulty)),
      activePackMembership: Object.fromEntries(activePacks.map((pack) => [pack.slug, pack.skills.length])),
    },
    skills,
    packs: packs.map((pack) => expandPack(pack, skillIndex, manifest.locales)),
  };
}

export async function checkCatalogBytes(repoRoot, catalog) {
  let actual = null;
  try {
    actual = await readFile(getCatalogPaths(repoRoot).generatedFile, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return actual === serializeCatalog(catalog) ? [] : [staleGeneratedCatalogError];
}

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
  for (const entry of entries.sort((left, right) => compareStrings(left.name, right.name))) {
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
