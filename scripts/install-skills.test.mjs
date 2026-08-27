import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, mkdir, readFile, readdir, rename, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import * as installer from "./install-skills.mjs";
import { catalogFixture } from "./test-support/catalog-fixture.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { installSkills } = installer;

async function repositoryFixture() {
  const root = await catalogFixture({
    mutateAlpha(record) {
      record.packs = ["frontend-product"];
    },
    mutateBeta(record) {
      record.packs = ["frontend-product", "motion"];
    },
    mutateActivePack(pack) {
      pack.slug = "frontend-product";
      pack.skills = ["beta", "alpha"];
    },
    mutatePlannedPack(pack) {
      pack.slug = "backend-data";
    },
  });

  await rename(
    path.join(root, "catalog", "packs", "starter.json"),
    path.join(root, "catalog", "packs", "frontend-product.json"),
  );
  await rename(
    path.join(root, "catalog", "packs", "future.json"),
    path.join(root, "catalog", "packs", "backend-data.json"),
  );

  const betaRecord = JSON.parse(await readFile(path.join(root, "catalog", "skills", "beta.json"), "utf8"));
  const gammaRecord = {
    ...betaRecord,
    slug: "gamma",
    packs: ["motion"],
    tags: ["gamma"],
  };
  const frontendPack = JSON.parse(
    await readFile(path.join(root, "catalog", "packs", "frontend-product.json"), "utf8"),
  );
  const motionPack = {
    ...frontendPack,
    slug: "motion",
    skills: ["gamma", "beta"],
  };

  for (const name of ["alpha", "beta", "gamma"]) {
    const directory = path.join(root, "skills", name);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "SKILL.md"), `---\nname: ${name}\ndescription: Use when ${name} applies.\n---\n`);
  }
  await writeFile(
    path.join(root, "catalog", "skills", "gamma.json"),
    `${JSON.stringify(gammaRecord, null, 2)}\n`,
  );
  await writeFile(
    path.join(root, "catalog", "packs", "motion.json"),
    `${JSON.stringify(motionPack, null, 2)}\n`,
  );
  return root;
}

test("installs all skills and removes stale contents", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-target-"));
  await mkdir(path.join(destination, "alpha"), { recursive: true });
  await writeFile(path.join(destination, "alpha", "stale.txt"), "remove me");
  await writeFile(path.join(destination, "unrelated.txt"), "keep me");

  assert.deepEqual(await installSkills({ repoRoot, destination }), ["alpha", "beta", "gamma"]);
  await assert.rejects(readFile(path.join(destination, "alpha", "stale.txt")), { code: "ENOENT" });
  assert.match(await readFile(path.join(destination, "alpha", "SKILL.md"), "utf8"), /name: alpha/);
  assert.equal(await readFile(path.join(destination, "unrelated.txt"), "utf8"), "keep me");
  assert.deepEqual((await readdir(destination)).sort(), ["alpha", "beta", "gamma", "unrelated.txt"]);
});

test("rejects an unknown skill before copying selected skills", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-selection-"));
  await writeFile(path.join(destination, "preserve.txt"), "keep me");

  await assert.rejects(
    installSkills({ repoRoot, destination, names: ["beta", "missing"] }),
    /Unknown skill: missing/,
  );
  assert.equal(await readFile(path.join(destination, "preserve.txt"), "utf8"), "keep me");
  await assert.rejects(readFile(path.join(destination, "beta", "SKILL.md")), { code: "ENOENT" });
});

test("deduplicates and sorts explicit skill names", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-sorted-"));

  assert.deepEqual(
    await installSkills({ repoRoot, destination, names: ["beta", "alpha", "beta"] }),
    ["alpha", "beta"],
  );
});

test("resolves pack members before lexical explicit skills and preserves first occurrence", () => {
  const availableSkills = [{ name: "alpha" }, { name: "beta" }, { name: "gamma" }];
  const packs = [
    { slug: "frontend-product", status: "active", skills: ["beta", "alpha"] },
    { slug: "motion", status: "active", skills: ["gamma", "beta"] },
  ];

  assert.deepEqual(installer.resolveInstallSelection({
    availableSkills,
    packs,
    packNames: ["motion", "motion", "frontend-product"],
    names: ["gamma", "alpha", "alpha"],
  }), ["gamma", "beta", "alpha"]);
});

test("installs an active pack in manifest order", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-"));

  assert.deepEqual(await installSkills({ repoRoot, destination, packs: ["frontend-product"] }), ["beta", "alpha"]);
  assert.match(await readFile(path.join(destination, "alpha", "SKILL.md"), "utf8"), /name: alpha/);
});

