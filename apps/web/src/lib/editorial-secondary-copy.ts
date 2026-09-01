import type { Locale } from "./locales";

type FieldManualStageId = "orientation" | "install" | "verify" | "maintain" | "continue";

interface FieldManualCopy {
  readonly publicationLabel: string;
  readonly editionLabel: string;
  readonly indexLabel: string;
  readonly claudeCodeLabel: string;
  readonly chatgptLabel: string;
  readonly chatgptSummary: string;
  readonly chatgptSkillUploadLabel: string;
  readonly chatgptSkillUploadPath: string;
  readonly chatgptMarketplaceLabel: string;
  readonly chatgptMarketplacePath: string;
  readonly chatgptAvailability: string;
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
    editionLabel: "01 / INITIAL SETUP",
    indexLabel: "Manual index",
    claudeCodeLabel: "Claude Code · personal",
    chatgptLabel: "ChatGPT · plugin marketplace",
    chatgptSummary:
      "Upload one Skill in ChatGPT or import the complete skills-only plugin from GitHub in an eligible workspace.",
    chatgptSkillUploadLabel: "One Skill",
    chatgptSkillUploadPath: "Plugins → Skills → Create → Upload from computer",
    chatgptMarketplaceLabel: "Complete collection",
    chatgptMarketplacePath: "Workspace settings → Plugins → Add → Import marketplace",
    chatgptAvailability:
      "Availability depends on plan, workspace settings, role, region, and surface.",
    installationSuccessSuffix: "skills ready to use.",
    metrics: [
      { label: "STAGES", value: "05 stages" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODE", value: "First setup" },
    ],
    stages: [
      { id: "orientation", label: "Orientation" },
      { id: "install", label: "Install" },
      { id: "verify", label: "Verify" },
      { id: "maintain", label: "Maintain" },
      { id: "continue", label: "Continue" },
    ],
  },
  "pt-BR": {
    publicationLabel: "MANUAL DE CAMPO",
    editionLabel: "01 / CONFIGURAÇÃO INICIAL",
    indexLabel: "Índice do manual",
    claudeCodeLabel: "Claude Code · pessoal",
    chatgptLabel: "ChatGPT · marketplace de plugins",
    chatgptSummary:
      "Carregue uma Skill no ChatGPT ou importe o plugin completo, somente de skills, pelo GitHub em um workspace elegível.",
    chatgptSkillUploadLabel: "Uma Skill",
    chatgptSkillUploadPath: "Plugins → Habilidades → Criar → Carregar do computador",
    chatgptMarketplaceLabel: "Coleção completa",
    chatgptMarketplacePath: "Configurações do workspace → Plugins → Adicionar → Importar marketplace",
    chatgptAvailability:
      "A disponibilidade depende do plano, configurações do workspace, função, região e superfície.",
    installationSuccessSuffix: "skills prontas para usar.",
    metrics: [
      { label: "ETAPAS", value: "05 etapas" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODO", value: "Primeira configuração" },
    ],
    stages: [
      { id: "orientation", label: "Orientação" },
      { id: "install", label: "Instalar" },
      { id: "verify", label: "Verificar" },
      { id: "maintain", label: "Manter" },
      { id: "continue", label: "Continuar" },
    ],
  },
} as const satisfies Readonly<Record<Locale, FieldManualCopy>>;

export const livingProgramCopy = {
  en: {
    publicationLabel: "LIVING PROGRAM",
    indexLabel: "Program index",
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
