import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

test("RC1 readiness matrix covers the four public Beta surfaces", async () => {
  const matrix = await readJson("release/rc1-readiness.json");

  assert.equal(matrix.schemaVersion, 1);
  assert.equal(matrix.targetVersion, "1.0.0-rc.1");
  assert.deepEqual(matrix.frozenCounts, { skills: 49, packs: 10 });
  assert.deepEqual(matrix.surfaces.map((surface) => surface.id), ["plugin", "catalog", "installers", "microsite"]);

  for (const surface of matrix.surfaces) {
    assert.ok(Array.isArray(surface.blockingGates) && surface.blockingGates.length > 0, `${surface.id}: missing blocking gates`);
    assert.ok(Array.isArray(surface.evidence) && surface.evidence.length > 0, `${surface.id}: missing repository evidence`);
    assert.ok(Array.isArray(surface.knownLimitations), `${surface.id}: knownLimitations must be an array`);
  }
});

test("RC1 readiness freezes the current catalog at 49 skills and 10 active packs", async () => {
  const catalog = await readJson("catalog/generated/catalog.json");

  assert.equal(catalog.counts.skills, 49);
  assert.deepEqual(catalog.counts.packs, { total: 10, active: 10, planned: 0 });
});

test("project-level version owners are synchronized at the RC1 candidate", async () => {
  const version = (await readText("VERSION")).trim();
  const rootPackage = await readJson("package.json");
  const plugin = await readJson(".codex-plugin/plugin.json");
  const catalogManifest = await readJson("catalog/catalog.json");
  const webPackage = await readJson("apps/web/package.json");

  assert.equal(version, "1.0.0-rc.1");
  assert.equal(rootPackage.version, version);
  assert.equal(plugin.version, version);
  assert.equal(catalogManifest.version, version);
  assert.equal(webPackage.version, version);
});

test("current public release copy does not advertise obsolete beta-era counts or branches", async () => {
  const readme = await readText("README.md");
  const messages = await readText("apps/web/src/lib/messages.ts");

  assert.doesNotMatch(readme, /feat\/agent-skills-studio-v1/);
  assert.doesNotMatch(messages, /18 skills ready to use/i);
  assert.doesNotMatch(messages, /Three installable collections/i);
});

test("root package description reflects the current Studio breadth", async () => {
  const rootPackage = await readJson("package.json");

  assert.match(rootPackage.description, /security/i);
  assert.match(rootPackage.description, /writing/i);
});

test("Stable promotion policy records satisfied real-use thresholds", async () => {
  const matrix = await readJson("release/stable-readiness.json");

  assert.equal(matrix.schemaVersion, 2);
  assert.equal(matrix.candidateVersion, "1.0.0-rc.1");
  assert.equal(matrix.targetVersion, "1.0.0");
  assert.equal(matrix.status, "ready-for-stable-review");
  assert.deepEqual(matrix.minimums, {
    realUseCases: 3,
    distinctProjects: 2,
    activePacksRepresented: 3,
  });
  assert.deepEqual(matrix.observed, {
    realUseCases: 3,
    distinctProjects: 3,
    activePacksRepresented: 4,
  });
});

test("Stable promotion policy accepts real ChatGPT distribution and has evidence for every public surface", async () => {
  const matrix = await readJson("release/stable-readiness.json");

  assert.deepEqual(matrix.surfaces.map((surface) => surface.id), [
    "chatgpt-distribution",
    "catalog",
    "installers",
    "microsite",
  ]);

  const chatgptDistribution = matrix.surfaces.find(
    (surface) => surface.id === "chatgpt-distribution",
  );
  assert.deepEqual(chatgptDistribution.acceptedModes, [
    "direct-skill-upload",
    "marketplace-plugin",
  ]);
  assert.equal(chatgptDistribution.validatedMode, "direct-skill-upload");

  for (const surface of matrix.surfaces) {
    assert.ok(Array.isArray(surface.realUseEvidence), `${surface.id}: realUseEvidence must be an array`);
    assert.ok(surface.realUseEvidence.includes("rocket-editorial-error-boundary"), `${surface.id}: missing Rocket real-use evidence`);
    assert.equal(surface.stableReady, true, `${surface.id}: evidence should satisfy Stable readiness`);
  }
});
