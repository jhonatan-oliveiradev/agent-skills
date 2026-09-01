import { isIP } from "node:net";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { assembleCatalog, checkCatalogBytes, getCatalogPaths, inspectJsonDirectory, readJson } from "./lib/catalog.mjs";
import { containsForbiddenPrivateData } from "./lib/privacy.mjs";
import { inspectSkillsRoot } from "./lib/skills.mjs";

const allowedCategories = new Set(["frontend", "product-design", "motion", "game-development", "backend-data", "architecture-engineering", "quality-testing", "delivery", "meta"]);
const allowedMaturity = new Set(["proposed", "research", "experimental", "beta", "stable", "deprecated"]);
const allowedDifficulty = new Set(["beginner", "intermediate", "advanced"]);
const allowedSurfaces = new Set(["chatgpt", "codex"]);
const allowedOperatingSystems = new Set(["linux", "macos", "windows"]);
const allowedInstallModes = new Set(["plugin", "filesystem"]);
const allowedDependencyTypes = new Set(["library", "tool", "service", "skill"]);
const requiredLocales = ["en", "pt-BR"];
const localizedSkillFields = ["displayName", "summary", "primaryBenefit", "whenToUse", "whenNotToUse"];

const slugPattern = /^[a-z0-9-]+$/;
const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/;
const datePattern = /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const reservedDnsSuffixes = ["alt", "arpa", "example", "invalid", "internal", "local", "localhost", "onion", "test"];
const reservedDnsNames = ["example.com", "example.net", "example.org"];
const specialUseIpv4Cidrs = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.31.196.0", 24],
  ["192.52.193.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["192.175.48.0", 24],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];
const specialUseIpv6Cidrs = [
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["2620:4f:8000::", 48],
  ["3fff::", 20],
];

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function relativeFile(repoRoot, file) {
  return path.relative(repoRoot, file).split(path.sep).join("/") || ".";
}

function relativeReadError(repoRoot, file, error) {
  const suffix = error.startsWith(file) ? error.slice(file.length) : `: ${error}`;
  return `${relativeFile(repoRoot, file)}${suffix}`;
}

async function inspectCatalogTree(directory, repoRoot) {
  const jsonFiles = [];
  const regularFiles = [];
  const symbolicLinks = [];

  async function visit(candidate) {
    let stats;
    try {
      stats = await lstat(candidate);
    } catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }
    if (stats.isSymbolicLink()) {
      symbolicLinks.push(candidate);
      return;
    }
    if (stats.isFile()) {
      regularFiles.push(candidate);
      if (candidate.endsWith(".json")) jsonFiles.push(candidate);
      return;
    }
    if (!stats.isDirectory()) return;

    const entries = await readdir(candidate, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => compareStrings(left.name, right.name))) {
      await visit(path.join(candidate, entry.name));
    }
  }

  await visit(directory);
  return {
    jsonFiles: jsonFiles.sort((left, right) => compareStrings(relativeFile(repoRoot, left), relativeFile(repoRoot, right))),
    regularFiles: regularFiles.sort((left, right) => compareStrings(relativeFile(repoRoot, left), relativeFile(repoRoot, right))),
    symbolicLinks: symbolicLinks.sort((left, right) => compareStrings(relativeFile(repoRoot, left), relativeFile(repoRoot, right))),
  };
}

function isBlockedPath(candidate, blockedPaths) {
  for (const blocked of blockedPaths) {
    const relative = path.relative(blocked, candidate);
    if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
      return true;
    }
  }
  return false;
}

async function loadRecordDirectory(directory, repoRoot, blockedPaths, errors) {
  if (isBlockedPath(directory, blockedPaths)) return { records: [], files: [] };
  const inspection = await inspectJsonDirectory(directory);
  const records = [];
  const files = [];
  for (const source of inspection.files) {
    if (isBlockedPath(source.file, blockedPaths)) continue;
    const loaded = await readJson(source.file);
    if (loaded.error) {
      errors.push(relativeReadError(repoRoot, source.file, loaded.error));
      continue;
    }
    records.push(loaded.value);
    files.push({ ...source, relative: relativeFile(repoRoot, source.file) });
  }
  return { records, files };
}

async function collectJsonSyntaxErrors(files, repoRoot, errors) {
  for (const file of files) {
    const loaded = await readJson(file);
    if (loaded.error) errors.push(relativeReadError(repoRoot, file, loaded.error));
  }
}

