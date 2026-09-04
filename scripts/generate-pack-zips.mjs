import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSkillZipBuffer, createStoredZip } from "./generate-skill-zips.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "..");
const defaultOutput = path.join(repositoryRoot, "apps", "web", "public", "downloads", "packs");

function buildReadme(pack, version) {
  const members = pack.skills.map((skill, index) => `${String(index + 1).padStart(2, "0")}. ${skill}-${version}.zip`);

  return [
    "Agent Skills Studio — Pack bundle",
    "",
    `Pack: ${pack.slug}`,
    `Version: ${version}`,
    `Skills: ${pack.skills.length}`,
    "",
    "This bundle contains independent Skill ZIPs. A pack is a distribution grouping, not one monolithic Skill.",
    "For ChatGPT, extract this bundle and upload each Skill ZIP separately.",
    "For filesystem-based runtimes, you may instead use the repository installer with --pack.",
    "",
    "Members (canonical pack order):",
    ...members,
    "",
    "PT-BR",
    "Este pacote contém ZIPs de skills independentes. O pack é um agrupamento de distribuição, não uma skill monolítica.",
    "No ChatGPT, extraia este pacote e envie cada ZIP de skill separadamente.",
    "Para runtimes baseados em filesystem, você também pode usar o instalador do repositório com --pack.",
    "",
  ].join("\n");
}

async function readActivePacks(repoRoot) {
  const packsRoot = path.join(repoRoot, "catalog", "packs");
  const files = (await readdir(packsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const packs = [];

  for (const fileName of files) {
    const pack = JSON.parse(await readFile(path.join(packsRoot, fileName), "utf8"));
    if (pack.status === "active") packs.push(pack);
  }

  return packs;
}

export async function generatePackZips({ repoRoot = repositoryRoot, output = defaultOutput } = {}) {
  const version = (await readFile(path.join(repoRoot, "VERSION"), "utf8")).trim();
  const skillsRoot = path.join(repoRoot, "skills");
  const packs = await readActivePacks(repoRoot);

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  for (const pack of packs) {
    if (pack.version !== version) {
      throw new Error(`Cannot package ${pack.slug}: pack version ${pack.version} does not match ${version}`);
    }

    if (new Set(pack.skills).size !== pack.skills.length) {
      throw new Error(`Cannot package ${pack.slug}: duplicate skill membership`);
    }

    const files = [
      { name: "README.txt", data: Buffer.from(buildReadme(pack, version), "utf8") },
    ];

    for (const skill of pack.skills) {
      files.push({
        name: `${skill}-${version}.zip`,
        data: await createSkillZipBuffer(path.join(skillsRoot, skill)),
      });
    }

    const archive = createStoredZip(files);
    await writeFile(path.join(output, `agent-skills-${pack.slug}-${version}.zip`), archive);
  }

  return { count: packs.length, output, version };
}

function parseOutputArgument(args) {
  if (args.length === 0) return defaultOutput;
  if (args.length === 2 && args[0] === "--output") return path.resolve(args[1]);
  throw new Error("Usage: node scripts/generate-pack-zips.mjs [--output <directory>]");
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const output = parseOutputArgument(process.argv.slice(2));
  const result = await generatePackZips({ output });
  console.log(`Generated ${result.count} pack ZIP bundles for ${result.version} in ${result.output}`);
}
