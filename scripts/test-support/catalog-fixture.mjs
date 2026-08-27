import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const version = "1.0.0-beta.1";

function localizedSkill(name) {
  return {
    displayName: name,
    summary: `${name} summary`,
    primaryBenefit: `${name} primary benefit`,
    whenToUse: `Use ${name} for an appropriate workflow.`,
    whenNotToUse: `Do not use ${name} for an unrelated workflow.`,
    useCases: [`Plan with ${name}`, `Deliver with ${name}`],
    examplePrompts: [`Use ${name} for this task.`],
  };
}

function skillRecord(slug, packs = []) {
  return {
    $schema: "../schemas/skill.schema.json",
    slug,
    category: "meta",
    packs,
    maturity: "stable",
    difficulty: "beginner",
    featured: false,
    compatibility: {
      surfaces: ["chatgpt", "codex"],
      operatingSystems: ["linux", "macos", "windows"],
      installModes: ["plugin", "filesystem"],
    },
    tags: [slug],
    dependencies: [],
    relatedSkills: [],
    version,
    updatedAt: "2026-08-26",
    locales: {
      en: localizedSkill(`${slug} English`),
      "pt-BR": localizedSkill(`${slug} Português`),
    },
  };
}

function localizedPack(name) {
  return {
    name,
    summary: `${name} summary`,
    description: `${name} description`,
    outcomes: [`Complete the ${name} workflow`],
  };
}

function packRecord(slug, status, skills) {
  return {
    $schema: "../schemas/pack.schema.json",
    slug,
    status,
    featured: false,
    color: "violet",
    version,
    skills,
    locales: {
      en: localizedPack(`${slug} English`),
      "pt-BR": localizedPack(`${slug} Português`),
    },
  };
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export async function catalogFixture(options = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-validation-"));
  await Promise.all([
    mkdir(path.join(root, ".codex-plugin"), { recursive: true }),
    mkdir(path.join(root, "catalog", "skills"), { recursive: true }),
    mkdir(path.join(root, "catalog", "packs"), { recursive: true }),
    mkdir(path.join(root, "skills", "alpha"), { recursive: true }),
    mkdir(path.join(root, "skills", "beta"), { recursive: true }),
  ]);

  const alpha = skillRecord("alpha", ["starter"]);
  const beta = skillRecord("beta");
  const activePack = packRecord("starter", "active", ["alpha"]);
  const plannedPack = packRecord("future", "planned", []);
  options.mutateAlpha?.(alpha);
  options.mutateBeta?.(beta);
  options.mutateActivePack?.(activePack);
  options.mutatePlannedPack?.(plannedPack);

  const manifest = {
    $schema: "./schemas/catalog.schema.json",
    schemaVersion: 1,
    version: options.manifestVersion ?? version,
    defaultLocale: "en",
    locales: ["en", "pt-BR"],
  };
  options.mutateManifest?.(manifest);

  await Promise.all([
    writeJson(path.join(root, "catalog", "catalog.json"), manifest),
    writeJson(path.join(root, ".codex-plugin", "plugin.json"), { version }),
    writeJson(path.join(root, "package.json"), { version }),
    writeFile(path.join(root, "VERSION"), `${version}\n`),
    writeFile(path.join(root, "skills", "alpha", "SKILL.md"), "# Alpha\n"),
    writeFile(path.join(root, "skills", "beta", "SKILL.md"), "# Beta\n"),
    writeJson(path.join(root, "catalog", "packs", "starter.json"), activePack),
    writeJson(path.join(root, "catalog", "packs", "future.json"), plannedPack),
  ]);

  const records = { alpha, beta };
  for (const slug of options.creationOrder ?? ["alpha", "beta"]) {
    if (options.omitSkillRecord !== slug) {
      await writeJson(path.join(root, "catalog", "skills", `${slug}.json`), records[slug]);
    }
  }

  return root;
}