export async function loadCatalog(repoRoot, options = {}) {
  const root = path.resolve(repoRoot);
  const paths = getCatalogPaths(root);
  const errors = [];
  const tree = await inspectCatalogTree(paths.root, root);
  const jsonSources = options.ignoreGenerated === true
    ? tree.jsonFiles.filter((file) => path.resolve(file) !== paths.generatedFile)
    : tree.jsonFiles;
  const blockedPaths = new Set(tree.symbolicLinks);
  for (const file of tree.symbolicLinks) {
    errors.push(`${relativeFile(root, file)}: symbolic links are not allowed`);
  }
  await collectJsonSyntaxErrors(jsonSources, root, errors);

  let manifest = null;
  if (!isBlockedPath(paths.manifestFile, blockedPaths)) {
    const loadedManifest = await readJson(paths.manifestFile);
    if (loadedManifest.error) errors.push(relativeReadError(root, paths.manifestFile, loadedManifest.error));
    else manifest = loadedManifest.value;
  }

  const [skillSources, packSources] = await Promise.all([
    loadRecordDirectory(paths.skillsDirectory, root, blockedPaths, errors),
    loadRecordDirectory(paths.packsDirectory, root, blockedPaths, errors),
  ]);

  return {
    manifest,
    skills: skillSources.records,
    packs: packSources.records,
    files: {
      manifest: { file: paths.manifestFile, relative: relativeFile(root, paths.manifestFile) },
      skills: skillSources.files,
      packs: packSources.files,
      jsonSources: jsonSources.map((file) => ({ file, relative: relativeFile(root, file) })),
      privacySources: tree.regularFiles.map((file) => ({ file, relative: relativeFile(root, file) })),
    },
    errors: [...new Set(errors)].sort(compareStrings),
  };
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createReporter(errors, file, label = "") {
  const prefix = label ? `${file}: ${label}: ` : `${file}: `;
  return (message) => errors.push(`${prefix}${message}`);
}

function validateObject(value, field, allowedFields, report) {
  if (!isRecord(value)) {
    report(field ? `${field} must be an object` : "must contain an object");
    return false;
  }
  for (const key of Object.keys(value).sort(compareStrings)) {
    if (!allowedFields.has(key)) report(`${field ? `${field}.` : ""}${key} is not allowed`);
  }
  return true;
}

function validateNonemptyString(value, field, report) {
  if (value === undefined) {
    report(`${field} is required`);
    return false;
  }
  if (typeof value !== "string" || value.trim() === "") {
    report(`${field} must be a nonempty string`);
    return false;
  }
  return true;
}

function validateBoolean(value, field, report) {
  if (value === undefined) report(`${field} is required`);
  else if (typeof value !== "boolean") report(`${field} must be a boolean`);
}

function validateEnum(value, field, allowed, report) {
  if (value === undefined) report(`${field} is required`);
  else if (!allowed.has(value)) report(`${field} must be one of: ${[...allowed].join(", ")}`);
}

function validateStringArray(value, field, report, options = {}) {
  const { allowed, minItems = 0, slugItems = false, unique = true } = options;
  if (value === undefined) {
    report(`${field} is required`);
    return false;
  }
  if (!Array.isArray(value)) {
    report(`${field} must be an array`);
    return false;
  }
  if (value.length < minItems) report(`${field} must contain at least ${minItems} item(s)`);
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (typeof item !== "string" || item.trim() === "") {
      report(`${field}[${index}] must be a nonempty string`);
    } else if (slugItems && !slugPattern.test(item)) {
      report(`${field}[${index}] must match ^[a-z0-9-]+$`);
    } else if (allowed && !allowed.has(item)) {
      report(`${field}[${index}] must be one of: ${[...allowed].join(", ")}`);
    }
  }
  if (unique && new Set(value).size !== value.length) report(`${field} must contain unique values`);
  return true;
}

function validateVersion(value, field, report) {
  if (!validateNonemptyString(value, field, report)) return;
  if (!versionPattern.test(value)) report(`${field} must be an x.y.z version with an optional prerelease`);
}

function validateDate(value, field, report) {
  if (!validateNonemptyString(value, field, report)) return;
  const match = datePattern.exec(value);
  if (!match) {
    report(`${field} must be an ISO YYYY-MM-DD date`);
    return;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    report(`${field} must be an ISO YYYY-MM-DD date`);
  }
}

function parseIpv4(value) {
  const octets = value.split(".");
  if (octets.length !== 4) return null;
  let address = 0;
  for (const octet of octets) {
    const number = Number(octet);
    if (!Number.isInteger(number) || number < 0 || number > 255) return null;
    address = (address * 256) + number;
  }
  return address;
}

