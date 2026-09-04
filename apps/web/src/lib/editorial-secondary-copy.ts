import type { Locale } from "./locales";

type FieldManualStageId = "orientation" | "install" | "verify" | "maintain" | "continue";
type InstallTargetId = "agents" | "claude-code" | "chatgpt";

interface FieldManualCopy {
  readonly publicationLabel: string;
  readonly editionLabel: string;
  readonly indexLabel: string;
  readonly targetGuideTitle: string;
  readonly targets: readonly {
    readonly id: InstallTargetId;
    readonly label: string;
    readonly mode: string;
    readonly summary: string;
    readonly destinations: readonly string[];
  }[];
  readonly claudeScopeSummary: string;
  readonly defaultTargetLabel: string;
  readonly defaultTargetSummary: string;
  readonly installOptions: Readonly<{
    complete: string;
    skill: string;
    pack: string;
  }>;
  readonly claudeCodeLabel: string;
  readonly claudeCodeSummary: string;
  readonly claudeCodeProjectLabel: string;
  readonly claudeCodeProjectSummary: string;
  readonly chatgptLabel: string;
  readonly chatgptSummary: string;
  readonly chatgptSkillDownloadLabel: string;
  readonly chatgptSkillDownloadPath: string;
  readonly chatgptSkillUploadLabel: string;
  readonly chatgptSkillUploadPath: string;
  readonly chatgptMarketplaceLabel: string;
  readonly chatgptMarketplacePath: string;
  readonly chatgptAvailability: string;
  readonly verifyAgentsLabel: string;
  readonly verifyClaudeLabel: string;
  readonly verifyChatgptLabel: string;
  readonly verifyChatgptSummary: string;
  readonly recoveryTitle: string;
  readonly recoverySummary: string;
  readonly installationSuccessSuffix: string;
  readonly metrics: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  readonly stages: readonly {
    readonly id: FieldManualStageId;
    readonly label: string;
  }[];
}

interface LivingProgramCopy {
  readonly publicationLabel: string;
  readonly indexLabel: string;
  readonly summary: string;
  readonly principle: string;
  readonly releaseStateLabel: string;
  readonly postStableLabel: string;
  readonly postStableSummary: string;
  readonly metrics: Readonly<{
    stages: string;
    entries: string;
    empty: string;
  }>;
  readonly emptyLabel: string;
  readonly entrySingular: string;
  readonly entryPlural: string;
}

