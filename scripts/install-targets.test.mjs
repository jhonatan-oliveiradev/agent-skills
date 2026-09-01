import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import * as installer from "./install-skills.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("keeps the Agent Skills personal destination as the backward-compatible default", () => {
  assert.equal(
    installer.resolveInstallDestination({ homeDir: "/home/tester", cwd: "/workspace/project" }),
    path.resolve("/home/tester/.agents/skills"),
  );
});

test("resolves Claude Code personal and project skill locations", () => {
  assert.equal(
    installer.resolveInstallDestination({
      target: "claude-code",
      scope: "personal",
      homeDir: "/home/tester",
      cwd: "/workspace/project",
    }),
    path.resolve("/home/tester/.claude/skills"),
  );
  assert.equal(
    installer.resolveInstallDestination({
      target: "claude-code",
      scope: "project",
      homeDir: "/home/tester",
      cwd: "/workspace/project",
    }),
    path.resolve("/workspace/project/.claude/skills"),
  );
});

test("lets an explicit destination override the target-derived location", () => {
  assert.equal(
    installer.resolveInstallDestination({
      target: "claude-code",
      scope: "project",
      destination: "/custom/skills",
      homeDir: "/home/tester",
      cwd: "/workspace/project",
    }),
    path.resolve("/custom/skills"),
  );
});

test("rejects unsupported install targets and scopes", () => {
  assert.throws(
    () => installer.resolveInstallDestination({ target: "unknown", homeDir: "/home/tester", cwd: "/workspace" }),
    /Unknown install target: unknown/,
  );
  assert.throws(
    () => installer.resolveInstallDestination({ target: "agents", scope: "project", homeDir: "/home/tester", cwd: "/workspace" }),
    /Install target agents does not support scope project/,
  );
});

test("CLI installs a selected skill into a Claude Code project scope", async () => {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "agent-skills-claude-project-"));

  await execFileAsync(process.execPath, [
    path.join(repositoryRoot, "scripts", "install-skills.mjs"),
    "--target",
    "claude-code",
    "--scope",
    "project",
    "--skill",
    "craft-premium-motion",
  ], { cwd: projectRoot });

  assert.match(
    await readFile(path.join(projectRoot, ".claude", "skills", "craft-premium-motion", "SKILL.md"), "utf8"),
    /name: craft-premium-motion/,
  );
});