function parseIpv6(value) {
  const compressed = value.split("::");
  if (compressed.length > 2) return null;

  function parsePart(part) {
    if (part === "") return [];
    const groups = [];
    for (const group of part.split(":")) {
      if (group.includes(".")) {
        const ipv4 = parseIpv4(group);
        if (ipv4 === null) return null;
        groups.push(ipv4 >>> 16, ipv4 & 0xffff);
      } else if (!/^[0-9a-f]{1,4}$/i.test(group)) {
        return null;
      } else {
        groups.push(Number.parseInt(group, 16));
      }
    }
    return groups;
  }

  const head = parsePart(compressed[0]);
  const tail = parsePart(compressed[1] ?? "");
  if (!head || !tail) return null;
  const omitted = 8 - head.length - tail.length;
  if ((compressed.length === 1 && omitted !== 0) || (compressed.length === 2 && omitted < 1)) return null;
  const groups = [...head, ...Array.from({ length: omitted }, () => 0), ...tail];
  return groups.reduce((address, group) => (address << 16n) | BigInt(group), 0n);
}

function ipv4MatchesCidr(address, network, prefixLength) {
  const shift = 32 - prefixLength;
  return Math.floor(address / (2 ** shift)) === Math.floor(network / (2 ** shift));
}

function ipv6MatchesCidr(address, network, prefixLength) {
  const shift = 128n - BigInt(prefixLength);
  return (address >> shift) === (network >> shift);
}

function isGlobalUnicastIp(hostname, ipVersion) {
  if (ipVersion === 4) {
    const address = parseIpv4(hostname);
    return address !== null && !specialUseIpv4Cidrs.some(([network, prefixLength]) => (
      ipv4MatchesCidr(address, parseIpv4(network), prefixLength)
    ));
  }

  const address = parseIpv6(hostname);
  const globalUnicastNetwork = parseIpv6("2000::");
  if (address === null || !ipv6MatchesCidr(address, globalUnicastNetwork, 3)) return false;
  return !specialUseIpv6Cidrs.some(([network, prefixLength]) => (
    ipv6MatchesCidr(address, parseIpv6(network), prefixLength)
  ));
}

function hasReservedDnsSuffix(hostname) {
  return [...reservedDnsSuffixes, ...reservedDnsNames].some((suffix) => (
    hostname === suffix || hostname.endsWith(`.${suffix}`)
  ));
}

function isPublicHttpsUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return false;
  const hostname = url.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  const ipVersion = isIP(hostname);
  if (ipVersion !== 0) return isGlobalUnicastIp(hostname, ipVersion);
  return hostname.includes(".") && !hasReservedDnsSuffix(hostname);
}

function validateLocalizedSkill(locales, report) {
  const localeFields = new Set([...localizedSkillFields, "useCases", "examplePrompts"]);
  if (!validateObject(locales, "locales", new Set(requiredLocales), report)) return;
  for (const locale of requiredLocales) {
    const localized = locales[locale];
    if (localized === undefined) {
      report(`${locale} locale is required`);
      continue;
    }
    if (!validateObject(localized, locale, localeFields, report)) continue;
    for (const field of localizedSkillFields) {
      validateNonemptyString(localized[field], `${locale}.${field}`, report);
    }
    validateStringArray(localized.useCases, `${locale}.useCases`, report, { minItems: 2, unique: false });
    validateStringArray(localized.examplePrompts, `${locale}.examplePrompts`, report, { minItems: 1, unique: false });
  }
}

function validateLocalizedPack(locales, report) {
  const localeFields = new Set(["name", "summary", "description", "outcomes"]);
  if (!validateObject(locales, "locales", new Set(requiredLocales), report)) return;
  for (const locale of requiredLocales) {
    const localized = locales[locale];
    if (localized === undefined) {
      report(`${locale} locale is required`);
      continue;
    }
    if (!validateObject(localized, locale, localeFields, report)) continue;
    for (const field of ["name", "summary", "description"]) {
      validateNonemptyString(localized[field], `${locale}.${field}`, report);
    }
    validateStringArray(localized.outcomes, `${locale}.outcomes`, report, { minItems: 1, unique: false });
  }
}

