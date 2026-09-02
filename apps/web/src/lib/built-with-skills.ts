import type { Locale } from "./locales";

export interface CaseEvidence {
  readonly type: "source" | "pull-request" | "commit" | "qa";
  readonly label: string;
  readonly href: string;
}

export interface CaseProject {
  readonly id: string;
  readonly name: string;
  readonly repository?: string;
}

export interface BuiltWithSkillsCase {
  readonly slug: string;
  readonly date: string;
  readonly sourcePath: string;
  readonly evidenceClass: "internal" | "real-use";
  readonly project: CaseProject;
  readonly title: string;
  readonly summary: string;
  readonly challenge: string;
  readonly skills: readonly string[];
  readonly decisions: readonly { readonly title: string; readonly summary: string }[];
  readonly results: readonly string[];
  readonly evidence: readonly CaseEvidence[];
}

type CaseSourceEvidence = Readonly<{
  type: CaseEvidence["type"];
  href: string;
  labels: Readonly<Record<Locale, string>>;
}>;

type CaseSource = Readonly<{
  slug: string;
  date: string;
  sourcePath: string;
  evidenceClass: BuiltWithSkillsCase["evidenceClass"];
  project: CaseProject;
  skills: readonly string[];
  evidence: readonly CaseSourceEvidence[];
  locales: Readonly<
    Record<
      Locale,
      Omit<
        BuiltWithSkillsCase,
        "slug" | "date" | "sourcePath" | "evidenceClass" | "project" | "skills" | "evidence"
      >
    >
  >;
}>;

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";
const portfolioCaseSourcePath =
  "docs/built-with-skills/2026-09-02-portfolio-translation-hardening.md";

const agentSkillsStudioProject = {
  id: "agent-skills-studio",
  name: "Agent Skills Studio",
  repository: repositoryUrl,
} as const satisfies CaseProject;

const portfolio2025Project = {
  id: "portfolio-2025",
  name: "Portfolio 2025",
} as const satisfies CaseProject;

const sharedSkills = [
  "designing-ui-systems",
  "building-premium-nextjs-interfaces",
  "building-conversion-product-pages",
] as const;

function sourceEvidence(sourcePath: string): readonly CaseSourceEvidence[] {
  return [
    {
      type: "source",
      href: `${repositoryUrl}/blob/main/${sourcePath}`,
      labels: {
        en: "Source record",
        "pt-BR": "Registro-fonte",
      },
    },
  ];
}

