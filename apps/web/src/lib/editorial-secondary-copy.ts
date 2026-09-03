import type { Locale } from "./locales";

type FieldManualStageId = "orientation" | "install" | "verify" | "maintain" | "continue";

interface FieldManualCopy {
  readonly publicationLabel: string;
  readonly editionLabel: string;
  readonly indexLabel: string;
  readonly claudeCodeLabel: string;
  readonly chatgptLabel: string;
  readonly chatgptSummary: string;
  readonly chatgptSkillDownloadLabel: string;
  readonly chatgptSkillDownloadPath: string;
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
    editionLabel: "01 / INSTALL AND VERIFY",
    indexLabel: "Installation steps",
    claudeCodeLabel: "Claude Code · personal",
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
    installationSuccessSuffix: "skills ready to use.",
    metrics: [
      { label: "STAGES", value: "05 stages" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODE", value: "First installation" },
    ],
    stages: [
      { id: "orientation", label: "Choose a path" },
      { id: "install", label: "Install" },
      { id: "verify", label: "Verify" },
      { id: "maintain", label: "Maintain" },
      { id: "continue", label: "Choose next" },
    ],
  },
  "pt-BR": {
    publicationLabel: "MANUAL DE CAMPO",
    editionLabel: "01 / INSTALAR E VERIFICAR",
    indexLabel: "Etapas da instalação",
    claudeCodeLabel: "Claude Code · pessoal",
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
    installationSuccessSuffix: "skills prontas para usar.",
    metrics: [
      { label: "ETAPAS", value: "05 etapas" },
      { label: "SHELLS", value: "Bash + PowerShell" },
      { label: "MODO", value: "Primeira instalação" },
    ],
    stages: [
      { id: "orientation", label: "Escolha um caminho" },
      { id: "install", label: "Instalar" },
      { id: "verify", label: "Verificar" },
      { id: "maintain", label: "Manter" },
      { id: "continue", label: "Próximo passo" },
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