function validateDependencies(value, report) {
  if (value === undefined) {
    report("dependencies is required");
    return;
  }
  if (!Array.isArray(value)) {
    report("dependencies must be an array");
    return;
  }
  const allowedFields = new Set(["name", "type", "required", "url"]);
  const names = new Set();
  for (let index = 0; index < value.length; index += 1) {
    const dependency = value[index];
    const field = `dependencies[${index}]`;
    if (!validateObject(dependency, field, allowedFields, report)) continue;
    validateNonemptyString(dependency.name, `${field}.name`, report);
    if (typeof dependency.name === "string" && dependency.name.trim() !== "") {
      if (names.has(dependency.name)) report(`duplicate dependency: ${dependency.name}`);
      else names.add(dependency.name);
    }
    validateEnum(dependency.type, `${field}.type`, allowedDependencyTypes, report);
    validateBoolean(dependency.required, `${field}.required`, report);
    if (dependency.url !== undefined && (typeof dependency.url !== "string" || !isPublicHttpsUrl(dependency.url))) {
      report(`${field}.url must be a public HTTPS URL`);
    }
  }
}

function validateManifest(manifest, file, errors) {
  const report = createReporter(errors, file);
  const fields = new Set(["$schema", "schemaVersion", "version", "defaultLocale", "locales"]);
  if (!validateObject(manifest, "", fields, report)) return;
  if (validateNonemptyString(manifest.$schema, "$schema", report) && manifest.$schema !== "./schemas/catalog.schema.json") {
    report("$schema must be ./schemas/catalog.schema.json");
  }
  if (manifest.schemaVersion === undefined) report("schemaVersion is required");
  else if (manifest.schemaVersion !== 1) report("schemaVersion must be 1");
  validateVersion(manifest.version, "version", report);
  if (validateNonemptyString(manifest.defaultLocale, "defaultLocale", report) && manifest.defaultLocale !== "en") {
    report("defaultLocale must be en");
  }
  if (validateStringArray(manifest.locales, "locales", report, { minItems: 2 })) {
    if (manifest.locales.length !== requiredLocales.length || manifest.locales.some((locale, index) => locale !== requiredLocales[index])) {
      report("locales must be exactly: en, pt-BR");
    }
  }
}

const skillFields = new Set([
  "$schema",
  "slug",
  "category",
  "packs",
  "maturity",
  "difficulty",
  "featured",
  "compatibility",
  "tags",
  "dependencies",
  "relatedSkills",
  "version",
  "updatedAt",
  "locales",
]);

function validateSkill(record, source, errors) {
  const label = isRecord(record) && typeof record.slug === "string" ? record.slug : source.slug;
  const report = createReporter(errors, source.relative, label);
  if (!validateObject(record, "", skillFields, report)) return;
  if (validateNonemptyString(record.$schema, "$schema", report) && record.$schema !== "../schemas/skill.schema.json") {
    report("$schema must be ../schemas/skill.schema.json");
  }
  if (validateNonemptyString(record.slug, "slug", report)) {
    if (!slugPattern.test(record.slug)) report("slug must match ^[a-z0-9-]+$");
    if (record.slug !== source.slug) report(`slug must match filename: ${source.slug}`);
  }
  validateEnum(record.category, "category", allowedCategories, report);
  validateStringArray(record.packs, "packs", report, { slugItems: true });
  validateEnum(record.maturity, "maturity", allowedMaturity, report);
  validateEnum(record.difficulty, "difficulty", allowedDifficulty, report);
  validateBoolean(record.featured, "featured", report);

  const compatibilityFields = new Set(["surfaces", "operatingSystems", "installModes"]);
  if (validateObject(record.compatibility, "compatibility", compatibilityFields, report)) {
    validateStringArray(record.compatibility.surfaces, "compatibility.surfaces", report, { allowed: allowedSurfaces, minItems: 1 });
    validateStringArray(record.compatibility.operatingSystems, "compatibility.operatingSystems", report, {
      allowed: allowedOperatingSystems,
      minItems: 1,
    });
    validateStringArray(record.compatibility.installModes, "compatibility.installModes", report, {
      allowed: allowedInstallModes,
      minItems: 1,
    });
  }
  validateStringArray(record.tags, "tags", report);
  validateDependencies(record.dependencies, report);
  validateStringArray(record.relatedSkills, "relatedSkills", report, { slugItems: true });
  validateVersion(record.version, "version", report);
  validateDate(record.updatedAt, "updatedAt", report);
  validateLocalizedSkill(record.locales, report);
}

const packFields = new Set(["$schema", "slug", "status", "featured", "color", "version", "skills", "locales"]);
const allowedPackStatuses = new Set(["active", "planned"]);

