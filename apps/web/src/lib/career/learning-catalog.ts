import type { LearningUnit } from "./learning";
import type { LearningModule, LearningNote } from "./learning-types";

export const learningUnitCatalog = [
  {
    id: "async-js-control-flow",
    competencyId: "programming-javascript",
    title: {
      en: "Async JavaScript and control flow",
      "pt-BR": "JavaScript assíncrono e fluxo de controle",
    },
    objective: {
      en: "Reason about sequencing, promises, async/await, failure paths, and state changes without hiding control flow.",
      "pt-BR": "Raciocine sobre sequência, promises, async/await, caminhos de falha e mudanças de estado sem ocultar o fluxo de controle.",
    },
    explanation: {
      en: "Asynchronous code is still control flow. Make the pending operation, success path, failure path, and cleanup path explicit before optimizing syntax.",
      "pt-BR": "Código assíncrono continua sendo fluxo de controle. Torne explícitos a operação pendente, o caminho de sucesso, o caminho de falha e a limpeza antes de otimizar a sintaxe.",
    },
    practice: [
      { id: "async-example", kind: "example", prompt: { en: "Trace a promise chain and write the order in which each callback runs.", "pt-BR": "Rastreie uma cadeia de promises e escreva a ordem em que cada callback executa." } },
      { id: "async-problem", kind: "problem", prompt: { en: "Find the missing error or cleanup path in an async request flow.", "pt-BR": "Encontre o caminho de erro ou limpeza ausente em um fluxo de requisição assíncrona." } },
      { id: "async-practice", kind: "practice", prompt: { en: "Refactor a loading/success/error interaction so every state transition is explicit.", "pt-BR": "Refatore uma interação de loading/sucesso/erro para que cada transição de estado fique explícita." } },
      { id: "async-checkpoint", kind: "checkpoint", prompt: { en: "Explain when sequential await is required and when independent operations can run together.", "pt-BR": "Explique quando await sequencial é necessário e quando operações independentes podem rodar juntas." } },
      { id: "async-handoff", kind: "handoff", prompt: { en: "Apply the model to the current roadmap project, then collect performance evidence or reassess.", "pt-BR": "Aplique o modelo ao projeto atual do roadmap e depois colete evidência de performance ou faça uma nova avaliação." } },
    ],
    estimatedMinutes: 20,
  },
  {
    id: "typescript-application-modeling",
    competencyId: "programming-typescript",
    title: { en: "TypeScript application modeling", "pt-BR": "Modelagem de aplicações com TypeScript" },
    objective: { en: "Model states and boundaries so invalid combinations are difficult to represent.", "pt-BR": "Modele estados e limites para que combinações inválidas sejam difíceis de representar." },
    explanation: { en: "Useful types describe domain states and boundary contracts, not just the shape of variables already present in JavaScript.", "pt-BR": "Tipos úteis descrevem estados do domínio e contratos de fronteira, não apenas o formato de variáveis que já existem em JavaScript." },
    practice: [
      { id: "ts-example", kind: "example", prompt: { en: "Compare a boolean-heavy state object with a discriminated union.", "pt-BR": "Compare um objeto de estado cheio de booleanos com uma união discriminada." } },
      { id: "ts-problem", kind: "problem", prompt: { en: "Identify an impossible state currently allowed by a loose interface.", "pt-BR": "Identifique um estado impossível atualmente permitido por uma interface frouxa." } },
      { id: "ts-practice", kind: "practice", prompt: { en: "Model loading, success, empty, and error states as an explicit union.", "pt-BR": "Modele loading, sucesso, vazio e erro como uma união explícita." } },
      { id: "ts-checkpoint", kind: "checkpoint", prompt: { en: "Explain which invariants belong in types and which still require runtime validation.", "pt-BR": "Explique quais invariantes pertencem aos tipos e quais ainda exigem validação em runtime." } },
      { id: "ts-handoff", kind: "handoff", prompt: { en: "Use the model at a real module or API boundary and capture the resulting artifact.", "pt-BR": "Use o modelo em um limite real de módulo ou API e capture o artefato resultante." } },
    ],
    estimatedMinutes: 20,
  },
  {
    id: "testing-observable-behavior",
    competencyId: "testing-behavior",
    title: { en: "Testing observable behavior", "pt-BR": "Testando comportamento observável" },
    objective: { en: "Write tests around user-visible or contract-visible outcomes instead of private implementation detail.", "pt-BR": "Escreva testes em torno de resultados visíveis ao usuário ou ao contrato, em vez de detalhes privados de implementação." },
    explanation: { en: "A resilient test protects a behavioral contract. Refactors should be free to change internal structure when the contract remains true.", "pt-BR": "Um teste resiliente protege um contrato de comportamento. Refactors devem poder mudar a estrutura interna quando o contrato continua verdadeiro." },
    practice: [
      { id: "test-example", kind: "example", prompt: { en: "Rewrite an assertion on internal state as an assertion on an observable result.", "pt-BR": "Reescreva uma asserção sobre estado interno como uma asserção sobre um resultado observável." } },
      { id: "test-problem", kind: "problem", prompt: { en: "Spot a test that would fail after a harmless refactor.", "pt-BR": "Identifique um teste que falharia após um refactor inofensivo." } },
      { id: "test-practice", kind: "practice", prompt: { en: "Add a success, failure, and boundary case around one real behavior.", "pt-BR": "Adicione um caso de sucesso, falha e limite em torno de um comportamento real." } },
      { id: "test-checkpoint", kind: "checkpoint", prompt: { en: "State the contract each test protects in one sentence.", "pt-BR": "Declare em uma frase o contrato que cada teste protege." } },
      { id: "test-handoff", kind: "handoff", prompt: { en: "Run the tests against a deliberate regression and preserve the failing/passing evidence.", "pt-BR": "Execute os testes contra uma regressão deliberada e preserve a evidência de falha/sucesso." } },
    ],
    estimatedMinutes: 20,
  },
  {
    id: "http-api-boundaries",
    competencyId: "http-api-engineering",
    title: { en: "HTTP and API boundaries", "pt-BR": "Limites HTTP e API" },
    objective: { en: "Turn transport details into explicit request, response, validation, and failure contracts.", "pt-BR": "Transforme detalhes de transporte em contratos explícitos de requisição, resposta, validação e falha." },
    explanation: { en: "An API boundary owns what enters, what leaves, and how failure is represented. Status codes and payload validation are part of the contract.", "pt-BR": "Um limite de API é responsável pelo que entra, pelo que sai e por como a falha é representada. Status codes e validação de payload fazem parte do contrato." },
    practice: [
      { id: "http-example", kind: "example", prompt: { en: "Classify a request as validation, authorization, domain, or transport failure.", "pt-BR": "Classifique uma requisição como falha de validação, autorização, domínio ou transporte." } },
      { id: "http-problem", kind: "problem", prompt: { en: "Find an endpoint whose failure contract is ambiguous.", "pt-BR": "Encontre um endpoint cujo contrato de falha seja ambíguo." } },
      { id: "http-practice", kind: "practice", prompt: { en: "Define one endpoint with explicit input validation and stable error responses.", "pt-BR": "Defina um endpoint com validação explícita de entrada e respostas de erro estáveis." } },
      { id: "http-checkpoint", kind: "checkpoint", prompt: { en: "Explain which errors belong to the client contract and which should stay internal.", "pt-BR": "Explique quais erros pertencem ao contrato do cliente e quais devem permanecer internos." } },
      { id: "http-handoff", kind: "handoff", prompt: { en: "Exercise the endpoint through integration tests and collect the artifact as evidence.", "pt-BR": "Exercite o endpoint com testes de integração e colete o artefato como evidência." } },
    ],
    estimatedMinutes: 20,
  },
  {
    id: "git-collaboration-workflow",
    competencyId: "git-collaboration",
    title: { en: "Reviewable Git collaboration", "pt-BR": "Colaboração revisável com Git" },
    objective: { en: "Shape changes into traceable commits and reviewable integration units.", "pt-BR": "Estruture mudanças em commits rastreáveis e unidades de integração revisáveis." },
    explanation: { en: "Version-control evidence is stronger when a reviewer can reconstruct intent, verification, and integration risk from the history.", "pt-BR": "A evidência de controle de versão é mais forte quando um revisor consegue reconstruir intenção, verificação e risco de integração pelo histórico." },
    practice: [
      { id: "git-example", kind: "example", prompt: { en: "Compare a mixed commit with a focused semantic commit.", "pt-BR": "Compare um commit misturado com um commit semântico focado." } },
      { id: "git-problem", kind: "problem", prompt: { en: "Identify where a change set hides unrelated work or weak verification history.", "pt-BR": "Identifique onde um conjunto de mudanças esconde trabalho não relacionado ou um histórico fraco de verificação." } },
      { id: "git-practice", kind: "practice", prompt: { en: "Prepare a small branch with RED, fix, GREEN, and reviewable commit boundaries.", "pt-BR": "Prepare uma branch pequena com RED, correção, GREEN e limites de commit revisáveis." } },
      { id: "git-checkpoint", kind: "checkpoint", prompt: { en: "Explain how you would revert or isolate the change if integration fails.", "pt-BR": "Explique como você reverteria ou isolaria a mudança se a integração falhar." } },
      { id: "git-handoff", kind: "handoff", prompt: { en: "Use the branch/PR history as part of your portfolio evidence contract.", "pt-BR": "Use o histórico da branch/PR como parte do seu contrato de evidência de portfólio." } },
    ],
    estimatedMinutes: 15,
  },
  {
    id: "accessible-interface-fundamentals",
    competencyId: "web-accessibility",
    title: { en: "Accessible interface fundamentals", "pt-BR": "Fundamentos de interfaces acessíveis" },
    objective: { en: "Treat semantics, keyboard operation, focus, and status communication as correctness requirements.", "pt-BR": "Trate semântica, operação por teclado, foco e comunicação de status como requisitos de correção." },
    explanation: { en: "Accessibility starts with correct structure and interaction semantics. Visual polish cannot compensate for missing names, focus order, or keyboard operation.", "pt-BR": "Acessibilidade começa com estrutura e semântica de interação corretas. Polimento visual não compensa nomes ausentes, ordem de foco ou operação por teclado." },
    practice: [
      { id: "a11y-example", kind: "example", prompt: { en: "Compare a clickable div with the native control that expresses the same intent.", "pt-BR": "Compare uma div clicável com o controle nativo que expressa a mesma intenção." } },
      { id: "a11y-problem", kind: "problem", prompt: { en: "Navigate an interface using only the keyboard and list every blocked interaction.", "pt-BR": "Navegue por uma interface usando apenas o teclado e liste toda interação bloqueada." } },
      { id: "a11y-practice", kind: "practice", prompt: { en: "Fix labels, heading order, focus visibility, and one dynamic status announcement.", "pt-BR": "Corrija rótulos, ordem de headings, visibilidade de foco e um anúncio de status dinâmico." } },
      { id: "a11y-checkpoint", kind: "checkpoint", prompt: { en: "Explain why color alone cannot communicate state.", "pt-BR": "Explique por que cor sozinha não pode comunicar estado." } },
      { id: "a11y-handoff", kind: "handoff", prompt: { en: "Record the before/after behavior and verification output as portfolio evidence.", "pt-BR": "Registre o comportamento antes/depois e a saída de verificação como evidência de portfólio." } },
    ],
    estimatedMinutes: 20,
  },
] as const satisfies readonly LearningUnit[];

// New Career Learning notes are introduced incrementally. The legacy unit catalog
// remains the Roadmap compatibility surface until the migration slice removes it.
export const learningNoteCatalog: readonly LearningNote[] = [];

export function getLearningNote(noteId: string): LearningNote | undefined {
  return learningNoteCatalog.find((note) => note.id === noteId);
}

export function getLearningNoteByCompetency(
  competencyId: LearningNote["competencyId"],
): LearningNote | undefined {
  return learningNoteCatalog.find((note) => note.competencyId === competencyId);
}

export function getReviewedLearningModules(note: LearningNote): readonly LearningModule[] {
  return note.modules.filter((module) => module.reviewStatus === "reviewed");
}

export function getLearningModuleByCriterion(
  criterionId: string,
): LearningModule | undefined {
  return learningNoteCatalog
    .flatMap((note) => note.modules)
    .find((module) => module.criterionId === criterionId);
}
