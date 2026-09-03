import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generator = path.join(repositoryRoot, "scripts", "generate-skill-zips.mjs");

async function runGenerator(output) {
  try {
    await execFileAsync(process.execPath, [generator, "--output", output], {
      cwd: repositoryRoot,
    });
  } catch (error) {
    assert.fail(`ChatGPT skill ZIP generator must run successfully: ${error.message}`);
  }
}

test("generates one deterministic ChatGPT-ready ZIP bundle for every canonical skill", async () => {
  const output = await mkdtemp(path.join(tmpdir(), "agent-skills-chatgpt-zips-"));
  const version = (await readFile(path.join(repositoryRoot, "VERSION"), "utf8")).trim();
  const skillEntries = await readdir(path.join(repositoryRoot, "skills"), { withFileTypes: true });
  const skillNames = skillEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  await runGenerator(output);

  const zipNames = (await readdir(output)).filter((name) => name.endsWith(".zip")).sort();
  assert.equal(zipNames.length, skillNames.length);
  assert.deepEqual(
    zipNames,
    skillNames.map((name) => `${name}-${version}.zip`),
  );

  const representativePath = path.join(
    output,
    `mapping-existing-codebase-structure-${version}.zip`,
  );
  const first = await readFile(representativePath);

  assert.equal(first.readUInt32LE(0), 0x04034b50, "ZIP must start with a local file header");
  assert.equal(
    first.readUInt32LE(first.length - 22),
    0x06054b50,
    "ZIP must end with an empty-comment end-of-central-directory record",
  );

  const archiveText = first.toString("latin1");
  assert.match(archiveText, /SKILL\.md/);
  assert.match(archiveText, /references\/codegraph\.md/);

  await runGenerator(output);
  const second = await readFile(representativePath);
  assert.deepEqual(second, first, "re-running the generator must produce identical bytes");
});