function validatePack(record, source, errors) {
  const label = isRecord(record) && typeof record.slug === "string" ? record.slug : source.slug;
  const report = createReporter(errors, source.relative, label);
  if (!validateObject(record, "", packFields, report)) return;
  if (validateNonemptyString(record.$schema, "$schema", report) && record.$schema !== "../schemas/pack.schema.json") {
    report("$schema must be ../schemas/pack.schema.json");
  }
  if (validateNonemptyString(record.slug, "slug", report)) {
    if (!slugPattern.test(record.slug)) report("slug must match ^[a-z0-9-]+$");
    if (record.slug !== source.slug) report(`slug must match filename: ${source.slug}`);
  }
  validateEnum(record.status, "status", allowedPackStatuses, report);
  validateBoolean(record.featured, "featured", report);
  validateNonemptyString(record.color, "color", report);
  validateVersion(record.version, "version", report);
  validateStringArray(record.skills, "skills", report, { slugItems: true });
  validateLocalizedPack(record.locales, report);
  if (record.status === "active" && Array.isArray(record.skills) && record.skills.length === 0) {
    report("active packs must contain at least one skill");
  }
  if (record.status === "planned" && Array.isArray(record.skills) && record.skills.length !== 0) {
    report("planned packs must not contain skills");
  }
}

function indexRecords(records, files, type, errors) {
  const index = new Map();
  for (let position = 0; position < records.length; position += 1) {
    const record = records[position];
    const source = files[position];
    if (!isRecord(record) || typeof record.slug !== "string" || record.slug.trim() === "") continue;
    if (index.has(record.slug)) {
      createReporter(errors, source.relative, record.slug)(`duplicate ${type} slug`);
    } else {
      index.set(record.slug, { record, source });
    }
  }
  return index;
}

function validateCoverage(repoRoot, canonicalSkills, skillIndex, errors) {
  const canonicalNames = new Set(canonicalSkills.map((skill) => skill.name));
  for (const skill of canonicalSkills) {
    if (!skillIndex.has(skill.name)) {
      createReporter(errors, relativeFile(repoRoot, skill.skillFile), skill.name)("missing catalog metadata");
    }
  }
  for (const [slug, { source }] of skillIndex) {
    if (!canonicalNames.has(slug)) createReporter(errors, source.relative, slug)("catalog metadata has no canonical skill");
  }
}

function validateRelations(skillIndex, packIndex, errors) {
  for (const [slug, { record, source }] of skillIndex) {
    const report = createReporter(errors, source.relative, slug);
    if (Array.isArray(record.relatedSkills)) {
      for (const related of new Set(record.relatedSkills)) {
        if (related === slug) report("related skill must not reference itself");
        else if (!skillIndex.has(related)) report(`related skill does not exist: ${related}`);
      }
    }
    if (Array.isArray(record.packs)) {
      for (const packSlug of new Set(record.packs)) {
        const packEntry = packIndex.get(packSlug);
        if (!packEntry) {
          report(`pack does not exist: ${packSlug}`);
        } else {
          if (packEntry.record.status === "planned") report(`skill cannot belong to planned pack: ${packSlug}`);
          if (!Array.isArray(packEntry.record.skills) || !packEntry.record.skills.includes(slug)) {
            report(`pack does not list skill: ${packSlug}`);
          }
        }
      }
    }
  }

  for (const [packSlug, { record, source }] of packIndex) {
    if (!Array.isArray(record.skills)) continue;
    const report = createReporter(errors, source.relative, packSlug);
    for (const skillSlug of new Set(record.skills)) {
      const skillEntry = skillIndex.get(skillSlug);
      if (!skillEntry) report(`skill does not exist: ${skillSlug}`);
      else if (!Array.isArray(skillEntry.record.packs) || !skillEntry.record.packs.includes(packSlug)) {
        report(`skill does not list pack: ${skillSlug}`);
      }
    }
  }
}

async function validatePrivacy(files, errors) {
  for (const source of files) {
    let text;
    try {
      text = await readFile(source.file, "utf8");
    } catch {
      errors.push(`${source.relative}: unreadable`);
      continue;
    }
    if (containsForbiddenPrivateData(text)) errors.push(`${source.relative}: forbidden private-data pattern`);
  }
}

