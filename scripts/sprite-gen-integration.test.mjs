import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("publishes Sprite Gen as a bundled, attributed Game Development method", async () => {
  const [skill, runtime, workflow, catalog, pack, license, notice] = await Promise.all([
    readFile(path.join(repositoryRoot, "skills/sprite-gen/SKILL.md"), "utf8"),
    readFile(path.join(repositoryRoot, "skills/sprite-gen/pyproject.toml"), "utf8"),
    readFile(path.join(repositoryRoot, "skills/sprite-gen/sprite_gen/workflow/catalog.py"), "utf8"),
    readFile(path.join(repositoryRoot, "catalog/skills/sprite-gen.json"), "utf8").then(JSON.parse),
    readFile(path.join(repositoryRoot, "catalog/packs/game-development.json"), "utf8").then(JSON.parse),
    readFile(path.join(repositoryRoot, "skills/sprite-gen/LICENSE"), "utf8"),
    readFile(path.join(repositoryRoot, "skills/sprite-gen/NOTICE"), "utf8"),
  ]);

  assert.match(skill, /^name: sprite-gen$/m);
  assert.match(skill, /upstream-version: "2\.1\.1"/);
  assert.match(skill, /aldegad\/sprite-gen/);
  assert.match(runtime, /^version = "2\.1\.1"$/m);
  assert.match(workflow, /Should the image be created with GPT or Grok\?/);
  assert.doesNotMatch(workflow, /[가-힣]/);
  assert.match(license, /Apache License/);
  assert.match(notice, /sprite-gen/i);
  assert.equal(catalog.maturity, "beta");
  assert.equal(catalog.featured, true);
  assert.equal(catalog.dependencies.some(({ name, required }) => name === "Python 3.10+" && required), true);
  assert.deepEqual(
    pack.skills.filter((slug) => slug === "creating-character-sprite-pipelines" || slug === "sprite-gen"),
    ["creating-character-sprite-pipelines", "sprite-gen"],
  );
});

test("installs the Sprite Gen runtime through the canonical selective installer", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-sprite-gen-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts/install-skills.mjs"),
    "--destination",
    destination,
    "--skill",
    "sprite-gen",
  ]);

  const installed = path.join(destination, "sprite-gen");
  await Promise.all([
    access(path.join(installed, "SKILL.md")),
    access(path.join(installed, "pyproject.toml")),
    access(path.join(installed, "sprite_gen/cli.py")),
    access(path.join(installed, "sprite_gen/serve/curator/index.html")),
    access(path.join(installed, "docs/engine-export.md")),
    access(path.join(installed, "LICENSE")),
    access(path.join(installed, "NOTICE")),
  ]);
});
