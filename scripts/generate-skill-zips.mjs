import { lstat, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "..");
const defaultOutput = path.join(repositoryRoot, "apps", "web", "public", "downloads", "skills");
const utf8Flag = 0x0800;
const storedCompression = 0;
const deterministicDosDate = 0x0021; // 1980-01-01

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) === 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function collectSkillFiles(skillRoot, current = skillRoot) {
  const entries = (await readdir(current, { withFileTypes: true })).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(current, entry.name);
    const metadata = await lstat(absolute);

    if (metadata.isSymbolicLink()) {
      throw new Error(`Skill ZIP generation refuses symbolic links: ${absolute}`);
    }

    if (metadata.isDirectory()) {
      files.push(...(await collectSkillFiles(skillRoot, absolute)));
      continue;
    }

    if (!metadata.isFile()) continue;

    files.push({
      name: path.relative(skillRoot, absolute).split(path.sep).join("/"),
      data: await readFile(absolute),
    });
  }

  return files;
}

export function createStoredZip(files) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const file of files) {
    const fileName = Buffer.from(file.name, "utf8");
    const checksum = crc32(file.data);
    const size = file.data.length;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(utf8Flag, 6);
    localHeader.writeUInt16LE(storedCompression, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(deterministicDosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(size, 18);
    localHeader.writeUInt32LE(size, 22);
    localHeader.writeUInt16LE(fileName.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, fileName, file.data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(utf8Flag, 8);
    centralHeader.writeUInt16LE(storedCompression, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(deterministicDosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(size, 20);
    centralHeader.writeUInt32LE(size, 24);
    centralHeader.writeUInt16LE(fileName.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);

    centralParts.push(centralHeader, fileName);
    localOffset += localHeader.length + fileName.length + file.data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

export async function createSkillZipBuffer(skillRoot) {
  const files = await collectSkillFiles(skillRoot);

  if (!files.some((file) => file.name === "SKILL.md")) {
    throw new Error(`Cannot package ${path.basename(skillRoot)}: SKILL.md is missing`);
  }

  return createStoredZip(files);
}

export async function generateSkillZips({ repoRoot = repositoryRoot, output = defaultOutput } = {}) {
  const skillsRoot = path.join(repoRoot, "skills");
  const version = (await readFile(path.join(repoRoot, "VERSION"), "utf8")).trim();
  const entries = (await readdir(skillsRoot, { withFileTypes: true })).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const skillNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  for (const skillName of skillNames) {
    const archive = await createSkillZipBuffer(path.join(skillsRoot, skillName));
    await writeFile(path.join(output, `${skillName}-${version}.zip`), archive);
  }

  return { count: skillNames.length, output, version };
}

function parseOutputArgument(args) {
  if (args.length === 0) return defaultOutput;
  if (args.length === 2 && args[0] === "--output") return path.resolve(args[1]);
  throw new Error("Usage: node scripts/generate-skill-zips.mjs [--output <directory>]");
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const output = parseOutputArgument(process.argv.slice(2));
  const result = await generateSkillZips({ output });
  console.log(`Generated ${result.count} skill ZIP bundles for ${result.version} in ${result.output}`);
}
