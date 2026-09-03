import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

test("documents ChatGPT skill ZIP upload and GitHub marketplace distribution", async () => {
  let source = "";
  try {
    source = await readFile(path.join(repositoryRoot, "docs", "chatgpt.md"), "utf8");
  } catch {
    assert.fail("docs/chatgpt.md must exist");
  }

  assert.match(source, /Plugins/i);
  assert.match(source, /Skills/i);
  assert.match(source, /\.zip/i);
  assert.match(source, /SKILL\.md/i);
  assert.match(source, /Upload from computer|Carregar do computador/i);
  assert.match(source, /Import marketplace/i);
  assert.match(source, new RegExp(repositoryUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(source, /Business|Enterprise|Healthcare|Edu/);
});

test("keeps the native OpenAI plugin skill-only and marketplace-importable", async () => {
  const plugin = JSON.parse(
    await readFile(path.join(repositoryRoot, ".codex-plugin", "plugin.json"), "utf8"),
  );
  const marketplace = JSON.parse(
    await readFile(path.join(repositoryRoot, ".agents", "plugins", "marketplace.json"), "utf8"),
  );

  assert.equal(plugin.skills, "./skills/");
  assert.equal(plugin.apps, undefined);
  assert.equal(plugin.mcpServers, undefined);
  assert.equal(marketplace.plugins.length, 1);
  assert.deepEqual(marketplace.plugins[0].source, { source: "local", path: "./" });
});
