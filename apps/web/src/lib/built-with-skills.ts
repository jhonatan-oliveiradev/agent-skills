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
const rocketCodebaseCaseSourcePath =
  "docs/built-with-skills/2026-09-02-rocket-codebase-intelligence-cosmic-sdk-removal.md";
const rocketCaseSourcePath =
  "docs/built-with-skills/2026-09-02-rocket-editorial-error-boundary.md";
const pingCaseSourcePath =
  "docs/built-with-skills/2026-09-02-ping-space-voice-membership-authorization.md";
const portfolioCaseSourcePath =
  "docs/built-with-skills/2026-09-02-portfolio-translation-hardening.md";

const agentSkillsStudioProject = {
  id: "agent-skills-studio",
  name: "Agent Skills Studio",
  repository: repositoryUrl,
} as const satisfies CaseProject;

const rocketProject = {
  id: "rocket-unesp",
  name: "Rocket UNESP",
} as const satisfies CaseProject;

const pingProject = {
  id: "ping",
  name: "PING",
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
    slug: "rocket-codebase-intelligence-cosmic-sdk-removal",
    date: "2026-09-02",
    sourcePath: rocketCodebaseCaseSourcePath,
    evidenceClass: "real-use",
    project: rocketProject,
    skills: [
      "mapping-existing-codebase-structure",
      "investigating-codebase-semantically",
      "tracing-code-execution-paths",
      "analyzing-change-blast-radius",
      "planning-codebase-changes-with-evidence",
    ],
    evidence: [
      {
        type: "source",
        href: `${repositoryUrl}/blob/main/${rocketCodebaseCaseSourcePath}`,
        labels: {
          en: "Public case record",
          "pt-BR": "Registro público do case",
        },
      },
      {
        type: "qa",
        href: `${repositoryUrl}/blob/main/${rocketCodebaseCaseSourcePath}#verification-record`,
        labels: {
          en: "Verification record",
          "pt-BR": "Registro de verificação",
        },
      },
    ],
    locales: {
      en: {
        title: "Removing a deprecated Cosmic SDK through evidence-led codebase analysis",
        summary:
          "A real Rocket maintenance pass used the complete Codebase Intelligence pack to separate live Payload runtime ownership from historical Cosmic compatibility and safely remove one obsolete SDK write path.",
        challenge:
          "Determine whether Cosmic references still represented a live public-runtime dependency after the Payload cutover, then remove only what repository evidence proved obsolete without breaking migration compatibility, local fallbacks, database behavior, or UI.",
        decisions: [
          {
            title: "Map ownership before deleting legacy references",
            summary:
              "Trace Home and Publications through Payload and their local fallbacks before treating repository-wide Cosmic search hits as one dependency surface.",
          },
          {
            title: "Separate compatibility from package dependency",
            summary:
              "Keep the historical migration path because it reads Cosmic through native fetch, while rejecting migration and CDN configuration hits as proof that the deprecated SDK is still required.",
          },
          {
            title: "Bound the blast radius to the observed writer",
            summary:
              "Remove only the cosmicjs dependency, populate npm entrypoint, obsolete population writer, and derived lockfile records; leave runtime loaders, migration semantics, schema, database, and visual code untouched.",
          },
          {
            title: "Prove the boundary with RED→GREEN CI",
            summary:
              "Start with a regression contract that fails on the existing SDK, regenerate the lockfile through npm, and accept the cleanup only after the canonical Rocket pipeline passes on the final evidence HEAD.",
          },
        ],
        results: [
          "The deprecated cosmicjs SDK and obsolete Cosmic write-only population path were removed.",
          "Historical Cosmic-to-Payload migration remains available through native fetch.",
          "Public Home and Publications remain Payload-first with their local fallback behavior intact.",
          "The final Rocket CI passed dependency install, Payload type drift, full tests, lint, typecheck, and production build.",
          "All five Codebase Intelligence methods contributed to the decision, blast-radius boundary, implementation plan, or verification evidence.",
        ],
      },
      "pt-BR": {
        title: "Remoção de um SDK Cosmic obsoleto com análise de codebase orientada por evidências",
        summary:
          "Uma manutenção real no Rocket usou o pack completo de Codebase Intelligence para separar a ownership atual do runtime Payload da compatibilidade histórica com Cosmic e remover com segurança um único caminho legado de escrita.",
        challenge:
          "Determinar se referências a Cosmic ainda representavam uma dependência viva do runtime público após o cutover para Payload e remover apenas o que as evidências do repositório comprovassem obsoleto, sem quebrar migração, fallbacks locais, banco ou UI.",
        decisions: [
          {
            title: "Mapear ownership antes de apagar referências legadas",
            summary:
              "Rastrear Home e Publications pelo Payload e seus fallbacks locais antes de tratar todos os resultados de busca por Cosmic como uma única superfície de dependência.",
          },
          {
            title: "Separar compatibilidade de dependência de pacote",
            summary:
              "Preservar a migração histórica porque ela lê Cosmic com fetch nativo e rejeitar hits de migração e configuração de CDN como prova de que o SDK depreciado ainda era necessário.",
          },
          {
            title: "Limitar o blast radius ao writer observado",
            summary:
              "Remover apenas a dependência cosmicjs, o script npm populate, o writer legado e os registros derivados do lockfile, mantendo loaders, semântica de migração, schema, banco e código visual intactos.",
          },
          {
            title: "Provar a fronteira com CI RED→GREEN",
            summary:
              "Começar com um contrato de regressão que falha com o SDK existente, regenerar o lockfile pelo npm e aceitar o cleanup apenas depois do pipeline canônico do Rocket passar no HEAD final de evidência.",
          },
        ],
        results: [
          "O SDK cosmicjs depreciado e o caminho legado de escrita/população do Cosmic foram removidos.",
          "A migração histórica Cosmic→Payload permanece disponível por fetch nativo.",
          "Home e Publications públicos continuam Payload-first com seus fallbacks locais preservados.",
          "O CI final do Rocket passou instalação, drift de tipos do Payload, suíte completa de testes, lint, typecheck e build de produção.",
          "Os cinco métodos de Codebase Intelligence contribuíram para a decisão, fronteira de blast radius, plano de implementação ou evidência de verificação.",
        ],
      },
    },
  },
  {
    slug: "rocket-editorial-error-boundary",
    date: "2026-09-02",
    sourcePath: rocketCaseSourcePath,
    evidenceClass: "real-use",
    project: rocketProject,
    skills: [
      "building-premium-nextjs-interfaces",
      "writing-product-and-ux-copy",
    ],
    evidence: [
      {
        type: "source",
        href: `${repositoryUrl}/blob/main/${rocketCaseSourcePath}`,
        labels: {
          en: "Public case record",
          "pt-BR": "Registro público do case",
        },
      },
      {
        type: "qa",
        href: `${repositoryUrl}/blob/main/${rocketCaseSourcePath}#verification-record`,
        labels: {
          en: "Verification record",
          "pt-BR": "Registro de verificação",
        },
      },
    ],
    locales: {
      en: {
        title: "Shipping a recoverable Rocket error state through real Studio consumption",
        summary:
          "A real Rocket frontend improvement consumed the Studio microsite, catalog, filesystem installer, and direct ChatGPT Skill distribution before shipping a tested editorial error boundary.",
        challenge:
          "Add a recoverable error boundary to the public Rocket frontend while proving that Agent Skills Studio can be discovered, installed, uploaded to ChatGPT, and used to materially improve a real product change.",
        decisions: [
          {
            title: "Consume before implementing",
            summary:
              "Use the public microsite and catalog to select the interface method, then execute the real RC1 installer in the Rocket CI workspace instead of copying a Skill manually.",
          },
          {
            title: "Validate the ChatGPT path that was actually available",
            summary:
              "Upload the canonical writing-product-and-ux-copy Skill directly through the ChatGPT Skills UI and treat marketplace plugin import as an alternative mode rather than inventing unavailable evidence.",
          },
          {
            title: "Let the installed Skill change the artifact",
            summary:
              "Use the newly installed UX-copy method to remove an unsupported 500 status claim and replace vague failure language with an actionable page-load error and retry path.",
          },
          {
            title: "Keep the final product diff isolated",
            summary:
              "Remove the temporary Studio-consumption CI step before merge and count the case only after Rocket main passed tests, lint, typecheck, and production build.",
          },
        ],
        results: [
          "Rocket gained a recoverable segment-level error boundary with retry and home fallback actions.",
          "The boundary does not leak technical error details or invent an HTTP 500 status.",
          "Microsite, catalog, installer, and direct ChatGPT Skill distribution were exercised in real use.",
          "The directly uploaded ChatGPT Skill materially changed the merged product copy and state semantics.",
          "Rocket main passed tests, lint, typecheck, and production build on the post-merge commit.",
        ],
      },
      "pt-BR": {
        title: "Entrega de um estado de erro recuperável no Rocket com consumo real do Studio",
        summary:
          "Uma melhoria real do frontend do Rocket consumiu microsite, catálogo, installer em filesystem e distribuição direta de Skill no ChatGPT antes de entregar uma error boundary editorial testada.",
        challenge:
          "Adicionar uma error boundary recuperável ao frontend público do Rocket enquanto comprovamos que o Agent Skills Studio pode ser descoberto, instalado, enviado ao ChatGPT e usado para melhorar materialmente uma mudança real de produto.",
        decisions: [
          {
            title: "Consumir antes de implementar",
            summary:
              "Usar microsite e catálogo públicos para selecionar o método de interface e executar o installer real do RC1 no workspace de CI do Rocket, em vez de copiar uma Skill manualmente.",
          },
          {
            title: "Validar o caminho do ChatGPT realmente disponível",
            summary:
              "Enviar a Skill canônica writing-product-and-ux-copy diretamente pela interface de Habilidades do ChatGPT e tratar importação por marketplace plugin como modo alternativo, sem fabricar evidência indisponível.",
          },
          {
            title: "Fazer a Skill instalada alterar o artefato",
            summary:
              "Usar o método de UX copy recém-instalado para remover uma afirmação indevida de status 500 e trocar linguagem vaga por um erro de carregamento acionável com caminho de retry.",
          },
          {
            title: "Manter o diff final do produto isolado",
            summary:
              "Remover o step temporário de consumo do Studio antes do merge e contar o case apenas depois de a main do Rocket passar testes, lint, typecheck e build de produção.",
          },
        ],
        results: [
          "O Rocket ganhou uma error boundary de segmento recuperável com ações de retry e retorno à home.",
          "A boundary não expõe detalhes técnicos do erro nem inventa um status HTTP 500.",
          "Microsite, catálogo, installer e distribuição direta de Skill no ChatGPT foram exercitados em uso real.",
          "A Skill enviada diretamente ao ChatGPT alterou materialmente a copy e a semântica de estado do produto integrado.",
          "A main do Rocket passou testes, lint, typecheck e build de produção no commit pós-merge.",
        ],
      },
    },
  },
  {
    slug: "ping-space-voice-membership-authorization",
    date: "2026-09-02",
    sourcePath: pingCaseSourcePath,
    evidenceClass: "real-use",
    project: pingProject,
    skills: [
      "selecting-working-methods",
      "reviewing-api-security",
      "building-regression-tests",
      "testing-integration-boundaries",
      "shipping-github-vercel-changes",
    ],
    evidence: [
      {
        type: "source",
        href: `${repositoryUrl}/blob/main/${pingCaseSourcePath}`,
        labels: {
          en: "Public case record",
          "pt-BR": "Registro público do case",
        },
      },
      {
        type: "qa",
        href: `${repositoryUrl}/blob/main/${pingCaseSourcePath}#verification-record`,
        labels: {
          en: "Verification record",
          "pt-BR": "Registro de verificação",
        },
      },
    ],
    locales: {
      en: {
        title: "Hardening Space voice credential authorization",
        summary:
          "A real PING authorization hardening pass moved active Space membership validation into the media credential trust boundary, then repaired a stale advisory-lock test double without another production change.",
        challenge:
          "A Space voice credential issuer was relying too heavily on an upstream join claim. Make the credential boundary independently prove that the requester is still an active member of the Space tied to the voice channel, while preserving established Server and DM behavior.",
        decisions: [
          {
            title: "Put authorization at the credential boundary",
            summary:
              "Resolve the voice channel back to its Space and require an active SpaceMember record before issuing Space media credentials instead of treating the upstream join claim as sufficient proof.",
          },
          {
            title: "Prove the unauthorized path first",
            summary:
              "Encode the stale or unauthorized Space membership claim as a deliberate RED regression before changing production code.",
          },
          {
            title: "Diagnose the post-merge failure separately",
            summary:
              "When main exposed a stale advisory-lock transaction fake, keep the security fix intact and repair only the test double that no longer represented the credential boundary contract.",
          },
          {
            title: "Verify the final main merge",
            summary:
              "Count the case only after the test-only follow-up merged and the canonical main workflow passed tests, formatting, lint, typecheck, and build on the final merge commit.",
          },
        ],
        results: [
          "Space voice credential issuance now independently verifies active membership in the Space tied to the channel.",
          "The security regression moved from deliberate RED to GREEN while existing Server and DM credential semantics remained covered.",
          "The only post-merge failure was isolated to a stale advisory-lock test double and repaired in a test-only follow-up with no additional production change.",
          "The final main-branch workflow passed tests, formatting, lint, typecheck, and build before this case was recorded.",
        ],
      },
      "pt-BR": {
        title: "Hardening da autorização de credenciais de voz em Spaces",
        summary:
          "Um hardening real de autorização no PING moveu a validação de membership ativa do Space para o próprio trust boundary de credenciais de mídia e depois corrigiu um double legado do teste de advisory lock sem nova alteração de produção.",
        challenge:
          "O emissor de credenciais de voz em Spaces dependia demais de um claim upstream de entrada. Fazer a própria fronteira de credenciais comprovar que o usuário ainda é membro ativo do Space associado ao canal de voz, preservando os comportamentos já estabelecidos para Server e DM.",
        decisions: [
          {
            title: "Colocar a autorização na fronteira de credenciais",
            summary:
              "Resolver o canal de voz até seu Space e exigir um registro SpaceMember ativo antes de emitir credenciais de mídia, em vez de tratar o claim upstream de entrada como prova suficiente.",
          },
          {
            title: "Provar primeiro o caminho não autorizado",
            summary:
              "Codificar o claim de membership ausente ou desatualizada como uma regressão RED deliberada antes de alterar o código de produção.",
          },
          {
            title: "Diagnosticar separadamente a falha pós-merge",
            summary:
              "Quando a main expôs um fake desatualizado da transação do advisory lock, manter o fix de segurança intacto e corrigir somente o double de teste que já não representava o contrato da fronteira de credenciais.",
          },
          {
            title: "Verificar o merge final na main",
            summary:
              "Contar o case apenas depois do follow-up somente de testes ser integrado e o workflow canônico da main passar testes, formatação, lint, typecheck e build no commit final de merge.",
          },
        ],
        results: [
          "A emissão de credenciais de voz em Spaces agora verifica de forma independente a membership ativa no Space associado ao canal.",
          "A regressão de segurança saiu de RED deliberado para GREEN mantendo cobertos os comportamentos existentes de credenciais para Server e DM.",
          "A única falha pós-merge foi isolada em um double legado do teste de advisory lock e corrigida em um follow-up somente de testes, sem nova alteração de produção.",
          "O workflow final da main passou testes, formatação, lint, typecheck e build antes deste case ser registrado.",
        ],
      },
    },
  },
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
