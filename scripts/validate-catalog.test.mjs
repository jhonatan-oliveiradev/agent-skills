import assert from "node:assert/strict";
import { mkdir, mkdtemp, rename, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateCatalog } from "./validate-catalog.mjs";
import { catalogFixture } from "./test-support/catalog-fixture.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("accepts complete bilingual catalog fixtures", async () => {
  const root = await catalogFixture();
  assert.deepEqual(await validateCatalog(root), {
    errors: [],
    skillCount: 2,
    packCount: 2,
    activePackCount: 1,
  });
});

test("checks generated drift only when explicitly requested", async () => {
  const root = await catalogFixture();
  assert.deepEqual((await validateCatalog(root)).errors, []);

  const generatedFile = path.join(root, "catalog", "generated", "catalog.json");
  await mkdir(path.dirname(generatedFile), { recursive: true });
  await writeFile(generatedFile, "{not-json\n");

  assert.deepEqual((await validateCatalog(root)).errors, ["catalog/generated/catalog.json: invalid JSON"]);
  assert.deepEqual((await validateCatalog(root, { checkGenerated: true })).errors, [
    "catalog/generated/catalog.json is stale; run npm run catalog:generate",
  ]);
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

test("rejects private data in nested non-JSON catalog files", async () => {
  const root = await catalogFixture();
  const notesDirectory = path.join(root, "catalog", "packs", "debug");
  await mkdir(notesDirectory, { recursive: true });
  await writeFile(path.join(notesDirectory, "notes.md"), "ghp_abcdefghijklmnopqrstuvwxyz");

  const { errors } = await validateCatalog(root);
  assert.equal(
    errors.includes("catalog/packs/debug/notes.md: forbidden private-data pattern"),
    true,
  );
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
    skillCount: 22,
    packCount: 6,
    activePackCount: 4,
  });
});