const cases = [
  {
    slug: "portfolio-translation-hardening",
    date: "2026-09-02",
    sourcePath: portfolioCaseSourcePath,
    evidenceClass: "real-use",
    project: portfolio2025Project,
    skills: [
      "selecting-working-methods",
      "building-regression-tests",
      "testing-integration-boundaries",
      "shipping-github-vercel-changes",
    ],
    evidence: [
      {
        type: "source",
        href: `${repositoryUrl}/blob/main/${portfolioCaseSourcePath}`,
        labels: {
          en: "Public case record",
          "pt-BR": "Registro público do case",
        },
      },
      {
        type: "qa",
        href: `${repositoryUrl}/blob/main/${portfolioCaseSourcePath}#verification-record`,
        labels: {
          en: "Verification record",
          "pt-BR": "Registro de verificação",
        },
      },
    ],
    locales: {
      en: {
        title: "Hardening a translation provider after a production incident",
        summary:
          "A real portfolio incident became a regression-first fix that protects the Groq boundary from a retired model override while preserving supported explicit configuration.",
        challenge:
          "A production error showed a retired Groq model reaching the translation boundary through a stale environment override. Fix the proven failure path without disabling legitimate overrides or changing the live site before verification.",
        decisions: [
          {
            title: "Route by ownership",
            summary:
              "Use method selection to keep regression testing, integration-boundary verification, and delivery as distinct responsibilities instead of stacking overlapping workflows.",
          },
          {
            title: "Reproduce before fixing",
            summary:
              "Capture the actual outbound provider model in a boundary-level regression test and require the known retired override to fail before implementation.",
          },
          {
            title: "Guard only the proven legacy value",
            summary:
              "Map the exact retired model to the supported default while preserving other explicit model overrides.",
          },
          {
            title: "Keep production isolated",
            summary:
              "Merge and verify in the development branch first. No production promotion is claimed, and the missing Vercel development deployment remains documented as a limitation.",
          },
        ],
        results: [
          "161/161 tests passed on the development merge commit.",
          "Changed-source lint and CI typecheck passed after merge.",
          "The retired override now resolves to openai/gpt-oss-20b while other explicit overrides remain configurable.",
          "No Vercel Preview was emitted for the development merge, so this case does not claim production runtime verification.",
        ],
      },
      "pt-BR": {
        title: "Hardening de um provider de tradução após um incidente em produção",
        summary:
          "Um incidente real do portfólio virou uma correção guiada por regressão que protege a fronteira do Groq contra um override de modelo aposentado sem remover configurações explícitas suportadas.",
        challenge:
          "Um erro em produção mostrou um modelo aposentado do Groq chegando à fronteira de tradução por meio de um override antigo de ambiente. Corrigir o caminho comprovado sem desabilitar overrides legítimos nem alterar o site no ar antes da verificação.",
        decisions: [
          {
            title: "Rotear por ownership",
            summary:
              "Usar seleção de métodos para manter teste de regressão, verificação da fronteira de integração e entrega como responsabilidades distintas, sem empilhar workflows sobrepostos.",
          },
          {
            title: "Reproduzir antes de corrigir",
            summary:
              "Capturar o modelo realmente enviado ao provider em um teste de fronteira e exigir a falha do override aposentado conhecido antes da implementação.",
          },
          {
            title: "Proteger apenas o valor legado comprovado",
            summary:
              "Mapear o modelo aposentado exato para o default suportado, preservando outros overrides explícitos de modelo.",
          },
          {
            title: "Manter produção isolada",
            summary:
              "Integrar e verificar primeiro na branch de desenvolvimento. Nenhuma promoção para produção é afirmada, e a ausência do deployment de desenvolvimento na Vercel permanece documentada como limitação.",
          },
        ],
        results: [
          "161/161 testes passaram no commit integrado à branch de desenvolvimento.",
          "Lint dos arquivos alterados e typecheck de CI passaram após o merge.",
          "O override aposentado agora resolve para openai/gpt-oss-20b enquanto outros overrides explícitos continuam configuráveis.",
          "Nenhum Preview da Vercel foi emitido para o merge em desenvolvimento; portanto, este case não afirma verificação de runtime em produção.",
        ],
      },
    },
  },
  {
    slug: "catalog-experience",
    date: "2026-08-28",
    sourcePath: "docs/built-with-skills/2026-08-28-catalog-experience.md",
    evidenceClass: "internal",
    project: agentSkillsStudioProject,
    skills: sharedSkills,
    evidence: sourceEvidence("docs/built-with-skills/2026-08-28-catalog-experience.md"),
    locales: {
      en: {
        title: "Catalog experience",
        summary: "A searchable, bilingual catalog that turns validated skill metadata into a clear product decision flow.",
        challenge: "Make 18 technical workflows easy to compare and install without duplicating the canonical skill instructions or widening the client boundary.",
        decisions: [
          { title: "Reuse the visual system", summary: "Semantic tokens, spacing, focus treatment, buttons, borders, and breakpoints compose the experience without a parallel component library." },
          { title: "Keep the client boundary narrow", summary: "Server Components own catalog data, localization, metadata, relations, and commands. Only URL-backed filters and copy feedback run on the client." },
          { title: "Organize around the decision", summary: "Purpose, benefit, use cases, and prompts precede installation; compatibility and source facts remain visible without competing with the primary flow." },
        ],
        results: [
          "18 skills searchable and filterable in two locales.",
          "36 localized skill detail pages generated statically.",
          "Shareable catalog URLs powered by nuqs.",
          "Localized metadata, language alternates, Open Graph, and structured data on every detail page.",
        ],
      },
      "pt-BR": {
        title: "Experiência do catálogo",
        summary: "Um catálogo bilíngue com busca que transforma metadados validados em um fluxo claro de decisão de produto.",
        challenge: "Tornar 18 fluxos técnicos fáceis de comparar e instalar sem duplicar as instruções canônicas das skills nem ampliar desnecessariamente a camada cliente.",
        decisions: [
          { title: "Reutilizar o sistema visual", summary: "Tokens semânticos, espaçamento, foco, botões, bordas e breakpoints compõem a experiência sem criar uma biblioteca paralela." },
          { title: "Manter estreita a camada cliente", summary: "Server Components cuidam de catálogo, localização, metadata, relações e comandos. Apenas filtros na URL e feedback de cópia rodam no cliente." },
          { title: "Organizar em torno da decisão", summary: "Propósito, benefício, casos de uso e prompts antecedem a instalação; compatibilidade e fonte permanecem visíveis sem competir com o fluxo principal." },
        ],
        results: [
          "18 skills pesquisáveis e filtráveis em dois idiomas.",
          "36 páginas localizadas de detalhes geradas estaticamente.",
          "URLs compartilháveis do catálogo com nuqs.",
          "Metadata localizada, idiomas alternativos, Open Graph e dados estruturados em cada detalhe.",
        ],
      },
    },
  },
  {
    slug: "pack-experience",
    date: "2026-08-28",
    sourcePath: "docs/built-with-skills/2026-08-28-pack-experience.md",
    evidenceClass: "internal",
    project: agentSkillsStudioProject,
    skills: sharedSkills,
    evidence: sourceEvidence("docs/built-with-skills/2026-08-28-pack-experience.md"),
    locales: {
      en: {
        title: "Pack experience",
        summary: "A catalog-backed pack experience that separates installable collections from transparent roadmap content.",
        challenge: "Present active and planned packs honestly while preserving identity, ordered composition, and a direct installation path where one actually exists.",
        decisions: [
          { title: "Give statuses different roles", summary: "Active packs provide commands and ordered composition. Planned packs explain direction and outcomes without fake or disabled installation controls." },
          { title: "Derive pages from catalog facts", summary: "Names, status, summaries, outcomes, version, color, order, membership, and eligible commands all come from validated catalog data." },
          { title: "Express identity within one system", summary: "A scoped accent token differentiates packs while shared surfaces, typography, spacing, focus, and skill cards preserve cohesion." },
        ],
        results: [
          "Six localized pack entries published in each language.",
          "Twelve localized pack detail pages generated statically.",
          "Three active packs with Bash and PowerShell commands.",
          "Three planned packs with roadmap context and no misleading install action.",
        ],
      },
      "pt-BR": {
        title: "Experiência dos pacotes",
        summary: "Uma experiência derivada do catálogo que separa coleções instaláveis de conteúdo transparente de roadmap.",
        challenge: "Apresentar pacotes ativos e planejados com honestidade, preservando identidade, composição ordenada e um caminho direto de instalação apenas quando ele existe.",
        decisions: [
          { title: "Dar papéis distintos aos status", summary: "Pacotes ativos oferecem comandos e composição ordenada. Os planejados explicam direção e resultados sem controles falsos ou desabilitados." },
          { title: "Derivar páginas dos fatos do catálogo", summary: "Nome, status, resumo, resultados, versão, cor, ordem, membros e comandos elegíveis vêm dos dados validados." },
          { title: "Expressar identidade em um só sistema", summary: "Um token de destaque por pacote cria distinção enquanto superfícies, tipografia, espaçamento, foco e cards preservam a coesão." },
        ],
        results: [
          "Seis entradas localizadas de pacotes publicadas em cada idioma.",
          "Doze páginas localizadas de detalhes geradas estaticamente.",
          "Três pacotes ativos com comandos Bash e PowerShell.",
          "Três pacotes planejados com contexto de roadmap e sem ação enganosa de instalação.",
        ],
      },
    },
  },
] as const satisfies readonly CaseSource[];

export function getBuiltWithSkillsCases(locale: Locale): readonly BuiltWithSkillsCase[] {
  return cases.map((item) => ({
    slug: item.slug,
    date: item.date,
    sourcePath: item.sourcePath,
    evidenceClass: item.evidenceClass,
    project: item.project,
    skills: item.skills,
    evidence: item.evidence.map((entry) => ({
      type: entry.type,
      label: entry.labels[locale],
      href: entry.href,
    })),
    ...item.locales[locale],
  }));
}

export function hasInspectableRealUseEvidence(item: BuiltWithSkillsCase) {
  if (item.evidenceClass !== "real-use") {
    return true;
  }

  return item.evidence.some(
    (entry) =>
      entry.type === "pull-request" || entry.type === "commit" || entry.type === "qa",
  );
}

export function getBuiltWithSkillsCaseBySlug(locale: Locale, slug: string) {
  return getBuiltWithSkillsCases(locale).find((item) => item.slug === slug);
}

export function getBuiltWithSkillsSlugs() {
  return cases.map((item) => item.slug);
}
