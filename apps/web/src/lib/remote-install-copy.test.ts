import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPackInstallCommands, getSkillInstallCommands } from "./catalog";
import { installationCommands } from "./installation";
import {
  getRemotePackInstallCommand,
  getRemoteSkillInstallCommand,
  getRemoteTargetInstallCommand,
  REMOTE_QUICK_INSTALL_COMMAND,
} from "./remote-installer.mjs";

const remote = "curl -fsSL https://skills.jhonatanoliveira.com/install";

describe("remote consumer installation commands", () => {
  it("publishes the copy-paste remote quick install without replacing the local installer API", () => {
    expect(REMOTE_QUICK_INSTALL_COMMAND).toBe(`${remote} | bash`);
    expect(installationCommands.complete).toEqual({
      bash: "bash install.sh",
      powershell: "./install.ps1",
    });
  });

  it("passes skill selections through bash -s -- while preserving canonical local commands", () => {
    expect(getRemoteSkillInstallCommand("reviewing-web-security")).toBe(
      `${remote} | bash -s -- --skill reviewing-web-security`,
    );
    expect(getSkillInstallCommands("reviewing-web-security")).toEqual({
      bash: "./install.sh --skill reviewing-web-security",
      powershell: "./install.ps1 --skill reviewing-web-security",
    });
  });

  it("passes pack selections through bash -s -- while preserving canonical local commands", () => {
    expect(getRemotePackInstallCommand("application-security")).toBe(
      `${remote} | bash -s -- --pack application-security`,
    );
    expect(getPackInstallCommands("application-security", "active")).toEqual({
      bash: "./install.sh --pack application-security",
      powershell: "./install.ps1 --pack application-security",
    });
  });

  it("supports target passthrough without inventing a separate installer engine", () => {
    expect(getRemoteTargetInstallCommand("claude-code")).toBe(
      `${remote} | bash -s -- --target claude-code`,
    );
    expect(installationCommands.claudeCode).toEqual({
      bash: "bash install.sh --target claude-code",
      powershell: "./install.ps1 --target claude-code",
    });
  });

  it("rejects unsafe slugs before composing shell-facing copy", () => {
    expect(() => getRemoteSkillInstallCommand("../payload")).toThrow(/invalid install slug/i);
    expect(() => getRemotePackInstallCommand("motion;rm-rf")).toThrow(/invalid install slug/i);
    expect(() => getRemoteTargetInstallCommand("claude code")).toThrow(/invalid install slug/i);
  });
});
