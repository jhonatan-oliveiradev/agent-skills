import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import GettingStartedPage from "@/app/[locale]/getting-started/page";

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

describe("Getting Started Field Manual", () => {
  it.each([
    [
      "en",
      "FIELD MANUAL",
      "05 stages",
      "First installation",
      "Explore skills",
      "View packs",
      "Claude Code · personal",
      "ChatGPT · plugin marketplace",
      "Open any Skill → Download Skill ZIP",
      "Plugins → Skills → Create → Upload from computer",
      "Workspace settings → Plugins → Add → Import marketplace",
      "Choose next",
    ],
    [
      "pt-BR",
      "MANUAL DE CAMPO",
      "05 etapas",
      "Primeira instalação",
      "Explorar skills",
      "Ver pacotes",
      "Claude Code · pessoal",
      "ChatGPT · marketplace de plugins",
      "Abra qualquer skill → Baixar ZIP da skill",
      "Plugins → Habilidades → Criar → Carregar do computador",
      "Configurações do workspace → Plugins → Adicionar → Importar marketplace",
      "Próximo passo",
    ],
  ] as const)(
    "renders the localized five-stage manual architecture for %s",
    async (
      locale,
      manualLabel,
      stagesLabel,
      setupLabel,
      skillsAction,
      packsAction,
      claudeLabel,
      chatgptLabel,
      skillDownloadPath,
      skillUploadPath,
      marketplacePath,
      finalStage,
    ) => {
      const { container } = render(
        await GettingStartedPage({ params: Promise.resolve({ locale }) }),
      );

      const manual = container.querySelector("[data-field-manual]");
      expect(manual).toBeInTheDocument();
      expect(screen.getByText(manualLabel)).toBeInTheDocument();
      expect(screen.getByText(stagesLabel)).toBeInTheDocument();
      expect(screen.getByText("Bash + PowerShell")).toBeInTheDocument();
      expect(screen.getByText(setupLabel)).toBeInTheDocument();
      expect(screen.getByText(finalStage)).toBeInTheDocument();

      const stages = Array.from(container.querySelectorAll("[data-field-manual-stage]")).map(
        (stage) => stage.getAttribute("data-field-manual-stage"),
      );
      expect(stages).toEqual(["orientation", "install", "verify", "maintain", "continue"]);

      expect(container.querySelector("[data-terminal-demo]")).toBeInTheDocument();
      expect(container.querySelector("[data-field-manual-index]")).toBeInTheDocument();
      expect(screen.getByText(claudeLabel)).toBeInTheDocument();
      expect(screen.getByText("bash install.sh --target claude-code")).toBeInTheDocument();
      expect(screen.getByText("./install.ps1 --target claude-code")).toBeInTheDocument();

      const chatgpt = container.querySelector("[data-chatgpt-distribution]");
      expect(chatgpt).toBeInTheDocument();
      expect(screen.getByText(chatgptLabel)).toBeInTheDocument();
      expect(screen.getByText(skillDownloadPath)).toBeInTheDocument();
      expect(screen.getByText(skillUploadPath)).toBeInTheDocument();
      expect(screen.getByText(marketplacePath)).toBeInTheDocument();
      expect(screen.getByText(repositoryUrl)).toBeInTheDocument();

      expect(screen.getByRole("link", { name: skillsAction })).toHaveAttribute(
        "data-interaction",
        "navigate",
      );
      expect(screen.getByRole("link", { name: packsAction })).toHaveAttribute(
        "data-interaction",
        "navigate",
      );
    },
  );

  it.each([
    [
      "en",
      "Choose the environment first",
      "Codex / Agent Skills",
      "Claude Code",
      "ChatGPT",
      "~/.agents/skills/",
      "~/.claude/skills/",
      "<project>/.claude/skills/",
      "No filesystem installer",
      "Personal is the default. Add --scope project when the current project should own the installed skills.",
      "Verify Codex / Agent Skills",
      "Verify Claude Code",
      "Verify ChatGPT",
      "Confirm the uploaded skill or imported plugin is visible in the eligible ChatGPT workspace.",
      "If the path is wrong",
      "The default installer targets ~/.agents/skills/. Use --target claude-code when Claude Code should discover the skills instead.",
    ],
    [
      "pt-BR",
      "Escolha primeiro o ambiente",
      "Codex / Agent Skills",
      "Claude Code",
      "ChatGPT",
      "~/.agents/skills/",
      "~/.claude/skills/",
      "<projeto>/.claude/skills/",
      "Sem instalador de filesystem",
      "Pessoal é o padrão. Adicione --scope project quando o projeto atual deve ser o dono das skills instaladas.",
      "Verificar Codex / Agent Skills",
      "Verificar Claude Code",
      "Verificar ChatGPT",
      "Confirme que a skill enviada ou o plugin importado aparece no workspace elegível do ChatGPT.",
      "Se o caminho estiver errado",
      "O instalador padrão aponta para ~/.agents/skills/. Use --target claude-code quando o Claude Code deve descobrir as skills.",
    ],
  ] as const)(
    "explains target, destination, scope, verification, and recovery for %s",
    async (
      locale,
      chooserTitle,
      codexLabel,
      claudeLabel,
      chatgptLabel,
      agentsDestination,
      claudePersonalDestination,
      claudeProjectDestination,
      chatgptDestination,
      claudeScope,
      verifyAgents,
      verifyClaude,
      verifyChatgpt,
      chatgptVerification,
      recoveryTitle,
      recoverySummary,
    ) => {
      const { container } = render(
        await GettingStartedPage({ params: Promise.resolve({ locale }) }),
      );

      const targetGuide = container.querySelector<HTMLElement>("[data-install-target-guide]");
      expect(targetGuide).toBeInTheDocument();
      expect(within(targetGuide!).getByRole("heading", { name: chooserTitle })).toBeInTheDocument();
      expect(within(targetGuide!).getByRole("heading", { name: codexLabel })).toBeInTheDocument();
      expect(within(targetGuide!).getByRole("heading", { name: claudeLabel })).toBeInTheDocument();
      expect(within(targetGuide!).getByRole("heading", { name: chatgptLabel })).toBeInTheDocument();
      expect(within(targetGuide!).getByText(agentsDestination)).toBeInTheDocument();
      expect(within(targetGuide!).getByText(claudePersonalDestination)).toBeInTheDocument();
      expect(within(targetGuide!).getByText(claudeProjectDestination)).toBeInTheDocument();
      expect(within(targetGuide!).getByText(chatgptDestination)).toBeInTheDocument();
      expect(within(targetGuide!).getByText(claudeScope)).toBeInTheDocument();

      expect(screen.getAllByText("bash install.sh").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("./install.ps1").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("./install.sh --skill craft-premium-motion")).toBeInTheDocument();
      expect(screen.getByText("./install.sh --pack motion")).toBeInTheDocument();
      expect(screen.getByText("bash install.sh --target claude-code --scope project")).toBeInTheDocument();
      expect(screen.getByText("./install.ps1 --target claude-code --scope project")).toBeInTheDocument();

      const verifyTargets = container.querySelector<HTMLElement>("[data-verify-targets]");
      expect(verifyTargets).toBeInTheDocument();
      expect(within(verifyTargets!).getByRole("heading", { name: verifyAgents })).toBeInTheDocument();
      expect(within(verifyTargets!).getByRole("heading", { name: verifyClaude })).toBeInTheDocument();
      expect(within(verifyTargets!).getByRole("heading", { name: verifyChatgpt })).toBeInTheDocument();
      expect(within(verifyTargets!).getByText("ls ~/.agents/skills")).toBeInTheDocument();
      expect(within(verifyTargets!).getByText("ls ~/.claude/skills")).toBeInTheDocument();
      expect(within(verifyTargets!).getByText(chatgptVerification)).toBeInTheDocument();

      const recovery = container.querySelector<HTMLElement>("[data-install-recovery]");
      expect(recovery).toBeInTheDocument();
      expect(within(recovery!).getByRole("heading", { name: recoveryTitle })).toBeInTheDocument();
      expect(within(recovery!).getByText(recoverySummary)).toBeInTheDocument();
    },
  );
});