test("installs the deterministic union of packs and explicit skills", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-union-"));

  assert.deepEqual(
    await installSkills({ repoRoot, destination, packs: ["motion", "frontend-product"], names: ["gamma", "alpha"] }),
    ["gamma", "beta", "alpha"],
  );
});

test("rejects unknown and planned packs before destination mutation", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-reject-"));
  await writeFile(path.join(destination, "sentinel.txt"), "preserve");

  await assert.rejects(installSkills({ repoRoot, destination, packs: ["missing"] }), /Unknown pack: missing/);
  await assert.rejects(
    installSkills({ repoRoot, destination, packs: ["backend-data"] }),
    /Pack is not installable: backend-data/,
  );
  assert.equal(await readFile(path.join(destination, "sentinel.txt"), "utf8"), "preserve");
  assert.deepEqual(await readdir(destination), ["sentinel.txt"]);
});

test("rejects unknown and planned packs without creating nonexistent destinations", async () => {
  const repoRoot = await repositoryFixture();
  const parent = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-absent-"));
  const unknownDestination = path.join(parent, "unknown-target");
  const plannedDestination = path.join(parent, "planned-target");

  await assert.rejects(
    installSkills({ repoRoot, destination: unknownDestination, packs: ["missing"] }),
    /Unknown pack: missing/,
  );
  await assert.rejects(access(unknownDestination), { code: "ENOENT" });

  await assert.rejects(
    installSkills({ repoRoot, destination: plannedDestination, packs: ["backend-data"] }),
    /Pack is not installable: backend-data/,
  );
  await assert.rejects(access(plannedDestination), { code: "ENOENT" });
});

test("rejects invalid pack catalog sources before destination mutation", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-invalid-catalog-"));
  await writeFile(path.join(destination, "sentinel.txt"), "preserve");
  await writeFile(path.join(repoRoot, "catalog", "packs", "motion.json"), "{not-json\n");

  await assert.rejects(
    installSkills({ repoRoot, destination, packs: ["motion"] }),
    (error) => error instanceof AggregateError
      && error.errors.some((sourceError) => /catalog\/packs\/motion\.json: invalid JSON/.test(sourceError.message)),
  );
  assert.deepEqual(await readdir(destination), ["sentinel.txt"]);
});

test("Node CLI installs a repeated pack selection without unrelated skills", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-node-cli-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--destination",
    destination,
    "--pack",
    "motion",
    "--pack",
    "motion",
  ]);

  assert.match(
    await readFile(path.join(destination, "craft-premium-motion", "SKILL.md"), "utf8"),
    /name: craft-premium-motion/,
  );
  assert.match(
    await readFile(path.join(destination, "reconstructing-images-as-threejs", "SKILL.md"), "utf8"),
    /name: reconstructing-images-as-threejs/,
  );
  await assert.rejects(readFile(path.join(destination, "designing-action-combat", "SKILL.md")), { code: "ENOENT" });
});

test("Bash wrapper installs a repeated pack selection without unrelated skills", {
  skip: process.platform === "win32" ? "Windows cannot directly execute the Bash wrapper" : false,
}, async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-wrapper-"));

  await execFileAsync(path.join(repositoryRoot, "install.sh"), [
    "--destination",
    destination,
    "--pack",
    "motion",
    "--pack",
    "motion",
  ]);

  assert.match(
    await readFile(path.join(destination, "craft-premium-motion", "SKILL.md"), "utf8"),
    /name: craft-premium-motion/,
  );
  assert.match(
    await readFile(path.join(destination, "reconstructing-images-as-threejs", "SKILL.md"), "utf8"),
    /name: reconstructing-images-as-threejs/,
  );
  await assert.rejects(readFile(path.join(destination, "designing-action-combat", "SKILL.md")), { code: "ENOENT" });
});

test("rejects the canonical source directory as a destination without deleting source files", async () => {
  const repoRoot = await repositoryFixture();
  const sourceFile = path.join(repoRoot, "skills", "alpha", "SKILL.md");
  const sourceBefore = await readFile(sourceFile, "utf8");

  await assert.rejects(
    installSkills({ repoRoot, destination: path.join(repoRoot, "skills") }),
    /destination overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceFile, "utf8"), sourceBefore);
});

test("rejects a destination nested inside the canonical source directory", async () => {
  const repoRoot = await repositoryFixture();
  const sourceFile = path.join(repoRoot, "skills", "alpha", "SKILL.md");
  const sourceBefore = await readFile(sourceFile, "utf8");

  await assert.rejects(
    installSkills({ repoRoot, destination: path.join(repoRoot, "skills", "installed") }),
    /destination overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceFile, "utf8"), sourceBefore);
});

