import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, chmod, mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  generateRemoteInstallScript,
  resolveRemoteInstallRevision,
} from "../apps/web/src/lib/remote-installer.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runBootstrap(script, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-s", "--", ...args], {
      cwd: options.cwd,
      env: options.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code, signal) => resolve({ code, signal, stdout, stderr }));
    child.stdin.end(script);
  });
}

async function makeRemoteHarness() {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-remote-test-"));
  const archiveRoot = path.join(root, "archive-root");
  const fakeBin = path.join(root, "bin");
  const capture = path.join(root, "capture");
  const tempRoot = path.join(root, "tmp");
  const projectRoot = path.join(root, "arbitrary-project");
  await Promise.all([
    mkdir(archiveRoot),
    mkdir(fakeBin),
    mkdir(capture),
    mkdir(tempRoot),
    mkdir(projectRoot),
  ]);

  const fakeInstaller = `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\0' "$@" > "$REMOTE_INSTALL_TEST_ARGS"
printf '%s' "${BASH_SOURCE[0]}" > "$REMOTE_INSTALL_TEST_INSTALLER"
printf '%s' "$PWD" > "$REMOTE_INSTALL_TEST_CWD"
if [[ -n "${REMOTE_INSTALL_TEST_EXIT_CODE:-}" ]]; then
  exit "$REMOTE_INSTALL_TEST_EXIT_CODE"
fi
`;
  await writeFile(path.join(archiveRoot, "install.sh"), fakeInstaller);

  const archive = path.join(root, "repository.tar.gz");
  const tar = spawn("tar", ["-czf", archive, "-C", root, "archive-root"]);
  const tarCode = await new Promise((resolve, reject) => {
    tar.on("error", reject);
    tar.on("close", resolve);
  });
  assert.equal(tarCode, 0);

  const fakeCurl = `#!/usr/bin/env bash
set -euo pipefail
if [[ "${REMOTE_INSTALL_TEST_CURL_FAIL:-0}" == "1" ]]; then
  echo "simulated download failure" >&2
  exit 22
fi
output=""
while (($#)); do
  case "$1" in
    -o)
      output="$2"
      shift 2
      ;;
    *) shift ;;
  esac
done
[[ -n "$output" ]]
cp -- "$REMOTE_INSTALL_TEST_ARCHIVE" "$output"
`;
  const fakeCurlPath = path.join(fakeBin, "curl");
  await writeFile(fakeCurlPath, fakeCurl);
  await chmod(fakeCurlPath, 0o755);

  const env = {
    ...process.env,
    PATH: `${fakeBin}:${process.env.PATH ?? ""}`,
    TMPDIR: tempRoot,
    REMOTE_INSTALL_TEST_ARCHIVE: archive,
    REMOTE_INSTALL_TEST_ARGS: path.join(capture, "args.bin"),
    REMOTE_INSTALL_TEST_INSTALLER: path.join(capture, "installer.txt"),
    REMOTE_INSTALL_TEST_CWD: path.join(capture, "cwd.txt"),
  };

  return { root, capture, tempRoot, projectRoot, env };
}

async function readNullSeparated(filePath) {
  const value = await readFile(filePath);
  return value.toString("utf8").split("\0").filter(Boolean);
}

test("pins valid deployment SHAs and rejects arbitrary revision input", () => {
  const sha = "a".repeat(40);
  assert.equal(resolveRemoteInstallRevision(sha), sha);
  assert.equal(resolveRemoteInstallRevision("dev"), "main");
  assert.equal(resolveRemoteInstallRevision("../../payload"), "main");
  assert.equal(resolveRemoteInstallRevision(undefined), "main");
});

test("generates a strict textual Bash bootstrap that delegates to install.sh", async (t) => {
  if (process.platform === "win32") {
    t.skip("Bash syntax validation runs on Unix-like hosts");
    return;
  }
  const script = generateRemoteInstallScript({ revision: "b".repeat(40) });
  assert.match(script, /^#!\/usr\/bin\/env bash\n/);
  assert.match(script, /set -euo pipefail/);
  assert.match(script, /https:\/\/github\.com\/jhonatan-oliveiradev\/agent-skills\/archive\//);
  assert.match(script, /bash "\$installer" "\$@"/);
  assert.doesNotMatch(script, /--pack\s+\$|--skill\s+\$/);

  const result = await runBootstrap(`set -n\n${script}`);
  assert.equal(result.code, 0, result.stderr);
});

test("passes pack and skill arguments intact from an arbitrary working directory", { skip: process.platform === "win32" }, async () => {
  const harness = await makeRemoteHarness();
  await writeFile(path.join(harness.projectRoot, "sentinel.txt"), "do not touch");
  const before = await readdir(harness.projectRoot);
  const args = [
    "--pack",
    "application-security",
    "--skill",
    "reviewing-web-security",
    "--pack",
    "motion",
  ];

  const result = await runBootstrap(generateRemoteInstallScript({ revision: "c".repeat(40) }), args, {
    cwd: harness.projectRoot,
    env: harness.env,
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(await readNullSeparated(path.join(harness.capture, "args.bin")), args);
  assert.deepEqual(await readdir(harness.projectRoot), before);
  assert.equal(await readFile(path.join(harness.capture, "cwd.txt"), "utf8"), harness.projectRoot);
  const installer = await readFile(path.join(harness.capture, "installer.txt"), "utf8");
  assert.match(installer, /agent-skills-install\.[^/]+\/repository\/install\.sh$/);
  const temporaryDirectory = path.dirname(path.dirname(installer));
  await assert.rejects(access(temporaryDirectory), { code: "ENOENT" });
});

test("passes an individual --skill selection to the canonical installer boundary", { skip: process.platform === "win32" }, async () => {
  const harness = await makeRemoteHarness();
  const result = await runBootstrap(
    generateRemoteInstallScript({ revision: "d".repeat(40) }),
    ["--skill", "reviewing-web-security"],
    { cwd: harness.projectRoot, env: harness.env },
  );

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(await readNullSeparated(path.join(harness.capture, "args.bin")), [
    "--skill",
    "reviewing-web-security",
  ]);
});

test("propagates bootstrap download failures and cleans temporary files", { skip: process.platform === "win32" }, async () => {
  const harness = await makeRemoteHarness();
  const result = await runBootstrap(generateRemoteInstallScript({ revision: "e".repeat(40) }), [], {
    cwd: harness.projectRoot,
    env: { ...harness.env, REMOTE_INSTALL_TEST_CURL_FAIL: "1" },
  });

  assert.equal(result.code, 22);
  assert.match(result.stderr, /simulated download failure/i);
  assert.deepEqual(await readdir(harness.tempRoot), []);
});

test("preserves the existing local install.sh wrapper as the canonical Bash entrypoint", async () => {
  const source = await readFile(path.join(repositoryRoot, "install.sh"), "utf8");
  assert.match(source, /scripts\/install-skills\.mjs/);
  assert.match(source, /"\$@"/);
});