async function readVersionSources(repoRoot, errors) {
  const pluginFile = path.join(repoRoot, ".codex-plugin", "plugin.json");
  const packageFile = path.join(repoRoot, "package.json");
  const versionFile = path.join(repoRoot, "VERSION");
  const [pluginResult, packageResult] = await Promise.all([readJson(pluginFile), readJson(packageFile)]);
  if (pluginResult.error) errors.push(relativeReadError(repoRoot, pluginFile, pluginResult.error));
  if (packageResult.error) errors.push(relativeReadError(repoRoot, packageFile, packageResult.error));
  let versionText = null;
  try {
    versionText = (await readFile(versionFile, "utf8")).trim();
  } catch (error) {
    if (error?.code === "ENOENT") errors.push(`${relativeFile(repoRoot, versionFile)}: file does not exist`);
    else errors.push(`${relativeFile(repoRoot, versionFile)}: unreadable`);
  }
  return {
    pluginVersion: pluginResult.value?.version,
    packageVersion: packageResult.value?.version,
    versionText,
  };
}

async function inspectCatalogSources(repoRoot, options = {}) {
  const root = path.resolve(repoRoot);
  const loaded = await loadCatalog(root, options);
  const errors = [...loaded.errors];
  validateManifest(loaded.manifest, loaded.files.manifest.relative, errors);

  for (let index = 0; index < loaded.skills.length; index += 1) {
    validateSkill(loaded.skills[index], loaded.files.skills[index], errors);
  }
  for (let index = 0; index < loaded.packs.length; index += 1) {
    validatePack(loaded.packs[index], loaded.files.packs[index], errors);
  }

  const [canonical, versions] = await Promise.all([inspectSkillsRoot(root), readVersionSources(root, errors)]);
  for (const name of canonical.symbolicLinks) errors.push(`skills/${name}: symbolic links are not allowed`);
  const skillIndex = indexRecords(loaded.skills, loaded.files.skills, "skill", errors);
  const packIndex = indexRecords(loaded.packs, loaded.files.packs, "pack", errors);
  validateCoverage(root, canonical.skills, skillIndex, errors);
  validateRelations(skillIndex, packIndex, errors);
  await validatePrivacy(loaded.files.privacySources, errors);

  const synchronized = [
    loaded.manifest?.version,
    versions.pluginVersion,
    versions.packageVersion,
    versions.versionText,
  ];
  if (new Set(synchronized).size !== 1 || synchronized.some((value) => typeof value !== "string" || value === "")) {
    errors.push(`${loaded.files.manifest.relative}: catalog, plugin, package, and VERSION values must match`);
  }
  for (let index = 0; index < loaded.skills.length; index += 1) {
    const record = loaded.skills[index];
    if (isRecord(record) && typeof record.version === "string" && record.version !== loaded.manifest?.version) {
      createReporter(errors, loaded.files.skills[index].relative, record.slug ?? loaded.files.skills[index].slug)(
        "version must match catalog version",
      );
    }
  }
  for (let index = 0; index < loaded.packs.length; index += 1) {
    const record = loaded.packs[index];
    if (isRecord(record) && typeof record.version === "string" && record.version !== loaded.manifest?.version) {
      createReporter(errors, loaded.files.packs[index].relative, record.slug ?? loaded.files.packs[index].slug)(
        "version must match catalog version",
      );
    }
  }

  return {
    loaded,
    result: {
      errors: [...new Set(errors)].sort(compareStrings),
      skillCount: loaded.skills.length,
      packCount: loaded.packs.length,
      activePackCount: loaded.packs.filter((pack) => isRecord(pack) && pack.status === "active").length,
    },
  };
}

export async function loadValidatedCatalog(repoRoot) {
  const { loaded, result } = await inspectCatalogSources(repoRoot, { ignoreGenerated: true });
  if (result.errors.length > 0) {
    throw new AggregateError(
      result.errors.map((message) => new Error(message)),
      `Catalog source validation failed with ${result.errors.length} issue(s)`,
    );
  }
  return loaded;
}

export async function validateCatalog(repoRoot, options = {}) {
  const root = path.resolve(repoRoot);
  const sourceOptions = options.checkGenerated === true ? { ignoreGenerated: true } : {};
  const { loaded, result } = await inspectCatalogSources(root, sourceOptions);
  if (options.checkGenerated === true && result.errors.length === 0) {
    result.errors.push(...await checkCatalogBytes(root, assembleCatalog(loaded)));
  }
  return result;
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const repoRoot = path.resolve(path.dirname(scriptFile), "..");
  const result = await validateCatalog(repoRoot);
  if (result.errors.length) {
    console.error(`Catalog validation failed with ${result.errors.length} issue(s):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Validated ${result.skillCount} catalog skills and ${result.packCount} packs successfully.`);
  }
}
