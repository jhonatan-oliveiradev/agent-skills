import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validatePlugin } from "./validate-plugin.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function pluginFixture({ skills = "./skills/", version = true } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-plugin-"));
  await mkdir(path.join(root, ".codex-plugin"), { recursive: true });
  await mkdir(path.join(root, ".agents", "plugins"), { recursive: true });
  await mkdir(path.join(root, "docs"));
  if (version) await writeFile(path.join(root, "VERSION"), "1.0.0-beta.1\n");
  await writeFile(path.join(root, "package.json"), JSON.stringify({ version: "1.0.0-beta.1" }));
  await writeFile(path.join(root, ".codex-plugin", "plugin.json"), JSON.stringify({
    name: "agent-skills-studio",
    version: "1.0.0-beta.1",
    description: "Skills",
    skills,
  }));
  await writeFile(path.join(root, ".agents", "plugins", "marketplace.json"), JSON.stringify({
    name: "agent-skills-studio",
    plugins: [{
      name: "agent-skills-studio",
      source: { source: "local", path: "./" },
      policy: { installation: "AVAILABLE", authentication: "NOT_REQUIRED" },
    }],
  }));
  return root;
}

test("accepts the repository plugin and synchronized version", async () => {
  assert.deepEqual(await validatePlugin(repositoryRoot), []);
});

for (const skills of ["./docs", "./skills/../docs"]) {
  test(`rejects non-canonical plugin skills path ${skills}`, async () => {
    const root = await pluginFixture({ skills });

    assert.equal(
      (await validatePlugin(root)).some((error) => error.includes("plugin skills path must be exactly ./skills/")),
      true,
    );
  });
}

test("preserves the outside-root validation contract for a traversal path", async () => {
  const root = await pluginFixture({ skills: "../outside" });

  assert.equal(
    (await validatePlugin(root)).some((error) => error.includes("skills must resolve inside the plugin root")),
    true,
  );
});

test("rejects a canonical skills symlink that escapes the repository", async (t) => {
  const root = await pluginFixture();
  const outside = await mkdtemp(path.join(tmpdir(), "agent-skills-plugin-outside-"));
  try {
    await symlink(outside, path.join(root, "skills"), "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  assert.equal(
    (await validatePlugin(root)).some((error) => error.includes("skills must resolve inside the plugin root")),
    true,
  );
});

test("reports a missing VERSION file as a structured validation error", async () => {
  const root = await pluginFixture({ version: false });

  const errors = await validatePlugin(root);
  assert.equal(errors.some((error) => error.includes("VERSION") && error.includes("unreadable")), true);
});
