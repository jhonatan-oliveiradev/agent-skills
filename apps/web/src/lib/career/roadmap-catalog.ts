import type { CompetencyId } from "./competencies";
import type {
  EvidenceClass,
  ProficiencyLevel,
  TargetRoleId,
} from "./types";

export interface RoadmapMilestoneRequirement {
  readonly competencyId: CompetencyId;
  readonly targetLevel: ProficiencyLevel;
}

export interface RoadmapEvidenceRequirement {
  readonly competencyId: CompetencyId;
  readonly minimumClass: EvidenceClass;
}

export interface RoadmapMilestoneDefinition {
  readonly id: string;
  readonly title: Readonly<Record<"en" | "pt-BR", string>>;
  readonly summary: Readonly<Record<"en" | "pt-BR", string>>;
  readonly prerequisites: readonly string[];
  readonly requirements: readonly RoadmapMilestoneRequirement[];
  readonly evidenceRequirements: readonly RoadmapEvidenceRequirement[];
  readonly estimatedEffortHours: Readonly<{ min: number; max: number }>;
  readonly applicableRoles: readonly TargetRoleId[];
}

const allRoles = [
  "frontend-developer",
  "backend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];
const frontendRoles = [
  "frontend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];
const backendRoles = [
  "backend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];

export const roadmapMilestoneCatalog: readonly RoadmapMilestoneDefinition[] = [
  {
    id: "programming-foundations",
    title: { en: "Programming foundations", "pt-BR": "Fundamentos de programação" },
    summary: {
      en: "Establish a verified JavaScript foundation before higher-order application work.",
      "pt-BR": "Estabeleça uma base verificada de JavaScript antes do trabalho de aplicação mais avançado.",
    },
    prerequisites: [],
    requirements: [
      { competencyId: "programming-javascript", targetLevel: "foundation" },
    ],
    evidenceRequirements: [
      { competencyId: "programming-javascript", minimumClass: "E1" },
    ],
    estimatedEffortHours: { min: 4, max: 8 },
    applicableRoles: allRoles,
  },
  {
    id: "async-application-control-flow",
    title: { en: "Async application control flow", "pt-BR": "Fluxo de controle assíncrono" },
    summary: {
      en: "Move from language basics to production-grade asynchronous reasoning and failure handling.",
      "pt-BR": "Avance dos fundamentos para raciocínio assíncrono e tratamento de falhas em nível de produção.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      { competencyId: "programming-javascript", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "programming-javascript", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 8, max: 16 },
    applicableRoles: allRoles,
  },
  {
    id: "typed-application-modeling",
    title: { en: "Typed application modeling", "pt-BR": "Modelagem tipada de aplicações" },
    summary: {
      en: "Model application states and module boundaries with explicit TypeScript contracts.",
      "pt-BR": "Modele estados e limites de módulos com contratos explícitos em TypeScript.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      { competencyId: "programming-typescript", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "programming-typescript", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 8, max: 16 },
    applicableRoles: allRoles,
  },
  {
    id: "web-interface-foundations",
    title: { en: "Web interface foundations", "pt-BR": "Fundamentos de interfaces web" },
    summary: {
      en: "Build on browser and web-platform primitives before framework-specific abstractions.",
      "pt-BR": "Construa sobre primitivas do navegador e da plataforma web antes de abstrações de framework.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      { competencyId: "web-platform-foundations", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "web-platform-foundations", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 8, max: 16 },
    applicableRoles: frontendRoles,
  },
  {
    id: "ui-state-and-data-flow",
    title: { en: "UI state and data flow", "pt-BR": "Estado e fluxo de dados na UI" },
    summary: {
      en: "Demonstrate maintainable component boundaries, state ownership and asynchronous data flow.",
      "pt-BR": "Demonstre limites de componentes, ownership de estado e fluxo assíncrono de dados de forma sustentável.",
    },
    prerequisites: [
      "async-application-control-flow",
      "web-interface-foundations",
    ],
    requirements: [
      { competencyId: "ui-component-modeling", targetLevel: "proficient" },
      { competencyId: "state-data-flow", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "ui-component-modeling", minimumClass: "E3" },
      { competencyId: "state-data-flow", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 12, max: 20 },
    applicableRoles: frontendRoles,
  },
  {
    id: "testing-real-behavior",
    title: { en: "Testing real behavior", "pt-BR": "Testes de comportamento real" },
    summary: {
      en: "Verify observable behavior and failure boundaries without coupling tests to implementation detail.",
      "pt-BR": "Verifique comportamento observável e limites de falha sem acoplar testes a detalhes de implementação.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      { competencyId: "testing-behavior", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "testing-behavior", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 8, max: 14 },
    applicableRoles: allRoles,
  },
  {
    id: "accessible-web-interfaces",
    title: { en: "Accessible web interfaces", "pt-BR": "Interfaces web acessíveis" },
    summary: {
      en: "Make semantics, keyboard interaction and focus behavior part of interface correctness.",
      "pt-BR": "Torne semântica, interação por teclado e foco parte da correção da interface.",
    },
    prerequisites: ["ui-state-and-data-flow"],
    requirements: [
      { competencyId: "web-accessibility", targetLevel: "developing" },
    ],
    evidenceRequirements: [
      { competencyId: "web-accessibility", minimumClass: "E2" },
    ],
    estimatedEffortHours: { min: 6, max: 12 },
    applicableRoles: frontendRoles,
  },
  {
    id: "http-api-boundaries",
    title: { en: "HTTP and API boundaries", "pt-BR": "Limites HTTP e API" },
    summary: {
      en: "Turn web-protocol knowledge into explicit, robust service contracts and failure semantics.",
      "pt-BR": "Transforme conhecimento de protocolos web em contratos de serviço e semântica de falhas explícitos e robustos.",
    },
    prerequisites: [
      "programming-foundations",
      "async-application-control-flow",
    ],
    requirements: [
      { competencyId: "web-platform-foundations", targetLevel: "foundation" },
      { competencyId: "http-api-engineering", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "web-platform-foundations", minimumClass: "E1" },
      { competencyId: "http-api-engineering", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 10, max: 18 },
    applicableRoles: backendRoles,
  },
  {
    id: "node-runtime-services",
    title: { en: "Runtime service engineering", "pt-BR": "Engenharia de serviços em runtime" },
    summary: {
      en: "Operate service lifecycle, asynchronous I/O and runtime failure as explicit engineering concerns.",
      "pt-BR": "Trate ciclo de vida de serviços, I/O assíncrono e falhas de runtime como preocupações explícitas de engenharia.",
    },
    prerequisites: ["http-api-boundaries"],
    requirements: [
      { competencyId: "node-runtime-foundations", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "node-runtime-foundations", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 10, max: 18 },
    applicableRoles: backendRoles,
  },
  {
    id: "relational-data-foundations",
    title: { en: "Relational data foundations", "pt-BR": "Fundamentos de dados relacionais" },
    summary: {
      en: "Demonstrate durable data modeling, integrity and query reasoning under realistic constraints.",
      "pt-BR": "Demonstre modelagem de dados durável, integridade e raciocínio de consultas sob restrições realistas.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      { competencyId: "relational-data-modeling", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "relational-data-modeling", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 10, max: 18 },
    applicableRoles: backendRoles,
  },
  {
    id: "application-security-basics",
    title: { en: "Application security basics", "pt-BR": "Fundamentos de segurança de aplicações" },
    summary: {
      en: "Apply trust boundaries, validation and authorization thinking to everyday application work.",
      "pt-BR": "Aplique limites de confiança, validação e autorização ao trabalho cotidiano de aplicações.",
    },
    prerequisites: ["programming-foundations"],
    requirements: [
      {
        competencyId: "application-security-foundations",
        targetLevel: "developing",
      },
    ],
    evidenceRequirements: [
      { competencyId: "application-security-foundations", minimumClass: "E2" },
    ],
    estimatedEffortHours: { min: 6, max: 12 },
    applicableRoles: allRoles,
  },
  {
    id: "architecture-boundaries",
    title: { en: "Architecture boundaries", "pt-BR": "Limites de arquitetura" },
    summary: {
      en: "Evolve module boundaries using dependency direction, failure isolation and testability as constraints.",
      "pt-BR": "Evolua limites de módulos usando direção de dependências, isolamento de falhas e testabilidade como restrições.",
    },
    prerequisites: ["testing-real-behavior"],
    requirements: [
      { competencyId: "architecture-boundaries", targetLevel: "proficient" },
    ],
    evidenceRequirements: [
      { competencyId: "architecture-boundaries", minimumClass: "E3" },
    ],
    estimatedEffortHours: { min: 10, max: 18 },
    applicableRoles: allRoles,
  },
  {
    id: "portfolio-proof",
    title: { en: "Portfolio proof", "pt-BR": "Prova de portfólio" },
    summary: {
      en: "Convert demonstrated capability into credible, traceable professional evidence.",
      "pt-BR": "Converta capacidade demonstrada em evidência profissional crível e rastreável.",
    },
    prerequisites: ["architecture-boundaries"],
    requirements: [
      { competencyId: "professional-evidence", targetLevel: "developing" },
    ],
    evidenceRequirements: [
      { competencyId: "professional-evidence", minimumClass: "E4" },
    ],
    estimatedEffortHours: { min: 8, max: 16 },
    applicableRoles: allRoles,
  },
];

const milestoneById = new Map(
  roadmapMilestoneCatalog.map((milestone) => [milestone.id, milestone] as const),
);

export function getRoadmapMilestone(id: string): RoadmapMilestoneDefinition {
  const milestone = milestoneById.get(id);
  if (!milestone) {
    throw new Error(`Unknown roadmap milestone: ${id}`);
  }
  return milestone;
}
