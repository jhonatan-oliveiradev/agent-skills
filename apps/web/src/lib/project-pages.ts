import "server-only";
import type { Metadata } from "next";
import type { Locale } from "./locales";

export const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

interface ProjectPageHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
}

interface ProjectPageContent {
  readonly about: ProjectPageHero & {
    readonly purposeLabel: string;
    readonly purpose: string;
    readonly principlesLabel: string;
    readonly principles: readonly { readonly title: string; readonly summary: string }[];
    readonly stewardshipLabel: string;
    readonly stewardshipTitle: string;
    readonly stewardship: string;
    readonly sourceAction: string;
  };
  readonly contribute: ProjectPageHero & {
    readonly pathsLabel: string;
    readonly paths: readonly { readonly index: string; readonly title: string; readonly summary: string; readonly action: string; readonly href: string }[];
    readonly expectationsLabel: string;
    readonly expectationsTitle: string;
    readonly expectations: readonly string[];
  };
  readonly changelog: ProjectPageHero & {
    readonly releasesLabel: string;
    readonly unreleased: string;
    readonly sourceAction: string;
    readonly releases: readonly { readonly version: string; readonly date: string; readonly groups: readonly { readonly title: string; readonly items: readonly string[] }[] }[];
  };
}

const content: Readonly<Record<Locale, ProjectPageContent>> = {
  en: {
    about: {
      eyebrow: "About the project",
      title: "About the studio",
      summary: "Agent Skills Studio is an open, bilingual collection of reusable working methods for agents, maintained through a public repository and explicit verification gates.",
      purposeLabel: "Why it exists",
      purpose: "Useful agent behavior should be inspectable, installable, and reusable. The studio turns documented working practices into focused skills, keeps their contracts public, and groups related methods into packs whose members remain independently invokable.",
      principlesLabel: "Operating principles",
      principles: [
        { title: "Focused by default", summary: "Each skill owns a clear trigger and outcome instead of competing with a broad library of overlapping presets." },
        { title: "Evidence over claims", summary: "Release status, roadmap stages, and case studies advance from recorded verification; individual skill maturity remains a separate catalog signal." },
        { title: "Context before defaults", summary: "Skills preserve the conventions of the repository they enter before applying personal preferences." },
        { title: "Quality is part of delivery", summary: "Accessibility, performance, privacy, and verification are treated as implementation requirements." },
        { title: "Open and project-agnostic", summary: "Canonical skills remain free of private data, credentials, proprietary copy, and client-specific assumptions." },
      ],
      stewardshipLabel: "Stewardship",
      stewardshipTitle: "Maintained in public by Jhonatan Oliveira.",
      stewardship: "The repository is the source of truth for skills, catalog data, release history, and project decisions. Contributions are reviewed against the same focused contracts and verification gates used to maintain the collection.",
      sourceAction: "Inspect the repository on GitHub",
    },
    contribute: {
      eyebrow: "Open collaboration",
      title: "Contribute a focused improvement.",
      summary: "Start with the smallest reproducible change: report a limitation, validate a method in real work, or submit a narrow patch with evidence.",
      pathsLabel: "Ways to contribute",
      paths: [
        { index: "01", title: "Report a limitation", summary: "Open an issue with the expected outcome, the current limitation, and a reproducible example when possible.", action: "Open a focused issue", href: `${repositoryUrl}/issues/new` },
        { index: "02", title: "Validate a method", summary: "Run a skill or pack in real work and report what held up, what was missing, and how you verified the result.", action: "Browse validation issues", href: `${repositoryUrl}/issues` },
        { index: "03", title: "Submit a narrow patch", summary: "Prepare a focused change with equivalent EN/PT-BR metadata when applicable, relevant tests, and no private or project-specific material.", action: "Prepare a pull request", href: `${repositoryUrl}/compare` },
        { index: "04", title: "Report a security concern", summary: "Use GitHub's private security channel for vulnerabilities; do not disclose sensitive details in a public issue.", action: "Open a private advisory", href: `${repositoryUrl}/security/advisories/new` },
      ],
      expectationsLabel: "Before you submit",
      expectationsTitle: "Show the problem, change, and verification.",
      expectations: ["State the expected outcome and concrete scenario.", "Preserve existing project conventions and supported environments.", "Keep English and Brazilian Portuguese content equivalent when the change is public-facing.", "Add focused tests and run the repository validation gates.", "Remove credentials, private URLs, client data, and proprietary copy."],
    },
    changelog: {
      eyebrow: "Release history",
      title: "Changelog",
      summary: "A factual record of published releases and unreleased post-Stable changes across the collection, catalog, distribution, and public studio.",
      releasesLabel: "Published releases and unreleased changes",
      unreleased: "Unreleased",
      sourceAction: "Inspect source changelog",
      releases: [
        {
          version: "Unreleased",
          date: "Unreleased",
          groups: [
            { title: "Distribution", items: ["Added deterministic ChatGPT-ready skill ZIP downloads for every canonical skill, keeping SKILL.md at the archive root and preserving supporting files with stable relative paths.", "Added localized Skill download actions plus EN/PT-BR Getting Started guidance for ChatGPT's Upload from computer flow while keeping skills/<slug>/ as the single source of truth."] },
            { title: "Studio and roadmap", items: ["Promoted the release-qualified plugin, catalog, installers, and microsite surfaces to Stable in the public roadmap while keeping individual skill maturity distinct from Stable release status.", "Kept current README/catalog documentation aligned with 54 canonical skills and 11 active packs, and removed only confirmed orphaned localized Home/Getting Started copy."] },
            { title: "Reliability and maintenance", items: ["Removed superseded post-Stable workflow helpers so validate.yml remains the canonical workflow.", "Hardened Windows CI around the live Next integration fixture and teardown contention without raising test timeouts or serializing the entire suite.", "Restored native Method Archive select/option contrast with existing surface/text theme tokens while preserving native select semantics and keyboard behavior."] },
          ],
        },
        {
          version: "1.0.0",
          date: "2026-09-02",
          groups: [
            { title: "Stable release", items: ["Promoted the evidence-qualified Agent Skills Studio from 1.0.0-rc.2 to Stable 1.0.0 with 54 canonical skills and 11 active packs.", "Qualified Stable after four real-use cases across three distinct projects represented five active packs, including complete real-use validation of Codebase Intelligence.", "Preserved canonical skill behavior and pack composition: the Stable promotion changes release state and synchronized metadata, not method contracts."] },
            { title: "Distribution and verification", items: ["Synchronized plugin, catalog, installer, microsite package metadata, and the web lockfile at 1.0.0.", "Preserved inspectable evidence across ChatGPT direct Skill distribution, catalog discovery, installers, and microsite consumption.", "Kept Linux and Windows tests, validation, typecheck, lint, production build, and platform installer smoke tests as the canonical Stable release gate."] },
          ],
        },
        {
          version: "1.0.0-rc.2",
          date: "2026-09-02",
          groups: [
            { title: "Codebase Intelligence", items: ["Expanded the searchable catalog to 54 canonical skills across 11 active packs with Codebase Intelligence v1.", "Added five evidence-led methods for mapping structure, tracing execution, analyzing blast radius, semantic investigation, and evidence-backed change planning.", "Documented CodeGraph as an official optional integration while preserving a verified repository-inspection fallback when no code-intelligence runtime is callable.", "Standardized progressive, evidence-led context expansion to avoid unnecessary broad repository reads."] },
            { title: "Release readiness", items: ["Promoted synchronized Studio release surfaces and catalog metadata to 1.0.0-rc.2.", "Kept catalog generation, installers, plugin validation, and Linux/Windows CI aligned with the 54-skill / 11-pack collection.", "Reopened the Stable gate until real-use and CI evidence validates the Codebase Intelligence pack."] },
          ],
        },
        {
          version: "1.0.0-rc.1",
          date: "2026-09-02",
          groups: [
            { title: "Public studio", items: ["Launched the bilingual Next.js microsite with localized metadata and production deployment guidance.", "Added the searchable 49-skill catalog, skill details, ten active pack experiences, and pack installation guidance.", "Published Getting Started, Built with Skills case studies, the evidence-backed roadmap, and institutional project pages."] },
            { title: "Catalog and delivery", items: ["Added bilingual metadata for all 49 canonical skills and ten active packs.", "Added deterministic catalog generation, validation, and pack-aware atomic installation for Bash and PowerShell.", "Added the Agent Skills Studio plugin, local marketplace manifest, and Linux/Windows CI validation."] },
          ],
        },
      ],
    },
  },
  "pt-BR": {
    about: {
      eyebrow: "Sobre o projeto",
      title: "Sobre o studio",
      summary: "O Agent Skills Studio é uma coleção aberta e bilíngue de métodos de trabalho reutilizáveis para agentes, mantida em um repositório público e por gates explícitos de verificação.",
      purposeLabel: "Por que existe",
      purpose: "Comportamentos úteis de agentes devem ser inspecionáveis, instaláveis e reutilizáveis. O studio transforma práticas de trabalho documentadas em skills focadas, mantém seus contratos públicos e reúne métodos relacionados em packs cujos membros continuam invocáveis de forma independente.",
      principlesLabel: "Princípios de operação",
      principles: [
        { title: "Foco por padrão", summary: "Cada skill possui um gatilho e um resultado claros, sem competir com uma biblioteca ampla de presets sobrepostos." },
        { title: "Evidência acima de afirmações", summary: "Status da release, etapas do roadmap e estudos de caso avançam a partir de verificação registrada; a maturidade individual das skills continua sendo um sinal separado do catálogo." },
        { title: "Contexto antes de padrões", summary: "As skills preservam as convenções do repositório antes de aplicar preferências pessoais." },
        { title: "Qualidade faz parte da entrega", summary: "Acessibilidade, performance, privacidade e verificação são requisitos de implementação." },
        { title: "Aberto e independente de projeto", summary: "As skills canônicas permanecem livres de dados privados, credenciais, textos proprietários e premissas específicas de clientes." },
      ],
      stewardshipLabel: "Manutenção",
      stewardshipTitle: "Mantido publicamente por Jhonatan Oliveira.",
      stewardship: "O repositório é a fonte de verdade para skills, catálogo, histórico de versões e decisões do projeto. Contribuições são revisadas com os mesmos contratos focados e gates de verificação usados na manutenção da coleção.",
      sourceAction: "Inspecionar o repositório no GitHub",
    },
    contribute: {
      eyebrow: "Colaboração aberta",
      title: "Contribua com uma melhoria focada.",
      summary: "Comece pela menor mudança reproduzível: relate uma limitação, valide um método em trabalho real ou envie um patch delimitado com evidências.",
      pathsLabel: "Formas de contribuir",
      paths: [
        { index: "01", title: "Relate uma limitação", summary: "Abra uma issue com o resultado esperado, a limitação atual e, quando possível, um exemplo reproduzível.", action: "Abrir uma issue focada", href: `${repositoryUrl}/issues/new` },
        { index: "02", title: "Valide um método", summary: "Execute uma skill ou pack em trabalho real e relate o que funcionou, o que faltou e como você verificou o resultado.", action: "Ver issues de validação", href: `${repositoryUrl}/issues` },
        { index: "03", title: "Envie um patch delimitado", summary: "Prepare uma mudança focada com metadados EN/PT-BR equivalentes quando aplicável, testes relevantes e nenhum material privado ou específico de projeto.", action: "Preparar um pull request", href: `${repositoryUrl}/compare` },
        { index: "04", title: "Reporte uma questão de segurança", summary: "Use o canal privado do GitHub para vulnerabilidades; não publique detalhes sensíveis em uma issue pública.", action: "Abrir um advisory privado", href: `${repositoryUrl}/security/advisories/new` },
      ],
      expectationsLabel: "Antes de enviar",
      expectationsTitle: "Mostre o problema, a mudança e a verificação.",
      expectations: ["Declare o resultado esperado e o cenário concreto.", "Preserve as convenções existentes e os ambientes suportados.", "Mantenha equivalentes os conteúdos em inglês e português brasileiro quando a mudança for pública.", "Adicione testes focados e execute os gates de validação.", "Remova credenciais, URLs privadas, dados de clientes e textos proprietários."],
    },
    changelog: {
      eyebrow: "Histórico de versões",
      title: "Histórico de mudanças",
      summary: "Um registro factual das releases publicadas e das mudanças pós-Stable ainda não lançadas na coleção, catálogo, distribuição e studio público.",
      releasesLabel: "Releases publicadas e mudanças não lançadas",
      unreleased: "Não lançada",
      sourceAction: "Inspecionar changelog na fonte",
      releases: [
        {
          version: "Não lançada",
          date: "Não lançada",
          groups: [
            { title: "Distribuição", items: ["Adição de downloads ZIP determinísticos e prontos para ChatGPT para cada skill canônica, mantendo SKILL.md na raiz do arquivo e preservando arquivos auxiliares com caminhos relativos estáveis.", "Adição de ações localizadas de download de Skill e orientação EN/PT-BR em Primeiros passos para o fluxo Upload from computer do ChatGPT, mantendo skills/<slug>/ como única fonte de verdade."] },
            { title: "Studio e roteiro", items: ["Promoção das superfícies qualificadas de plugin, catálogo, instaladores e microsite para Stable no roteiro público, mantendo a maturidade individual das skills distinta do estado Stable da release.", "Manutenção da documentação atual de README/catálogo alinhada a 54 skills canônicas e 11 pacotes ativos, com remoção apenas de textos localizados comprovadamente órfãos da Home/Primeiros passos."] },
            { title: "Confiabilidade e manutenção", items: ["Remoção dos helpers de workflow pós-Stable já substituídos, mantendo validate.yml como workflow canônico.", "Reforço do CI no Windows para isolar a integração Next real e tolerar contenção na limpeza do fixture sem elevar timeouts nem serializar toda a suíte.", "Restauração do contraste dos selects e opções nativos do Method Archive com tokens existentes de superfície e texto, preservando semântica nativa e navegação por teclado."] },
          ],
        },
        {
          version: "1.0.0",
          date: "2026-09-02",
          groups: [
            { title: "Release Stable", items: ["Promoção do Agent Skills Studio qualificado por evidências de 1.0.0-rc.2 para Stable 1.0.0, com 54 skills canônicas e 11 pacotes ativos.", "Qualificação de Stable após quatro casos de uso real em três projetos distintos representarem cinco pacotes ativos, incluindo validação completa de uso real do Codebase Intelligence.", "Preservação do comportamento das skills canônicas e da composição dos pacotes: a promoção Stable altera estado de release e metadados sincronizados, não os contratos dos métodos."] },
            { title: "Distribuição e verificação", items: ["Sincronização do plugin, catálogo, instaladores, metadados do pacote do microsite e lockfile web em 1.0.0.", "Preservação de evidências inspecionáveis em distribuição direta de Skill no ChatGPT, descoberta pelo catálogo, instaladores e consumo do microsite.", "Manutenção de testes, validação, typecheck, lint, build de produção e smoke tests de instaladores em Linux e Windows como gate canônico da release Stable."] },
          ],
        },
        {
          version: "1.0.0-rc.2",
          date: "2026-09-02",
          groups: [
            { title: "Codebase Intelligence", items: ["Expansão do catálogo pesquisável para 54 skills canônicas em 11 pacotes ativos com o Codebase Intelligence v1.", "Adição de cinco métodos orientados por evidências para mapear estrutura, rastrear execução, analisar raio de impacto, investigar semanticamente e planejar mudanças com evidências.", "Documentação do CodeGraph como integração opcional oficial, preservando um fallback verificável por inspeção do repositório quando nenhum runtime de inteligência de código estiver disponível.", "Padronização da expansão progressiva de contexto orientada por evidências para evitar leituras amplas e desnecessárias do repositório."] },
            { title: "Prontidão da release", items: ["Promoção das superfícies sincronizadas do Studio e dos metadados do catálogo para 1.0.0-rc.2.", "Manutenção da geração do catálogo, instaladores, validação do plugin e CI Linux/Windows alinhados à coleção de 54 skills / 11 pacotes.", "Reabertura do gate de Stable até que evidências de uso real e CI validem o pacote Codebase Intelligence."] },
          ],
        },
        {
          version: "1.0.0-rc.1",
          date: "Não lançada",
          groups: [
            { title: "Studio público", items: ["Lançamento do microsite bilíngue em Next.js com metadados localizados e orientação de deploy em produção.", "Adição do catálogo com busca para 49 skills, detalhes das skills, dez experiências de pacotes ativos e orientação de instalação.", "Publicação de Primeiros passos, estudos de caso Feito com Skills, roteiro baseado em evidências e páginas institucionais do projeto."] },
            { title: "Catálogo e entrega", items: ["Adição de metadados bilíngues para as 49 skills canônicas e dez pacotes ativos.", "Adição de geração determinística, validação e instalação atômica por pacote para Bash e PowerShell.", "Adição do plugin Agent Skills Studio, manifesto de marketplace local e validação CI em Linux e Windows."] },
          ],
        },
      ],
    },
  },
};

export function getProjectPages(locale: Locale): ProjectPageContent {
  return content[locale];
}

export function createProjectPageMetadata(locale: Locale, section: keyof ProjectPageContent): Metadata {
  const page = content[locale][section];
  return {
    title: page.title,
    description: page.summary,
    alternates: {
      canonical: `/${locale}/${section}`,
      languages: { en: `/en/${section}`, "pt-BR": `/pt-BR/${section}`, "x-default": `/en/${section}` },
    },
  };
}
