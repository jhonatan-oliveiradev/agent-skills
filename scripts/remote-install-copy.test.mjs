import assert from "node:assert/strict";
import test from "node:test";

import {
  getRemotePackInstallCommand,
  getRemoteSkillInstallCommand,
  getRemoteTargetInstallCommand,
  REMOTE_QUICK_INSTALL_COMMAND,
} from "../apps/web/src/lib/remote-installer.mjs";

const remote = "curl -fsSL https://skills.jhonatanoliveira.com/install";

test("publishes the no-clone quick install command", () => {
  assert.equal(REMOTE_QUICK_INSTALL_COMMAND, `${remote} | bash`);
});

test("composes pack, skill and target passthrough commands", () => {
  assert.equal(
    getRemotePackInstallCommand("application-security"),
    `${remote} | bash -s -- --pack application-security`,
  );
  assert.equal(
    getRemoteSkillInstallCommand("reviewing-web-security"),
    `${remote} | bash -s -- --skill reviewing-web-security`,
  );
  assert.equal(
    getRemoteTargetInstallCommand("claude-code"),
    `${remote} | bash -s -- --target claude-code`,
  );
});

test("rejects unsafe shell-facing slugs before command composition", () => {
  assert.throws(() => getRemotePackInstallCommand("../payload"), /invalid install slug/i);
  assert.throws(() => getRemoteSkillInstallCommand("skill;rm-rf"), /invalid install slug/i);
  assert.throws(() => getRemoteTargetInstallCommand("claude code"), /invalid install slug/i);
});
