import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { validatePlugin } from "./validate-plugin.mjs";

const repositoryRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

test("accepts the repository plugin and synchronized version", async () => {
  assert.deepEqual(await validatePlugin(repositoryRoot), []);
});

test("rejects a skills path outside the plugin root", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-plugin-"));
  await mkdir(path.join(root, ".codex-plugin"), { recursive: true });
  await mkdir(path.join(root, ".agents", "plugins"), { recursive: true });
  await writeFile(path.join(root, "VERSION"), "1.0.0-beta.1\n");
  await writeFile(path.join(root, "package.json"), JSON.stringify({ version: "1.0.0-beta.1" }));
  await writeFile(path.join(root, ".codex-plugin", "plugin.json"), JSON.stringify({
    name: "agent-skills-studio",
    version: "1.0.0-beta.1",
    description: "Skills",
    skills: "../outside",
  }));
  await writeFile(path.join(root, ".agents", "plugins", "marketplace.json"), JSON.stringify({
    name: "agent-skills-studio",
    plugins: [{
      name: "agent-skills-studio",
      source: { source: "local", path: "./" },
      policy: { installation: "AVAILABLE", authentication: "NOT_REQUIRED" },
    }],
  }));

  assert.equal(
    (await validatePlugin(root)).some((error) => error.includes("skills must resolve inside the plugin root")),
    true,
  );
});
