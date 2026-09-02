import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slugs = [
  "mapping-existing-codebase-structure",
  "tracing-code-execution-paths",
  "analyzing-change-blast-radius",
  "investigating-codebase-semantically",
  "planning-codebase-changes-with-evidence",
];

async function skill(slug) {
  return readFile(path.join(root, "skills", slug, "SKILL.md"), "utf8");
}

test("publishes five concise discovery-first Codebase Intelligence methods", async () => {
  for (const slug of slugs) {
    const source = await skill(slug);
    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.match(source, /observed/i);
    assert.match(source, /inferred/i);
    assert.match(source, /unresolved/i);
    assert.match(source, /fallback/i);
    assert.match(source, /stop|sufficien/i);
    assert.ok(source.length < 6500, `${slug} should remain focused and load on demand`);
  }
});

test("requires non-invasive runtime detection and progressive context expansion", async () => {
  const sources = await Promise.all(slugs.map(skill));
  const combined = sources.join("\n");
  assert.match(combined, /runtime.*available|available.*runtime/i);
  assert.match(combined, /do not install|never install/i);
  assert.match(combined, /do not.*codegraph init|never.*codegraph init/i);
  assert.match(combined, /narrow/i);
  assert.match(combined, /expand/i);
  assert.match(combined, /source/i);
  assert.match(combined, /location/i);
});

test("keeps neighboring ownership outside the five methods", async () => {
  assert.match(await skill("mapping-existing-codebase-structure"), /does not design|do not design/i);
  assert.match(await skill("tracing-code-execution-paths"), /root cause|systematic debugging/i);
  assert.match(await skill("analyzing-change-blast-radius"), /does not decide|do not decide/i);
  assert.match(await skill("investigating-codebase-semantically"), /textual match|false positive/i);
  const planning = await skill("planning-codebase-changes-with-evidence");
  assert.match(planning, /change evidence brief/i);
  assert.match(planning, /does not.*implement|do not.*implement/i);
  assert.match(planning, /Engineering Workflow|writing-plans/i);
});
