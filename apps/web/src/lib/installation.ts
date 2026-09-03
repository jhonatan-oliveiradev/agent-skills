export const installationCommands = {
  complete: { bash: "bash install.sh", powershell: "./install.ps1" },
  claudeCode: {
    bash: "bash install.sh --target claude-code",
    powershell: "./install.ps1 --target claude-code",
  },
  skill: {
    bash: "./install.sh --skill craft-premium-motion",
    powershell: "./install.ps1 --skill craft-premium-motion",
  },
  pack: {
    bash: "./install.sh --pack motion",
    powershell: "./install.ps1 --pack motion",
  },
  verify: {
    bash: "ls ~/.agents/skills",
    powershell: 'Get-ChildItem "$HOME\\.agents\\skills"',
  },
} as const;

export const chatgptDistribution = {
  repositoryUrl: "https://github.com/jhonatan-oliveiradev/agent-skills",
} as const;

export function getChatgptSkillDownload(slug: string, version: string) {
  const filename = `${slug}-${version}.zip`;
  return {
    filename,
    href: `/downloads/skills/${filename}`,
  } as const;
}
