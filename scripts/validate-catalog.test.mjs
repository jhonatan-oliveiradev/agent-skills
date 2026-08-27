import assert from "node:assert/strict";
import { mkdir, mkdtemp, rename, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateCatalog } from "./validate-catalog.mjs";

const version = "1.0.0-beta.1";
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function localizedSkill(name) {
  return {
    displayName: name,
    summary: `${name} summary`,
    primaryBenefit: `${name} primary benefit`,
    whenToUse: `Use ${name} for an appropriate workflow.`,
    whenNotToUse: `Do not use ${name} for an unrelated workflow.`,
    useCases: [`Plan with ${name}`, `Deliver with ${name}`],
    examplePrompts: [`Use ${name} for this task.`],
  };
}

function skillRecord(slug, packs = []) {
  return {
    $schema: "../schemas/skill.schema.json",
    slug,
    category: "meta",
    packs,
    maturity: "stable",
    difficulty: "beginner",
    featured: false,
    compatibility: {
      surfaces: ["chatgpt", "codex"],
      operatingSystems: ["linux", "macos", "windows"],
      installModes: ["plugin", "filesystem"],
    },
    tags: [slug],
    dependencies: [],
    relatedSkills: [],
    version,
    updatedAt: "2026-08-26",
    locales: {
      en: localizedSkill(`${slug} English`),
      "pt-BR": localizedSkill(`${slug} Português`),
    },
  };
}

function localizedPack(name) {
  return {
    name,
    summary: `${name} summary`,
    description: `${name} description`,
    outcomes: [`Complete the ${name} workflow`],
  };
}

function packRecord(slug, status, skills) {
  return {
    $schema: "../schemas/pack.schema.json",
    slug,
    status,
    featured: false,
    color: "violet",
    version,
    skills,
    locales: {
      en: localizedPack(`${slug} English`),
      "pt-BR": localizedPack(`${slug} Português`),
    },
  };
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function catalogFixture(options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "catalog-validation-"));
  await Promise.all([
    mkdir(path.join(root, ".codex-plugin"), { recursive: true }),
    mkdir(path.join(root, "catalog", "skills"), { recursive: true }),
    mkdir(path.join(root, "catalog", "packs"), { recursive: true }),
    mkdir(path.join(root, "skills", "alpha"), { recursive: true }),
    mkdir(path.join(root, "skills", "beta"), { recursive: true }),
  ]);

  const alpha = skillRecord("alpha", ["starter"]);
  const beta = skillRecord("beta");
  const activePack = packRecord("starter", "active", ["alpha"]);
  const plannedPack = packRecord("future", "planned", []);
  options.mutateAlpha?.(alpha);
  options.mutateActivePack?.(activePack);
  options.mutatePlannedPack?.(plannedPack);

  await Promise.all([
    writeJson(path.join(root, "catalog", "catalog.json"), {
      $schema: "./schemas/catalog.schema.json",
      schemaVersion: 1,
      version: options.manifestVersion ?? version,
      defaultLocale: "en",
      locales: ["en", "pt-BR"],
    }),
    writeJson(path.join(root, ".codex-plugin", "plugin.json"), { version }),
    writeJson(path.join(root, "package.json"), { version }),
    writeFile(path.join(root, "VERSION"), `${version}\n`),
    writeFile(path.join(root, "skills", "alpha", "SKILL.md"), "# Alpha\n"),
    writeFile(path.join(root, "skills", "beta", "SKILL.md"), "# Beta\n"),
    writeJson(path.join(root, "catalog", "packs", "starter.json"), activePack),
    writeJson(path.join(root, "catalog", "packs", "future.json"), plannedPack),
    ...(options.omitSkillRecord === "alpha"
      ? []
      : [writeJson(path.join(root, "catalog", "skills", "alpha.json"), alpha)]),
    ...(options.omitSkillRecord === "beta"
      ? []
      : [writeJson(path.join(root, "catalog", "skills", "beta.json"), beta)]),
  ]);

  return root;
}

test("accepts complete bilingual catalog fixtures", async () => {
  const root = await catalogFixture();
  assert.deepEqual(await validateCatalog(root), {
    errors: [],
    skillCount: 2,
    packCount: 2,
    activePackCount: 1,
  });
});

