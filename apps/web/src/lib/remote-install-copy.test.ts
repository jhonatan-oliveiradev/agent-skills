import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPackInstallCommands, getSkillInstallCommands } from "./catalog";
import { installationCommands } from "./installation";

const remote = "curl -fsSL https://skills.jhonatanoliveira.com/install";

describe("remote consumer installation commands", () => {
  it("uses the remote quick install for the complete Bash collection", () => {
    expect(installationCommands.complete.bash).toBe(`${remote} | bash`);
    expect(installationCommands.complete.powershell).toBe("./install.ps1");
  });

  it("passes skill selections through bash -s -- while leaving PowerShell local", () => {
    expect(getSkillInstallCommands("reviewing-web-security")).toEqual({
      bash: `${remote} | bash -s -- --skill reviewing-web-security`,
      powershell: "./install.ps1 --skill reviewing-web-security",
    });
    expect(installationCommands.skill.bash).toBe(
      `${remote} | bash -s -- --skill craft-premium-motion`,
    );
  });

  it("passes pack selections through bash -s -- while leaving PowerShell local", () => {
    expect(getPackInstallCommands("application-security", "active")).toEqual({
      bash: `${remote} | bash -s -- --pack application-security`,
      powershell: "./install.ps1 --pack application-security",
    });
    expect(installationCommands.pack.bash).toBe(`${remote} | bash -s -- --pack motion`);
  });

  it("uses the remote bootstrap for supported target arguments too", () => {
    expect(installationCommands.claudeCode.bash).toBe(
      `${remote} | bash -s -- --target claude-code`,
    );
    expect(installationCommands.claudeCode.powershell).toBe("./install.ps1 --target claude-code");
  });
});
