import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

test("Claude Code is a first-class skill compatibility surface", async () => {
  const schema = await readJson("catalog/schemas/skill.schema.json");
  const surfaceEnum = schema.$defs.compatibility.properties.surfaces.items.enum;

  assert.deepEqual(surfaceEnum, ["chatgpt", "codex", "claude-code"]);
});

test("every canonical skill declares Claude Code compatibility", async () => {
  const skillsDirectory = path.join(repoRoot, "catalog/skills");
  const skillFiles = (await readdir(skillsDirectory)).filter((file) => file.endsWith(".json")).sort();

  assert.equal(skillFiles.length, 54);

  for (const file of skillFiles) {
    const skill = JSON.parse(await readFile(path.join(skillsDirectory, file), "utf8"));
    assert.ok(
      skill.compatibility.surfaces.includes("claude-code"),
      `${file} must declare claude-code in compatibility.surfaces`,
    );
  }
});

test("generated catalog exposes Claude Code as a filterable surface", async () => {
  const catalog = await readJson("catalog/generated/catalog.json");

  assert.ok(catalog.filters.surfaces.includes("claude-code"));
});