test("reports missing metadata, incomplete locales, and orphan relations", async () => {
  const root = await catalogFixture({
    omitSkillRecord: "beta",
    mutateAlpha(record) {
      delete record.locales["pt-BR"].primaryBenefit;
      record.relatedSkills = ["missing"];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("beta: missing catalog metadata")), true);
  assert.equal(errors.some((error) => error.includes("alpha: pt-BR.primaryBenefit is required")), true);
  assert.equal(errors.some((error) => error.includes("alpha: related skill does not exist: missing")), true);
});

test("enforces pack status and bidirectional membership", async () => {
  const root = await catalogFixture({
    mutateActivePack(pack) {
      pack.skills = [];
    },
    mutatePlannedPack(pack) {
      pack.skills = ["beta"];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("active packs must contain at least one skill")), true);
  assert.equal(errors.some((error) => error.includes("planned packs must not contain skills")), true);
});

test("rejects version drift, private data, and catalog symlinks", async (context) => {
  const root = await catalogFixture({ manifestVersion: "9.9.9" });
  await writeFile(path.join(root, "catalog", "skills", "alpha.json"), "ghp_abcdefghijklmnopqrstuvwxyz");
  const outside = await mkdtemp(path.join(os.tmpdir(), "catalog-link-"));
  try {
    await symlink(outside, path.join(root, "catalog", "packs", "linked.json"));
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error?.code)) context.diagnostic("symlink assertion skipped");
    else throw error;
  }
  const { errors } = await validateCatalog(root);
  assert.equal(
    errors.some((error) => error.includes("catalog, plugin, package, and VERSION values must match")),
    true,
  );
  assert.equal(errors.some((error) => error.includes("forbidden private-data pattern")), true);
});

test("reports missing metadata with a repository-relative source filename", async () => {
  const root = await catalogFixture({ omitSkillRecord: "beta" });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.includes("skills/beta/SKILL.md: beta: missing catalog metadata"), true);
});

test("does not traverse a catalog root symlink", async (context) => {
  const root = await catalogFixture();
  const outside = await mkdtemp(path.join(os.tmpdir(), "catalog-root-link-"));
  const target = path.join(outside, "catalog");
  await rename(path.join(root, "catalog"), target);
  try {
    await symlink(target, path.join(root, "catalog"), "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error?.code)) {
      context.skip("symlink assertion skipped");
      return;
    }
    throw error;
  }

  const result = await validateCatalog(root);
  assert.equal(result.errors.includes("catalog: symbolic links are not allowed"), true);
  assert.equal(result.skillCount, 0);
  assert.equal(result.packCount, 0);
});

test("rejects non-public dependency URLs", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.dependencies = [{ name: "internal-tool", type: "tool", required: false, url: "https://intranet" }];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("dependencies[0].url must be a public HTTPS URL")), true);
});

test("rejects IPv4-mapped loopback dependency URLs", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.dependencies = [
        { name: "loopback-service", type: "service", required: false, url: "https://[::ffff:127.0.0.1]" },
      ];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("dependencies[0].url must be a public HTTPS URL")), true);
});

test("rejects documentation-range IPv4 dependency URLs", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.dependencies = [
        { name: "example-service", type: "service", required: false, url: "https://192.0.2.1" },
      ];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("dependencies[0].url must be a public HTTPS URL")), true);
});

test("rejects reserved DNS suffix dependency URLs", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.dependencies = [
        { name: "invalid-service", type: "service", required: false, url: "https://service.invalid" },
      ];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("dependencies[0].url must be a public HTTPS URL")), true);
});

test("reports malformed JSON in catalog schema sources", async () => {
  const root = await catalogFixture();
  const schemas = path.join(root, "catalog", "schemas");
  await mkdir(schemas, { recursive: true });
  await writeFile(path.join(schemas, "skill.schema.json"), "{not-json\n");

  const { errors } = await validateCatalog(root);
  assert.equal(errors.includes("catalog/schemas/skill.schema.json: invalid JSON"), true);
});

test("rejects duplicate dependency names", async () => {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.dependencies = [
        { name: "shared-tool", type: "tool", required: true },
        { name: "shared-tool", type: "tool", required: false },
      ];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("duplicate dependency: shared-tool")), true);
});

test("validates all real catalog records and packs", async () => {
  assert.deepEqual(await validateCatalog(repositoryRoot), {
    errors: [],
    skillCount: 18,
    packCount: 6,
    activePackCount: 3,
  });
});
