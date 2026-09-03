import { readFile, writeFile } from "node:fs/promises";

const path = "apps/web/src/lib/built-with-skills.ts";
let source = await readFile(path, "utf8");

const pathAnchor = `const portfolioEngineeringWorkflowCaseSourcePath =\n  "docs/built-with-skills/2026-09-03-portfolio-project-isr-engineering-workflow.md";`;
const pathInsert = `${pathAnchor}\nconst strataArchitectureCaseSourcePath =\n  "docs/built-with-skills/2026-09-03-strata-contracts-architecture-boundaries.md";`;

const projectAnchor = `const portfolio2025Project = {\n  id: "portfolio-2025",\n  name: "Portfolio 2025",\n} as const satisfies CaseProject;`;
const projectInsert = `${projectAnchor}\n\nconst strataProject = {\n  id: "strata",\n  name: "STRATA",\n} as const satisfies CaseProject;`;

const strataCase = {
  slug: "strata-contracts-architecture-boundaries",
  date: "2026-09-03",
  sourcePath: "__STRATA_SOURCE_PATH__",
  evidenceClass: "real-use",
  project: "__STRATA_PROJECT__",
  skills: [
    "choosing-application-architecture",
    "designing-software-boundaries",
    "documenting-architecture-decisions",
    "planning-safe-refactors",
  ],
  evidence: [
    {
      type: "source",
      href: "https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/docs/built-with-skills/2026-09-03-strata-contracts-architecture-boundaries.md",
      labels: { en: "Public case record", "pt-BR": "Registro público do case" },
    },
    {
      type: "qa",
      href: "https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/docs/built-with-skills/2026-09-03-strata-contracts-architecture-boundaries.md#verification-record",
      labels: { en: "Verification record", "pt-BR": "Registro de verificação" },
    },
  ],
  locales: {
    en: {
      title: "Tightening Contracts boundaries without distributing the architecture",
      summary: "A real STRATA Contracts review used the complete Architecture & Engineering pack to preserve a justified modular monolith, reverse a persistence dependency, centralize lifecycle legality, document the decision, and land the correction as a bounded verified refactor.",
      challenge: "Correct ownership and lifecycle-rule drift in an active Contracts slice without adding a network service, migration, UI feature, replacement service, or speculative transaction framework.",
      decisions: [
        { title: "Keep the least-distributed architecture that satisfies the forces", summary: "Retain the existing modular Next.js + Prisma monolith because tenant isolation, lifecycle consistency, and transactional invariants did not require an independently deployed service." },
        { title: "Make the feature own its read contract", summary: "Move the narrow read source types into the Contracts feature so the Prisma repository satisfies that contract instead of exporting persistence-owned payload types upward." },
        { title: "Put replacement legality in the domain", summary: "Define replacement eligibility once in the canonical status policy and let presentation delegate to it instead of duplicating FINALIZED/SENT lifecycle semantics." },
        { title: "Refactor only the proven seam", summary: "Use two RED architecture contracts and a six-file follow-up, while explicitly deferring a generic retry abstraction until a second real operation needs the same semantics." },
      ],
      results: [
        "The Contracts read model no longer imports server repository implementation types.",
        "The repository keeps Prisma selects private while satisfying feature-owned source contracts.",
        "Replacement eligibility is now owned by the canonical Contracts domain policy.",
        "The bounded follow-up passed 376/376 tests plus typecheck, lint, formatting, dependency audit, and post-merge main CI.",
        "All four Architecture & Engineering methods materially shaped the reviewed and merged external change.",
      ],
    },
    "pt-BR": {
      title: "Ajuste das fronteiras de Contracts sem distribuir a arquitetura",
      summary: "Uma revisão real de Contracts no STRATA usou o pack completo de Architecture & Engineering para preservar um monólito modular justificado, inverter uma dependência de persistência, centralizar a legalidade do lifecycle, documentar a decisão e integrar a correção como um refactor delimitado e verificado.",
      challenge: "Corrigir ownership e drift de regra de lifecycle em uma slice ativa de Contracts sem adicionar serviço de rede, migration, nova UI, serviço de replacement ou framework transacional especulativo.",
      decisions: [
        { title: "Manter a arquitetura menos distribuída que atende às forças reais", summary: "Preservar o monólito modular existente em Next.js + Prisma porque isolamento por tenant, consistência de lifecycle e invariantes transacionais não exigiam um serviço com deploy independente." },
        { title: "Fazer a feature ser dona do contrato de leitura", summary: "Mover os tipos estreitos de source do read model para Contracts para que o repository Prisma satisfaça esse contrato, em vez de exportar payloads de persistência para cima." },
        { title: "Colocar a legalidade de replacement no domínio", summary: "Definir a elegibilidade de replacement uma única vez na status policy canônica e fazer presentation delegar a ela, sem duplicar a semântica FINALIZED/SENT." },
        { title: "Refatorar apenas a seam comprovada", summary: "Usar dois contratos RED de arquitetura e uma follow-up de seis arquivos, adiando explicitamente uma abstração genérica de retry até existir uma segunda operação real com a mesma semântica." },
      ],
      results: [
        "O read model de Contracts deixou de importar tipos de implementação do server repository.",
        "O repository mantém os selects Prisma privados enquanto satisfaz contratos de source pertencentes à feature.",
        "A elegibilidade de replacement passou a pertencer à policy canônica do domínio de Contracts.",
        "A follow-up delimitada passou 376/376 testes, typecheck, lint, formatação, dependency audit e CI pós-merge na main.",
        "Os quatro métodos de Architecture & Engineering influenciaram materialmente a mudança externa revisada e mergeada.",
      ],
    },
  },
};

let caseText = JSON.stringify(strataCase, null, 2)
  .replace('"__STRATA_SOURCE_PATH__"', "strataArchitectureCaseSourcePath")
  .replace('"__STRATA_PROJECT__"', "strataProject")
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n") + ",\n";

for (const [anchor, replacement] of [[pathAnchor, pathInsert], [projectAnchor, projectInsert]]) {
  if (!source.includes(anchor)) throw new Error(`Missing anchor: ${anchor}`);
  source = source.replace(anchor, replacement);
}

const caseAnchor = `  {\n    slug: "catalog-experience",`;
if (!source.includes(caseAnchor)) throw new Error("Missing catalog case anchor");
source = source.replace(caseAnchor, `${caseText}${caseAnchor}`);

await writeFile(path, source);
