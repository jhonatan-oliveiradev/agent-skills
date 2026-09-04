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
const generator = path.join(repositoryRoot, "scripts", "generate-pack-zips.mjs");

async function runGenerator(output) {
  try {
    await execFileAsync(process.execPath, [generator, "--output", output], {
      cwd: repositoryRoot,
    });
  } catch (error) {
    assert.fail(`Pack ZIP generator must run successfully: ${error.message}`);
  }
}

function readStoredZipEntries(buffer) {
  const entries = [];
  let offset = 0;

  while (offset + 4 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const size = buffer.readUInt32LE(offset + 18);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + size;

    entries.push({
      name: buffer.subarray(nameStart, nameEnd).toString("utf8"),
      data: buffer.subarray(dataStart, dataEnd),
    });
    offset = dataEnd;
  }

  return entries;
}

test("generates one deterministic bundle for every active pack while preserving independent Skill ZIPs", async () => {
  const output = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-zips-"));
  const version = (await readFile(path.join(repositoryRoot, "VERSION"), "utf8")).trim();
  const packFiles = (await readdir(path.join(repositoryRoot, "catalog", "packs")))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const packs = [];

  for (const fileName of packFiles) {
    const pack = JSON.parse(
      await readFile(path.join(repositoryRoot, "catalog", "packs", fileName), "utf8"),
    );
    if (pack.status === "active") packs.push(pack);
  }

  await runGenerator(output);

  const zipNames = (await readdir(output)).filter((name) => name.endsWith(".zip")).sort();
  assert.deepEqual(
    zipNames,
    packs.map((pack) => `agent-skills-${pack.slug}-${version}.zip`).sort(),
  );

  const designBrand = packs.find((pack) => pack.slug === "design-brand");
  assert.ok(designBrand, "design-brand must remain an active representative pack");

  const representativePath = path.join(
    output,
    `agent-skills-design-brand-${version}.zip`,
  );
  const first = await readFile(representativePath);

  assert.equal(first.readUInt32LE(0), 0x04034b50, "bundle must start with a ZIP local header");
  assert.equal(
    first.readUInt32LE(first.length - 22),
    0x06054b50,
    "bundle must end with an empty-comment end-of-central-directory record",
  );

  const entries = readStoredZipEntries(first);
  assert.deepEqual(
    entries.map((entry) => entry.name),
    [
      "README.txt",
      ...designBrand.skills.map((skill) => `${skill}-${version}.zip`),
    ],
    "bundle membership and order must come directly from the canonical pack manifest",
  );

  const readme = entries.find((entry) => entry.name === "README.txt")?.data.toString("utf8");
  assert.match(readme ?? "", /independent Skill ZIPs/i);
  assert.match(readme ?? "", /upload each Skill ZIP separately/i);

  for (const skill of designBrand.skills) {
    const nested = entries.find((entry) => entry.name === `${skill}-${version}.zip`);
    assert.ok(nested, `${skill} must be present as an independent ZIP`);
    assert.equal(nested.data.readUInt32LE(0), 0x04034b50, `${skill} must remain a valid ZIP`);
    assert.match(nested.data.toString("latin1"), /SKILL\.md/);
  }

  assert.equal(
    entries.some((entry) => entry.name.startsWith("writing-conversion-copy-")),
    false,
    "the bundle must not include skills outside canonical pack membership",
  );

  await runGenerator(output);
  const second = await readFile(representativePath);
  assert.deepEqual(second, first, "re-running the generator must produce identical bundle bytes");
});
