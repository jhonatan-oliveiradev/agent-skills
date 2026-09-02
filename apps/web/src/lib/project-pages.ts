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
      summary: "Agent Skills Studio is an open, bilingual collection of focused workflows for agents that need to produce dependable work.",
      purposeLabel: "Why it exists",
      purpose: "Useful agent behavior should be inspectable, installable, and reusable. The studio turns proven working practices into narrow skills, keeps their contracts public, and groups complementary workflows into practical packs.",
      principlesLabel: "Operating principles",
      principles: [
        { title: "Focused by default", summary: "Each skill owns a clear trigger and outcome instead of competing with a broad library of overlapping presets." },
        { title: "Evidence over claims", summary: "Maturity, roadmap status, and case studies reflect verified behavior rather than aspiration." },
        { title: "Context before defaults", summary: "Skills preserve the conventions of the repository they enter before applying personal preferences." },
        { title: "Quality is part of delivery", summary: "Accessibility, performance, privacy, and verification are treated as implementation requirements." },
        { title: "Open and project-agnostic", summary: "Canonical skills remain free of private data, credentials, proprietary copy, and client-specific assumptions." },
      ],
      stewardshipLabel: "Stewardship",
      stewardshipTitle: "Maintained in public by Jhonatan Oliveira.",
      stewardship: "The repository is the source of truth for skills, catalog data, release history, and project decisions. Contributions are reviewed against the same focused contracts and verification gates used to maintain the collection.",
      sourceAction: "Explore the source on GitHub",
    },
    contribute: {
      eyebrow: "Open collaboration",
      title: "Build the collection with us",
      summary: "Bring a real use case, test an existing workflow, or propose a focused improvement. Concrete evidence is the fastest path to a useful contribution.",
      pathsLabel: "Ways to contribute",
      paths: [
        { index: "01", title: "Propose or report", summary: "Open an issue with the outcome you need, the current limitation, and a reproducible example when possible.", action: "Open an issue", href: `${repositoryUrl}/issues/new` },
        { index: "02", title: "Validate a workflow", summary: "Run a skill or pack in a real project and report what was clear, missing, or unexpectedly fragile.", action: "Browse open issues", href: `${repositoryUrl}/issues` },
        { index: "03", title: "Improve the source", summary: "Submit a focused change with bilingual metadata, relevant tests, and no private or project-specific material.", action: "Open a pull request", href: `${repositoryUrl}/compare` },
        { index: "04", title: "Report a security concern", summary: "Use GitHub's private security channel for vulnerabilities; do not disclose sensitive details in a public issue.", action: "Security advisories", href: `${repositoryUrl}/security/advisories/new` },
      ],
      expectationsLabel: "Before you submit",
      expectationsTitle: "Keep the change narrow and verifiable.",
      expectations: ["Explain the user outcome and the concrete scenario.", "Preserve existing project conventions and supported environments.", "Keep English and Brazilian Portuguese content equivalent.", "Add focused tests and run the repository validation gates.", "Remove credentials, private URLs, client data, and proprietary copy."],
    },
    changelog: {
      eyebrow: "Release history",
      title: "Changelog",
      summary: "Readable notes for meaningful additions and changes to the collection, catalog, installers, plugin, and public studio.",
      releasesLabel: "Published and upcoming releases",
      unreleased: "Unreleased",
      sourceAction: "View the source changelog",
      releases: [
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
      summary: "O Agent Skills Studio é uma coleção aberta e bilíngue de fluxos focados para agentes que precisam produzir trabalho confiável.",
      purposeLabel: "Por que existe",
      purpose: "Comportamentos úteis de agentes devem ser inspecionáveis, instaláveis e reutilizáveis. O studio transforma práticas comprovadas em skills estreitas, mantém seus contratos públicos e reúne fluxos complementares em pacotes práticos.",
      principlesLabel: "Princípios de operação",
      principles: [
        { title: "Foco por padrão", summary: "Cada skill possui um gatilho e um resultado claros, sem competir com uma biblioteca ampla de presets sobrepostos." },
        { title: "Evidência acima de afirmações", summary: "Maturidade, estágio no roteiro e estudos de caso refletem comportamento verificado, não intenção." },
        { title: "Contexto antes de padrões", summary: "As skills preservam as convenções do repositório antes de aplicar preferências pessoais." },
        { title: "Qualidade faz parte da entrega", summary: "Acessibilidade, performance, privacidade e verificação são requisitos de implementação." },
        { title: "Aberto e independente de projeto", summary: "As skills canônicas permanecem livres de dados privados, credenciais, textos proprietários e premissas específicas de clientes." },
      ],
      stewardshipLabel: "Manutenção",
      stewardshipTitle: "Mantido publicamente por Jhonatan Oliveira.",
      stewardship: "O repositório é a fonte de verdade para skills, catálogo, histórico de versões e decisões do projeto. Contribuições são revisadas com os mesmos contratos focados e gates de verificação usados na manutenção da coleção.",
      sourceAction: "Explorar o código no GitHub",
    },
    contribute: {
      eyebrow: "Colaboração aberta",
      title: "Construa a coleção com a gente",
      summary: "Traga um caso real, teste um fluxo existente ou proponha uma melhoria focada. Evidência concreta é o caminho mais rápido para uma contribuição útil.",
      pathsLabel: "Formas de contribuir",
      paths: [
        { index: "01", title: "Proponha ou relate", summary: "Abra uma issue com o resultado necessário, a limitação atual e, quando possível, um exemplo reproduzível.", action: "Abrir uma issue", href: `${repositoryUrl}/issues/new` },
        { index: "02", title: "Valide um fluxo", summary: "Execute uma skill ou pacote em um projeto real e relate o que foi claro, ausente ou inesperadamente frágil.", action: "Ver issues abertas", href: `${repositoryUrl}/issues` },
        { index: "03", title: "Melhore a fonte", summary: "Envie uma mudança focada com metadados bilíngues, testes relevantes e nenhum material privado ou específico de projeto.", action: "Abrir um pull request", href: `${repositoryUrl}/compare` },
        { index: "04", title: "Reporte uma questão de segurança", summary: "Use o canal privado do GitHub para vulnerabilidades; não publique detalhes sensíveis em uma issue pública.", action: "Avisos de segurança", href: `${repositoryUrl}/security/advisories/new` },
      ],
      expectationsLabel: "Antes de enviar",
      expectationsTitle: "Mantenha a mudança focada e verificável.",
      expectations: ["Explique o resultado para a pessoa usuária e o cenário concreto.", "Preserve as convenções existentes e os ambientes suportados.", "Mantenha equivalentes os conteúdos em inglês e português brasileiro.", "Adicione testes focados e execute os gates de validação.", "Remova credenciais, URLs privadas, dados de clientes e textos proprietários."],
    },
    changelog: {
      eyebrow: "Histórico de versões",
      title: "Histórico de mudanças",
      summary: "Notas legíveis das adições e mudanças relevantes na coleção, catálogo, instaladores, plugin e studio público.",
      releasesLabel: "Versões publicadas e futuras",
      unreleased: "Não lançada",
      sourceAction: "Ver changelog na fonte",
      releases: [
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