import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getSkillsRoot } from "./lib/skills.mjs";

async function readText(filePath, errors) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    errors.push(`${filePath}: unreadable`);
    return "";
  }
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
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
  const versionText = await readText(path.join(resolvedRoot, "VERSION"), errors);

  const expectedName = "agent-skills-studio";
  if (plugin.name !== expectedName) errors.push(`plugin name must be ${expectedName}`);
  if (marketplace.name !== expectedName) errors.push(`marketplace name must be ${expectedName}`);
  if (plugin.version !== packageJson.version || plugin.version !== versionText.trim()) {
    errors.push("plugin, package, and VERSION values must match");
  }
  const expectedSkills = getSkillsRoot(resolvedRoot);
  const resolvedSkills = path.resolve(resolvedRoot, plugin.skills ?? "");
  if (typeof plugin.skills !== "string" || !plugin.skills.startsWith("./")) {
    errors.push("plugin skills path must start with ./");
  }
  if (!isWithin(resolvedRoot, resolvedSkills)) {
    errors.push("skills must resolve inside the plugin root");
  }
  if (plugin.skills !== "./skills/" || resolvedSkills !== expectedSkills) {
    errors.push("plugin skills path must be exactly ./skills/");
  } else {
    try {
      const [canonicalRoot, canonicalSkills, skillsStats] = await Promise.all([
        realpath(resolvedRoot),
        realpath(expectedSkills),
        stat(expectedSkills),
      ]);
      if (!isWithin(canonicalRoot, canonicalSkills)) {
        errors.push("skills must resolve inside the plugin root");
      } else if (!skillsStats.isDirectory()) {
        errors.push("plugin skills directory does not exist");
      }
    } catch (error) {
      if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
        errors.push("plugin skills directory does not exist");
      } else {
        errors.push("plugin skills directory is unreadable");
      }
    }
  }

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
