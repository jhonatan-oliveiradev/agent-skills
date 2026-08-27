import assert from "node:assert/strict";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getCatalogPaths, inspectJsonDirectory, readJson } from "./catalog.mjs";

test("resolves catalog paths and discovers JSON records in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-discovery-"));
  const paths = getCatalogPaths(root);
  await mkdir(paths.skillsDirectory, { recursive: true });
  await writeFile(path.join(paths.skillsDirectory, "zeta.json"), "{}");
  await writeFile(path.join(paths.skillsDirectory, "alpha.json"), "{}");
  await writeFile(path.join(paths.skillsDirectory, "notes.md"), "ignored");

  assert.equal(paths.manifestFile, path.join(root, "catalog", "catalog.json"));
  assert.deepEqual((await inspectJsonDirectory(paths.skillsDirectory)).files.map(({ slug }) => slug), ["alpha", "zeta"]);
});

test("reports top-level symlinks without following them", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-symlink-"));
  const outside = await mkdtemp(path.join(tmpdir(), "catalog-outside-"));
  const directory = path.join(root, "catalog", "skills");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(outside, "linked.json"), "{}");
  try {
    await symlink(path.join(outside, "linked.json"), path.join(directory, "linked.json"));
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error?.code)) return context.skip("symlinks unavailable");
    throw error;
  }
  assert.deepEqual((await inspectJsonDirectory(directory)).symbolicLinks, ["linked.json"]);
});

test("returns a structured JSON parsing error", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-json-"));
  const file = path.join(root, "broken.json");
  await writeFile(file, "{");
  assert.deepEqual(await readJson(file), { value: null, error: `${file}: invalid JSON` });
});
