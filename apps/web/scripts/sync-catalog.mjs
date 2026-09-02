import { mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const applicationRoot = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(applicationRoot, "../..");
const requiredLocales = ["en", "pt-BR"];

function runCatalogCommand(repoRoot, script, options = []) {
  const result = spawnSync(process.execPath, [script, ...options], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${script} failed with exit code ${result.status ?? "unknown"}`);
  }
}

function assertCatalog(catalog, version) {
  if (catalog.version !== version) {
    throw new Error("Catalog version must match VERSION");
  }
  if (
    !Array.isArray(catalog.locales) ||
    catalog.locales.length !== requiredLocales.length ||
    catalog.locales.some((locale, index) => locale !== requiredLocales[index])
  ) {
    throw new Error("Catalog locales must equal en, pt-BR");
  }
  if (!Array.isArray(catalog.skills) || catalog.skills.length !== 39) {
    throw new Error("Catalog must contain 39 skills");
  }
  if (!Array.isArray(catalog.packs) || catalog.packs.length !== 8) {
    throw new Error("Catalog must contain 8 packs");
  }
}

export function syncCatalog({ repoRoot = repositoryRoot, webRoot = applicationRoot, runValidation = true } = {}) {
  const source = path.resolve(repoRoot, "catalog/generated/catalog.json");
  const destination = path.resolve(webRoot, "src/generated/catalog.json");

  if (runValidation) {
    runCatalogCommand(repoRoot, "scripts/validate-catalog.mjs");
    runCatalogCommand(repoRoot, "scripts/generate-catalog.mjs", ["--check"]);
  }

  const sourceBytes = readFileSync(source);
  const catalog = JSON.parse(sourceBytes.toString("utf8"));
  const version = readFileSync(path.resolve(repoRoot, "VERSION"), "utf8").trim();
  assertCatalog(catalog, version);

  mkdirSync(path.dirname(destination), { recursive: true });
  const temporaryDestination = `${destination}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(temporaryDestination, sourceBytes);
    renameSync(temporaryDestination, destination);
  } catch (error) {
    try {
      unlinkSync(temporaryDestination);
    } catch (cleanupError) {
      if (cleanupError.code !== "ENOENT") throw cleanupError;
    }
    throw error;
  }

  return { source, destination, bytes: sourceBytes.byteLength };
}

const invokedFile = process.argv[1] && path.resolve(process.argv[1]);
if (invokedFile === fileURLToPath(import.meta.url)) {
  try {
    const { source, destination, bytes } = syncCatalog();
    console.log(`Synchronized catalog: ${source} -> ${destination} (${bytes} bytes)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
