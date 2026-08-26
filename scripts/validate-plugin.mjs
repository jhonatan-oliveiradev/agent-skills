import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath, errors) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    errors.push(`${filePath}: invalid JSON`);
    return {};
  }
}

export async function validatePlugin(repoRoot) {
  const resolvedRoot = path.resolve(repoRoot);
  const errors = [];
  const plugin = await readJson(path.join(resolvedRoot, ".codex-plugin", "plugin.json"), errors);
  const marketplace = await readJson(path.join(resolvedRoot, ".agents", "plugins", "marketplace.json"), errors);
  const packageJson = await readJson(path.join(resolvedRoot, "package.json"), errors);
  const versionText = await readFile(path.join(resolvedRoot, "VERSION"), "utf8");

  const expectedName = "agent-skills-studio";
  if (plugin.name !== expectedName) errors.push(`plugin name must be ${expectedName}`);
  if (marketplace.name !== expectedName) errors.push(`marketplace name must be ${expectedName}`);
  if (plugin.version !== packageJson.version || plugin.version !== versionText.trim()) {
    errors.push("plugin, package, and VERSION values must match");
  }
  if (typeof plugin.skills !== "string" || !plugin.skills.startsWith("./")) {
    errors.push("plugin skills path must start with ./");
  }

  const resolvedSkills = path.resolve(resolvedRoot, plugin.skills ?? "");
  const insideRoot = resolvedSkills === resolvedRoot || resolvedSkills.startsWith(`${resolvedRoot}${path.sep}`);
  if (!insideRoot) errors.push("skills must resolve inside the plugin root");
  if (insideRoot && !(await exists(resolvedSkills))) errors.push("plugin skills directory does not exist");

  const entries = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];
  const matching = entries.filter((entry) => entry?.name === expectedName);
  if (matching.length !== 1) errors.push("marketplace must contain exactly one matching plugin");
  const entry = matching[0];
  if (entry?.source?.source !== "local" || entry?.source?.path !== "./") {
    errors.push("marketplace plugin must resolve to the repository root");
  }
  if (entry?.policy?.installation !== "AVAILABLE") {
    errors.push("marketplace plugin must be available for installation");
  }
  if (entry?.policy?.authentication !== "NOT_REQUIRED") {
    errors.push("skills-only plugin must not require authentication");
  }

  return errors;
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const repoRoot = path.resolve(path.dirname(scriptFile), "..");
  const errors = await validatePlugin(repoRoot);
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log("Plugin validation passed.");
  }
}