export const fieldManualCopy = {
  en: {
    publicationLabel: "FIELD MANUAL",
    editionLabel: "01 / INSTALL AND VERIFY",
    indexLabel: "Installation steps",
    targetGuideTitle: "Choose the environment first",
    targets: [
      {
        id: "agents",
        label: "Codex / Agent Skills",
        mode: "Filesystem · personal",
        summary:
          "Use the default installer when Codex or another Agent Skills-compatible runtime should discover these methods.",
        destinations: ["~/.agents/skills/"],
      },
      {
        id: "claude-code",
        label: "Claude Code",
        mode: "Filesystem · personal or project",
        summary:
          "Use the Claude Code target when the methods should be discovered from Claude Code's native skill locations.",
        destinations: ["~/.claude/skills/", "<project>/.claude/skills/"],
      },
      {
        id: "chatgpt",
        label: "ChatGPT",
        mode: "Upload or plugin marketplace",
        summary:
          "Install one Skill ZIP directly or import the complete skills-only marketplace in an eligible workspace.",
        destinations: ["No filesystem installer"],
      },
    ],
    claudeScopeSummary:
      "Personal is the default. Add --scope project when the current project should own the installed skills.",
    defaultTargetLabel: "Codex / Agent Skills · default target",
    defaultTargetSummary:
      "These commands use the default personal target and write to ~/.agents/skills/.",
    installOptions: {
      complete: "Installs the complete canonical collection into the selected personal filesystem target.",
      skill: "Installs only the named canonical skill; replace the example slug with the method you need.",
      pack: "Installs the members of one active pack while each member remains independently invokable.",
    },
    claudeCodeLabel: "Claude Code · personal",
    claudeCodeSummary:
      "Installs the complete collection into ~/.claude/skills/ so it is available across local Claude Code projects.",
    claudeCodeProjectLabel: "Claude Code · project",
    claudeCodeProjectSummary:
      "Run from the project that should own the skills. The project scope writes to <project>/.claude/skills/.",
    chatgptLabel: "ChatGPT · plugin marketplace",
    chatgptSummary:
      "For one skill, download its ZIP and upload it directly. For the complete collection, import the skills-only plugin from GitHub in an eligible workspace.",
    chatgptSkillDownloadLabel: "Download skill",
    chatgptSkillDownloadPath: "Open any Skill → Download Skill ZIP",
    chatgptSkillUploadLabel: "Upload skill",
    chatgptSkillUploadPath: "Plugins → Skills → Create → Upload from computer",
    chatgptMarketplaceLabel: "Complete collection",
    chatgptMarketplacePath: "Workspace settings → Plugins → Add → Import marketplace",
    chatgptAvailability:
      "These options may vary by plan, workspace settings, role, region, and surface.",
    verifyAgentsLabel: "Verify Codex / Agent Skills",
    verifyClaudeLabel: "Verify Claude Code",
    verifyChatgptLabel: "Verify ChatGPT",
    verifyChatgptSummary:
      "Confirm the uploaded skill or imported plugin is visible in the eligible ChatGPT workspace.",
    recoveryTitle: "If the path is wrong",
    recoverySummary:
      "The default installer targets ~/.agents/skills/. Use --target claude-code when Claude Code should discover the skills instead.",
    installationSuccessSuffix: "skills ready to use.",
    metrics: [
      { label: "STAGES", value: "05 stages" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODE", value: "First installation" },
    ],
    stages: [
      { id: "orientation", label: "Choose environment" },
      { id: "install", label: "Choose what to install" },
      { id: "verify", label: "Verify destination" },
      { id: "maintain", label: "Recover / maintain" },
      { id: "continue", label: "Choose next" },
    ],
  },
  "pt-BR": {
    publicationLabel: "MANUAL DE CAMPO",
    editionLabel: "01 / INSTALAR E VERIFICAR",
    indexLabel: "Etapas da instalação",
    targetGuideTitle: "Escolha primeiro o ambiente",
    targets: [
      {
        id: "agents",
        label: "Codex / Agent Skills",
        mode: "Filesystem · pessoal",
        summary:
          "Use o instalador padrão quando o Codex ou outro runtime compatível com Agent Skills deve descobrir estes métodos.",
        destinations: ["~/.agents/skills/"],
      },
      {
        id: "claude-code",
        label: "Claude Code",
        mode: "Filesystem · pessoal ou projeto",
        summary:
          "Use o alvo do Claude Code quando os métodos devem ser descobertos pelos diretórios nativos de skills do Claude Code.",
        destinations: ["~/.claude/skills/", "<projeto>/.claude/skills/"],
      },
      {
        id: "chatgpt",
        label: "ChatGPT",
        mode: "Upload ou marketplace de plugins",
        summary:
          "Instale o ZIP de uma skill diretamente ou importe o marketplace completo composto somente por skills em um workspace elegível.",
        destinations: ["Sem instalador de filesystem"],
      },
    ],
    claudeScopeSummary:
      "Pessoal é o padrão. Adicione --scope project quando o projeto atual deve ser o dono das skills instaladas.",
    defaultTargetLabel: "Codex / Agent Skills · alvo padrão",
    defaultTargetSummary:
      "Estes comandos usam o alvo pessoal padrão e gravam em ~/.agents/skills/.",
    installOptions: {
      complete: "Instala a coleção canônica completa no alvo pessoal de filesystem selecionado.",
      skill: "Instala somente a skill canônica informada; troque o slug do exemplo pelo método necessário.",
      pack: "Instala os membros de um pack ativo, mantendo cada membro invocável de forma independente.",
    },
    claudeCodeLabel: "Claude Code · pessoal",
    claudeCodeSummary:
      "Instala a coleção completa em ~/.claude/skills/ para ficar disponível nos projetos locais do Claude Code.",
    claudeCodeProjectLabel: "Claude Code · projeto",
    claudeCodeProjectSummary:
      "Execute a partir do projeto que deve ser o dono das skills. O escopo de projeto grava em <projeto>/.claude/skills/.",
    chatgptLabel: "ChatGPT · marketplace de plugins",
    chatgptSummary:
      "Para uma skill, baixe o ZIP e faça o upload diretamente. Para a coleção completa, importe pelo GitHub o plugin composto somente por skills em um workspace elegível.",
    chatgptSkillDownloadLabel: "Baixar skill",
    chatgptSkillDownloadPath: "Abra qualquer skill → Baixar ZIP da skill",
    chatgptSkillUploadLabel: "Carregar skill",
    chatgptSkillUploadPath: "Plugins → Habilidades → Criar → Carregar do computador",
    chatgptMarketplaceLabel: "Coleção completa",
    chatgptMarketplacePath: "Configurações do workspace → Plugins → Adicionar → Importar marketplace",
    chatgptAvailability:
      "Essas opções podem variar conforme plano, configurações do workspace, função, região e superfície.",
    verifyAgentsLabel: "Verificar Codex / Agent Skills",
    verifyClaudeLabel: "Verificar Claude Code",
    verifyChatgptLabel: "Verificar ChatGPT",
    verifyChatgptSummary:
      "Confirme que a skill enviada ou o plugin importado aparece no workspace elegível do ChatGPT.",
    recoveryTitle: "Se o caminho estiver errado",
    recoverySummary:
      "O instalador padrão aponta para ~/.agents/skills/. Use --target claude-code quando o Claude Code deve descobrir as skills.",
    installationSuccessSuffix: "skills prontas para usar.",
    metrics: [
      { label: "ETAPAS", value: "05 etapas" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODO", value: "Primeira instalação" },
    ],
    stages: [
      { id: "orientation", label: "Escolha o ambiente" },
      { id: "install", label: "Escolha o que instalar" },
      { id: "verify", label: "Verifique o destino" },
      { id: "maintain", label: "Corrija / mantenha" },
      { id: "continue", label: "Próximo passo" },
    ],
  },
} as const satisfies Readonly<Record<Locale, FieldManualCopy>>;

export const livingProgramCopy = {
  en: {
    publicationLabel: "LIVING PROGRAM",
    indexLabel: "Program index",
    summary:
      "Stable 1.0.0 is the current release. This program separates release status from skill maturity and tracks post-Stable work without implying a new release.",
    principle:
      "Release status, skill maturity, and roadmap stage are separate signals. Entries move only when their purpose, implementation, and verification support the next stage.",
    releaseStateLabel: "Current release",
    postStableLabel: "Post-Stable work",
    postStableSummary:
      "Unreleased changes are tracked separately from the current Stable release; they do not create a new release state on their own.",
    metrics: {
      stages: "Stages",
      entries: "Published entries",
      empty: "Open stages",
    },
    emptyLabel: "No published entries",
    entrySingular: "entry",
    entryPlural: "entries",
  },
  "pt-BR": {
    publicationLabel: "PROGRAMA VIVO",
    indexLabel: "Índice do programa",
    summary:
      "Stable 1.0.0 é a release atual. Este programa separa o status da release da maturidade das skills e acompanha o trabalho pós-Stable sem sugerir uma nova release.",
    principle:
      "Status da release, maturidade das skills e etapa do roadmap são sinais separados. As entradas só avançam quando propósito, implementação e verificação sustentam a próxima etapa.",
    releaseStateLabel: "Release atual",
    postStableLabel: "Trabalho pós-Stable",
    postStableSummary:
      "Mudanças não lançadas são acompanhadas separadamente da release Stable atual; por si só, elas não criam um novo estado de release.",
    metrics: {
      stages: "Etapas",
      entries: "Entradas publicadas",
      empty: "Etapas abertas",
    },
    emptyLabel: "Sem entradas publicadas",
    entrySingular: "entrada",
    entryPlural: "entradas",
  },
} as const satisfies Readonly<Record<Locale, LivingProgramCopy>>;
