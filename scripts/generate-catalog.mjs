import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { assembleCatalog, checkCatalogBytes, getCatalogPaths, serializeCatalog } from "./lib/catalog.mjs";
import { loadValidatedCatalog } from "./validate-catalog.mjs";

export { serializeCatalog };

export async function generateCatalog(repoRoot) {
  return assembleCatalog(await loadValidatedCatalog(repoRoot));
}

export async function checkGeneratedCatalog(repoRoot) {
  return checkCatalogBytes(repoRoot, await generateCatalog(repoRoot));
}

async function runCli(repoRoot, options) {
  const unknown = options.find((option) => option !== "--check") ?? (options.length > 1 ? options[1] : null);
  if (unknown !== null) {
    console.error(`Unknown option: ${unknown}`);
    return 1;
  }

  if (options[0] === "--check") {
    const errors = await checkGeneratedCatalog(repoRoot);
    if (errors.length > 0) {
      for (const error of errors) console.error(error);
      return 1;
    }
    console.log("Generated catalog is current.");
    return 0;
  }

  const generated = await generateCatalog(repoRoot);
  const target = getCatalogPaths(repoRoot).generatedFile;
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, serializeCatalog(generated));
  return 0;
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const repoRoot = path.resolve(path.dirname(scriptFile), "..");
  try {
    process.exitCode = await runCli(repoRoot, process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    if (error instanceof AggregateError) {
      for (const sourceError of error.errors) console.error(`- ${sourceError.message}`);
    }
    process.exitCode = 1;
  }
}
