export const installationCommands = {
  complete: { bash: "bash install.sh", powershell: "./install.ps1" },
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