test("rejects a symlink-resolved destination that overlaps the source directory", async (t) => {
  const repoRoot = await repositoryFixture();
  const destinationParent = await mkdtemp(path.join(tmpdir(), "agent-skills-install-linked-target-"));
  const destination = path.join(destinationParent, "skills-link");
  try {
    await symlink(path.join(repoRoot, "skills"), destination, "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }
  const sourceFile = path.join(repoRoot, "skills", "alpha", "SKILL.md");
  const sourceBefore = await readFile(sourceFile, "utf8");

  await assert.rejects(
    installSkills({ repoRoot, destination }),
    /destination overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceFile, "utf8"), sourceBefore);
});

test("resolves a missing destination through its nearest existing symlink ancestor", async (t) => {
  const repoRoot = await repositoryFixture();
  const destinationParent = await mkdtemp(path.join(tmpdir(), "agent-skills-install-linked-parent-"));
  const linkedParent = path.join(destinationParent, "skills-link");
  try {
    await symlink(path.join(repoRoot, "skills"), linkedParent, "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }
  const sourceFile = path.join(repoRoot, "skills", "alpha", "SKILL.md");
  const sourceBefore = await readFile(sourceFile, "utf8");

  await assert.rejects(
    installSkills({ repoRoot, destination: path.join(linkedParent, "not-created") }),
    /destination overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceFile, "utf8"), sourceBefore);
});

test("preserves an installed skill when staged source validation fails", async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), "agent-skills-install-invalid-source-"));
  await mkdir(path.join(repoRoot, "skills", "alpha", "SKILL.md"), { recursive: true });
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-preserve-target-"));
  await mkdir(path.join(destination, "alpha"));
  const installedSkill = path.join(destination, "alpha", "SKILL.md");
  await writeFile(installedSkill, "existing installation");

  await assert.rejects(
    installSkills({ repoRoot, destination }),
    /staged skill SKILL\.md must be a regular file/i,
  );
  assert.equal(await readFile(installedSkill, "utf8"), "existing installation");
  assert.deepEqual(await readdir(destination), ["alpha"]);
});

test("prevalidates every derived target before mutating any selected installation", async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), "agent-skills-install-target-collision-"));
  for (const name of ["alpha", "skills"]) {
    const directory = path.join(repoRoot, "skills", name);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "SKILL.md"), `---\nname: ${name}\ndescription: Use when ${name} applies.\n---\n`);
  }
  const sourceSentinel = path.join(repoRoot, "skills", "source-sentinel.txt");
  await writeFile(sourceSentinel, "preserve source tree");
  await mkdir(path.join(repoRoot, "alpha"));
  const installedSentinel = path.join(repoRoot, "alpha", "installed-sentinel.txt");
  await writeFile(installedSentinel, "preserve installed alpha");

  await assert.rejects(
    installSkills({ repoRoot, destination: repoRoot }),
    /target overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceSentinel, "utf8"), "preserve source tree");
  assert.equal(await readFile(installedSentinel, "utf8"), "preserve installed alpha");
  assert.match(await readFile(path.join(repoRoot, "skills", "skills", "SKILL.md"), "utf8"), /name: skills/);
});

test("rejects symlink-resolved derived targets equal to or containing the source tree", async (t) => {
  const repoRoot = await repositoryFixture();
  const equalDestination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-linked-derived-target-"));
  const sourceSentinel = path.join(repoRoot, "skills", "source-sentinel.txt");
  await writeFile(sourceSentinel, "preserve source tree");
  try {
    await symlink(path.join(repoRoot, "skills"), path.join(equalDestination, "alpha"), "dir");
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error.code)) {
      t.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  await assert.rejects(
    installSkills({ repoRoot, destination: equalDestination, names: ["alpha"] }),
    /target overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceSentinel, "utf8"), "preserve source tree");

  const containingDestination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-linked-derived-parent-"));
  await symlink(repoRoot, path.join(containingDestination, "beta"), "dir");
  await assert.rejects(
    installSkills({ repoRoot, destination: containingDestination, names: ["beta"] }),
    /target overlaps the source skills directory/i,
  );
  assert.equal(await readFile(sourceSentinel, "utf8"), "preserve source tree");
});

test("reports an absent source collection without leaking a realpath error", async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), "agent-skills-install-empty-source-"));
  const destination = path.join(repoRoot, "target");

  await assert.rejects(
    installSkills({ repoRoot, destination }),
    /No skill directories found/,
  );
});
