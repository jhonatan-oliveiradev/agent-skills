import type { Locale } from "@/lib/locales";
import {
  toPublicAssessmentBlueprint,
  type AssessmentBlueprint,
  type AssessmentChallengeKind,
  type PublicAssessmentBlueprint,
} from "./assessment";
export { validateAssessmentBlueprint } from "./assessment";

type LocalizedText = Readonly<{ en: string; "pt-BR": string }>;

type LocalizedOption = Readonly<{
  id: string;
  label: LocalizedText;
}>;

type BaselineChallengeDefinition = Readonly<{
  suffix: string;
  kind: AssessmentChallengeKind;
  prompt: LocalizedText;
  options: readonly LocalizedOption[];
  correctOptionIds: readonly string[];
  evidenceClass: "E1" | "E2";
  demonstratedLevel: "foundation" | "developing";
}>;

type BaselineDefinition = Readonly<{
  id: string;
  competencyId: AssessmentBlueprint["competencyId"];
  title: LocalizedText;
  dimensionLabel: LocalizedText;
  challenges: readonly BaselineChallengeDefinition[];
}>;

const dimensionLabel = {
  en: "Baseline reasoning",
  "pt-BR": "Raciocínio de baseline",
} as const;

const baselineDefinitions = [
  {
    id: "baseline-javascript",
    competencyId: "programming-javascript",
    title: { en: "JavaScript", "pt-BR": "JavaScript" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "Which boundary keeps interaction state local?",
          "pt-BR": "Qual limite mantém o estado da interação local?",
        },
        options: [
          { id: "sound", label: { en: "The component that owns the interaction", "pt-BR": "O componente que controla a interação" } },
          { id: "unsound", label: { en: "A global mutable variable", "pt-BR": "Uma variável global mutável" } },
          { id: "module-singleton", label: { en: "A shared module singleton for every screen", "pt-BR": "Um singleton de módulo compartilhado por todas as telas" } },
          { id: "dom-attribute", label: { en: "A DOM attribute used as application state", "pt-BR": "Um atributo do DOM usado como estado da aplicação" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "An older async request finishes after a newer one and overwrites the current result. Which fix addresses the race at its boundary?",
          "pt-BR": "Uma requisição assíncrona antiga termina depois de uma mais nova e sobrescreve o resultado atual. Qual correção trata a corrida no limite certo?",
        },
        options: [
          { id: "guard-current", label: { en: "Commit the result only when that request is still the current request", "pt-BR": "Aplicar o resultado somente se aquela requisição ainda for a requisição atual" } },
          { id: "longer-timeout", label: { en: "Add a longer timeout to the newer request", "pt-BR": "Adicionar um timeout maior à requisição mais nova" } },
          { id: "global-result", label: { en: "Write every result to one global variable immediately", "pt-BR": "Gravar todo resultado imediatamente em uma única variável global" } },
          { id: "ignore-order", label: { en: "Ignore completion order because promises are deterministic", "pt-BR": "Ignorar a ordem de conclusão porque promises são determinísticas" } },
        ],
        correctOptionIds: ["guard-current"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two practices make asynchronous application state easier to reason about?",
          "pt-BR": "Quais duas práticas tornam o estado assíncrono da aplicação mais previsível?",
        },
        options: [
          { id: "explicit-states", label: { en: "Represent pending, success, and failure explicitly", "pt-BR": "Representar explicitamente os estados pendente, sucesso e falha" } },
          { id: "handle-rejection", label: { en: "Handle rejection at an intentional boundary", "pt-BR": "Tratar rejeições em um limite intencional" } },
          { id: "duplicate-state", label: { en: "Duplicate the same mutable state in several owners", "pt-BR": "Duplicar o mesmo estado mutável em vários responsáveis" } },
          { id: "discard-errors", label: { en: "Discard rejected promises to keep the happy path short", "pt-BR": "Descartar promises rejeitadas para manter o caminho feliz curto" } },
        ],
        correctOptionIds: ["explicit-states", "handle-rejection"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order the steps for a race-safe async interaction.",
          "pt-BR": "Ordene as etapas de uma interação assíncrona segura contra corrida.",
        },
        options: [
          { id: "capture", label: { en: "Capture a request/version identifier", "pt-BR": "Registrar um identificador de requisição/versão" } },
          { id: "start", label: { en: "Start the asynchronous operation", "pt-BR": "Iniciar a operação assíncrona" } },
          { id: "verify-current", label: { en: "Verify the identifier is still current after completion", "pt-BR": "Verificar após a conclusão se o identificador ainda é o atual" } },
          { id: "commit", label: { en: "Commit the result or the handled failure", "pt-BR": "Aplicar o resultado ou a falha tratada" } },
        ],
        correctOptionIds: ["capture", "start", "verify-current", "commit"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
  {
    id: "baseline-typescript",
    competencyId: "programming-typescript",
    title: { en: "TypeScript", "pt-BR": "TypeScript" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "Which construct makes impossible state combinations explicit?",
          "pt-BR": "Qual construção torna explícitas as combinações de estado impossíveis?",
        },
        options: [
          { id: "sound", label: { en: "A discriminated union", "pt-BR": "Uma união discriminada" } },
          { id: "unsound", label: { en: "A non-null assertion", "pt-BR": "Uma asserção non-null" } },
          { id: "any-state", label: { en: "An object whose fields are all any", "pt-BR": "Um objeto com todos os campos tipados como any" } },
          { id: "optional-everything", label: { en: "One interface where every state field is optional", "pt-BR": "Uma única interface em que todo campo de estado é opcional" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "An API payload enters the app as unknown. What should happen before reading nested fields?",
          "pt-BR": "Um payload de API entra na aplicação como unknown. O que deve acontecer antes de ler campos internos?",
        },
        options: [
          { id: "narrow", label: { en: "Validate or narrow the value at the boundary", "pt-BR": "Validar ou estreitar o valor no limite de entrada" } },
          { id: "cast", label: { en: "Cast it directly to the desired interface", "pt-BR": "Fazer cast direto para a interface desejada" } },
          { id: "ignore", label: { en: "Disable strict checks for that module", "pt-BR": "Desativar verificações strict para aquele módulo" } },
          { id: "nonnull", label: { en: "Add non-null assertions to every access", "pt-BR": "Adicionar asserções non-null em todo acesso" } },
        ],
        correctOptionIds: ["narrow"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two choices strengthen a typed external-data boundary?",
          "pt-BR": "Quais duas escolhas fortalecem um limite tipado para dados externos?",
        },
        options: [
          { id: "unknown-first", label: { en: "Treat untrusted input as unknown before validation", "pt-BR": "Tratar entrada não confiável como unknown antes da validação" } },
          { id: "exhaustive", label: { en: "Use exhaustive handling for known discriminated variants", "pt-BR": "Usar tratamento exaustivo para variantes discriminadas conhecidas" } },
          { id: "any-boundary", label: { en: "Use any so downstream code never needs narrowing", "pt-BR": "Usar any para que o restante do código nunca precise estreitar tipos" } },
          { id: "assertion-boundary", label: { en: "Use a type assertion as the validation step", "pt-BR": "Usar uma asserção de tipo como etapa de validação" } },
        ],
        correctOptionIds: ["unknown-first", "exhaustive"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order the steps for consuming an untrusted JSON payload safely.",
          "pt-BR": "Ordene as etapas para consumir com segurança um payload JSON não confiável.",
        },
        options: [
          { id: "receive", label: { en: "Receive the value as unknown", "pt-BR": "Receber o valor como unknown" } },
          { id: "validate", label: { en: "Validate the required shape", "pt-BR": "Validar o formato necessário" } },
          { id: "narrow-variant", label: { en: "Narrow the relevant variant", "pt-BR": "Estreitar a variante relevante" } },
          { id: "use", label: { en: "Use the now-safe typed fields", "pt-BR": "Usar os campos agora tipados com segurança" } },
        ],
        correctOptionIds: ["receive", "validate", "narrow-variant", "use"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
  {
    id: "baseline-web-platform",
    competencyId: "web-platform-foundations",
    title: { en: "Web platform", "pt-BR": "Plataforma web" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "Which HTML primitive gives an action native keyboard semantics?",
          "pt-BR": "Qual primitiva HTML oferece semântica nativa de teclado para uma ação?",
        },
        options: [
          { id: "sound", label: { en: "A button element", "pt-BR": "Um elemento button" } },
          { id: "unsound", label: { en: "A clickable div", "pt-BR": "Uma div clicável" } },
          { id: "span-roleless", label: { en: "A span with an onclick handler", "pt-BR": "Um span com handler onclick" } },
          { id: "styled-paragraph", label: { en: "A styled paragraph with pointer cursor", "pt-BR": "Um parágrafo estilizado com cursor de ponteiro" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "A clickable div works with a mouse but not from the keyboard. What is the most robust fix?",
          "pt-BR": "Uma div clicável funciona com mouse, mas não pelo teclado. Qual é a correção mais robusta?",
        },
        options: [
          { id: "native-button", label: { en: "Use the native button element for the action", "pt-BR": "Usar o elemento button nativo para a ação" } },
          { id: "keypress-only", label: { en: "Add only a keypress handler to the div", "pt-BR": "Adicionar apenas um handler keypress à div" } },
          { id: "tabindex-only", label: { en: "Add tabindex without changing semantics", "pt-BR": "Adicionar tabindex sem alterar a semântica" } },
          { id: "mouse-doc", label: { en: "Document that the feature requires a mouse", "pt-BR": "Documentar que o recurso exige mouse" } },
        ],
        correctOptionIds: ["native-button"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two practices preserve browser-native resilience in a form?",
          "pt-BR": "Quais duas práticas preservam a resiliência nativa do navegador em um formulário?",
        },
        options: [
          { id: "labels", label: { en: "Associate visible labels with their controls", "pt-BR": "Associar labels visíveis aos seus controles" } },
          { id: "native-submit", label: { en: "Use native form and submit semantics before enhancing them", "pt-BR": "Usar semântica nativa de form e submit antes de aprimorá-la" } },
          { id: "click-only", label: { en: "Make submission available only through a click handler", "pt-BR": "Disponibilizar o envio apenas por um handler de clique" } },
          { id: "remove-focus", label: { en: "Remove focus indicators to reduce visual noise", "pt-BR": "Remover indicadores de foco para reduzir ruído visual" } },
        ],
        correctOptionIds: ["labels", "native-submit"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order a progressive-enhancement workflow for an interactive form.",
          "pt-BR": "Ordene um fluxo de progressive enhancement para um formulário interativo.",
        },
        options: [
          { id: "semantic", label: { en: "Start with semantic HTML that has a valid baseline behavior", "pt-BR": "Começar com HTML semântico que tenha um comportamento-base válido" } },
          { id: "enhance", label: { en: "Attach the optional client-side enhancement", "pt-BR": "Conectar o aprimoramento opcional no cliente" } },
          { id: "failures", label: { en: "Handle loading, failure, and lifecycle boundaries", "pt-BR": "Tratar limites de carregamento, falha e ciclo de vida" } },
          { id: "verify", label: { en: "Verify keyboard, focus, and fallback behavior", "pt-BR": "Verificar teclado, foco e comportamento de fallback" } },
        ],
        correctOptionIds: ["semantic", "enhance", "failures", "verify"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
  {
    id: "baseline-testing",
    competencyId: "testing-behavior",
    title: { en: "Testing behavior", "pt-BR": "Comportamento de testes" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "Which assertion best protects observable behavior?",
          "pt-BR": "Qual asserção protege melhor o comportamento observável?",
        },
        options: [
          { id: "sound", label: { en: "Assert the public outcome", "pt-BR": "Validar o resultado público" } },
          { id: "unsound", label: { en: "Assert a private helper call", "pt-BR": "Validar uma chamada de helper privado" } },
          { id: "line-count", label: { en: "Assert the implementation has the same line count", "pt-BR": "Validar que a implementação mantém a mesma quantidade de linhas" } },
          { id: "internal-state", label: { en: "Assert an incidental internal state field", "pt-BR": "Validar um campo incidental de estado interno" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "An async test is flaky because it sleeps for 500 ms before asserting. What is the better fix?",
          "pt-BR": "Um teste assíncrono é instável porque espera 500 ms antes da asserção. Qual é a melhor correção?",
        },
        options: [
          { id: "await-outcome", label: { en: "Wait for the observable condition that proves the behavior completed", "pt-BR": "Aguardar a condição observável que prova que o comportamento terminou" } },
          { id: "sleep-more", label: { en: "Increase the sleep to five seconds", "pt-BR": "Aumentar a espera para cinco segundos" } },
          { id: "retry-randomly", label: { en: "Retry the entire test randomly until it passes", "pt-BR": "Repetir o teste aleatoriamente até passar" } },
          { id: "remove-assertion", label: { en: "Remove the assertion that exposes the race", "pt-BR": "Remover a asserção que expõe a corrida" } },
        ],
        correctOptionIds: ["await-outcome"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two properties make a regression test useful?",
          "pt-BR": "Quais duas propriedades tornam um teste de regressão útil?",
        },
        options: [
          { id: "fails-before", label: { en: "It fails for the original defect before the fix", "pt-BR": "Ele falha para o defeito original antes da correção" } },
          { id: "observable", label: { en: "It asserts behavior at a meaningful public or contract boundary", "pt-BR": "Ele valida comportamento em um limite público ou contratual significativo" } },
          { id: "private-mock", label: { en: "It requires a mock for every private helper", "pt-BR": "Ele exige um mock para cada helper privado" } },
          { id: "large-snapshot", label: { en: "It snapshots unrelated output to maximize coverage", "pt-BR": "Ele cria snapshot de saída não relacionada para maximizar cobertura" } },
        ],
        correctOptionIds: ["fails-before", "observable"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order the minimal regression-test loop for a bug fix.",
          "pt-BR": "Ordene o ciclo mínimo de teste de regressão para corrigir um bug.",
        },
        options: [
          { id: "encode", label: { en: "Encode the reported behavior as a focused test", "pt-BR": "Codificar o comportamento reportado como um teste focado" } },
          { id: "red", label: { en: "Run it and confirm the expected RED failure", "pt-BR": "Executá-lo e confirmar a falha RED esperada" } },
          { id: "fix", label: { en: "Implement the smallest production fix", "pt-BR": "Implementar a menor correção de produção" } },
          { id: "green", label: { en: "Run the focused and surrounding tests to confirm GREEN", "pt-BR": "Executar os testes focados e relacionados para confirmar GREEN" } },
        ],
        correctOptionIds: ["encode", "red", "fix", "green"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
  {
    id: "baseline-http-api",
    competencyId: "http-api-engineering",
    title: { en: "HTTP API", "pt-BR": "HTTP API" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "Which response describes a malformed client request?",
          "pt-BR": "Qual resposta descreve uma requisição de cliente malformada?",
        },
        options: [
          { id: "sound", label: { en: "A clear 400 response", "pt-BR": "Uma resposta 400 clara" } },
          { id: "unsound", label: { en: "A successful 200 response", "pt-BR": "Uma resposta 200 de sucesso" } },
          { id: "redirect", label: { en: "An unrelated 302 redirect", "pt-BR": "Um redirecionamento 302 sem relação" } },
          { id: "server-error", label: { en: "A generic 500 for every validation failure", "pt-BR": "Um 500 genérico para toda falha de validação" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "A client retries a create request after a timeout and duplicate resources appear. Which boundary should be strengthened?",
          "pt-BR": "Um cliente repete uma requisição de criação após timeout e recursos duplicados aparecem. Qual limite deve ser fortalecido?",
        },
        options: [
          { id: "idempotency", label: { en: "Use an idempotency strategy for retryable creation", "pt-BR": "Usar uma estratégia de idempotência para criação sujeita a retry" } },
          { id: "hide-duplicates", label: { en: "Hide duplicates only in the UI", "pt-BR": "Ocultar duplicados apenas na interface" } },
          { id: "always-200", label: { en: "Return 200 before persistence finishes", "pt-BR": "Retornar 200 antes da persistência terminar" } },
          { id: "disable-errors", label: { en: "Suppress timeout errors on the client", "pt-BR": "Suprimir erros de timeout no cliente" } },
        ],
        correctOptionIds: ["idempotency"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two responsibilities belong at a robust API request boundary?",
          "pt-BR": "Quais duas responsabilidades pertencem ao limite de uma requisição de API robusta?",
        },
        options: [
          { id: "validate-input", label: { en: "Validate client-controlled input", "pt-BR": "Validar entrada controlada pelo cliente" } },
          { id: "authorize", label: { en: "Enforce authorization before protected effects", "pt-BR": "Aplicar autorização antes de efeitos protegidos" } },
          { id: "trust-client", label: { en: "Trust a client-supplied role without server verification", "pt-BR": "Confiar em um papel enviado pelo cliente sem verificação no servidor" } },
          { id: "success-errors", label: { en: "Encode every failure as a successful 200 response", "pt-BR": "Codificar toda falha como uma resposta 200 de sucesso" } },
        ],
        correctOptionIds: ["validate-input", "authorize"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order the main boundary steps for a protected mutation request.",
          "pt-BR": "Ordene as principais etapas de limite para uma requisição de mutação protegida.",
        },
        options: [
          { id: "parse", label: { en: "Parse and validate the request shape", "pt-BR": "Interpretar e validar o formato da requisição" } },
          { id: "auth", label: { en: "Authenticate and authorize the protected action", "pt-BR": "Autenticar e autorizar a ação protegida" } },
          { id: "mutate", label: { en: "Perform the validated mutation with its integrity boundary", "pt-BR": "Executar a mutação validada com seu limite de integridade" } },
          { id: "respond", label: { en: "Return an explicit status and response contract", "pt-BR": "Retornar status explícito e contrato de resposta" } },
        ],
        correctOptionIds: ["parse", "auth", "mutate", "respond"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
  {
    id: "baseline-git",
    competencyId: "git-collaboration",
    title: { en: "Git collaboration", "pt-BR": "Colaboração com Git" },
    dimensionLabel,
    challenges: [
      {
        suffix: "question",
        kind: "code-reading-choice",
        prompt: {
          en: "What makes a change easier to review?",
          "pt-BR": "O que torna uma mudança mais fácil de revisar?",
        },
        options: [
          { id: "sound", label: { en: "A focused, coherent commit", "pt-BR": "Um commit focado e coerente" } },
          { id: "unsound", label: { en: "An unrelated bulk change", "pt-BR": "Uma alteração em massa sem relação" } },
          { id: "mixed-formatting", label: { en: "A feature mixed with repository-wide formatting", "pt-BR": "Uma feature misturada com formatação do repositório inteiro" } },
          { id: "opaque-message", label: { en: "A large commit whose message says only update", "pt-BR": "Um commit grande cuja mensagem diz apenas update" } },
        ],
        correctOptionIds: ["sound"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "debugging",
        kind: "debugging-choice",
        prompt: {
          en: "A merge conflict appears in code changed intentionally by both branches. What should happen first?",
          "pt-BR": "Um conflito de merge aparece em código alterado intencionalmente pelas duas branches. O que deve acontecer primeiro?",
        },
        options: [
          { id: "inspect-intent", label: { en: "Inspect both changes and their intent before resolving", "pt-BR": "Inspecionar as duas mudanças e suas intenções antes de resolver" } },
          { id: "accept-ours", label: { en: "Always accept the current branch", "pt-BR": "Sempre aceitar a branch atual" } },
          { id: "accept-theirs", label: { en: "Always accept the incoming branch", "pt-BR": "Sempre aceitar a branch recebida" } },
          { id: "delete-file", label: { en: "Delete the conflicted file and recreate it later", "pt-BR": "Excluir o arquivo em conflito e recriá-lo depois" } },
        ],
        correctOptionIds: ["inspect-intent"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
      {
        suffix: "multi-select",
        kind: "multi-select",
        prompt: {
          en: "Which two practices improve reviewability and collaboration history?",
          "pt-BR": "Quais duas práticas melhoram a revisão e o histórico de colaboração?",
        },
        options: [
          { id: "separate", label: { en: "Separate unrelated concerns into coherent changes", "pt-BR": "Separar assuntos não relacionados em mudanças coerentes" } },
          { id: "explain", label: { en: "Explain intent and verification in the change context", "pt-BR": "Explicar intenção e verificação no contexto da mudança" } },
          { id: "force-shared", label: { en: "Force-push a shared branch without coordination", "pt-BR": "Fazer force-push em branch compartilhada sem coordenação" } },
          { id: "mix-generated", label: { en: "Mix generated noise with the behavioral change when avoidable", "pt-BR": "Misturar ruído gerado com a mudança comportamental quando for evitável" } },
        ],
        correctOptionIds: ["separate", "explain"],
        evidenceClass: "E1",
        demonstratedLevel: "foundation",
      },
      {
        suffix: "ordering",
        kind: "structured-ordering",
        prompt: {
          en: "Order a safe collaboration flow before pushing an updated branch.",
          "pt-BR": "Ordene um fluxo seguro de colaboração antes de enviar uma branch atualizada.",
        },
        options: [
          { id: "fetch", label: { en: "Fetch the latest relevant refs", "pt-BR": "Buscar as refs relevantes mais recentes" } },
          { id: "integrate", label: { en: "Integrate and resolve conflicts intentionally", "pt-BR": "Integrar e resolver conflitos de forma intencional" } },
          { id: "inspect", label: { en: "Inspect the resulting diff and history", "pt-BR": "Inspecionar o diff e o histórico resultantes" } },
          { id: "verify", label: { en: "Run relevant verification before pushing", "pt-BR": "Executar as verificações relevantes antes do push" } },
        ],
        correctOptionIds: ["fetch", "integrate", "inspect", "verify"],
        evidenceClass: "E2",
        demonstratedLevel: "developing",
      },
    ],
  },
] as const satisfies readonly BaselineDefinition[];

function criterionIdsFor(
  competencyId: string,
  level: "foundation" | "developing",
): readonly string[] {
  return level === "foundation"
    ? [`${competencyId}.foundation`]
    : [`${competencyId}.foundation`, `${competencyId}.developing`];
}

function createBaselineBlueprint(definition: BaselineDefinition): AssessmentBlueprint {
  return {
    id: definition.id,
    version: "1",
    competencyId: definition.competencyId,
    targetLevel: "developing",
    dimensions: [{ id: "reasoning", label: definition.dimensionLabel.en, required: false }],
    challenges: definition.challenges.map((challenge) => ({
      id: `${definition.id}-${challenge.suffix}`,
      dimensionId: "reasoning",
      kind: challenge.kind,
      prompt: challenge.prompt.en,
      options: challenge.options.map((option) => ({
        id: option.id,
        label: option.label.en,
      })),
      correctOptionIds: challenge.correctOptionIds,
      evidenceClass: challenge.evidenceClass,
      demonstratedLevel: challenge.demonstratedLevel,
      criterionIds: criterionIdsFor(definition.competencyId, challenge.demonstratedLevel),
    })),
    gates: [{
      dimensionId: "reasoning",
      minimumPassedChallenges: 3,
      requiredForLevel: "developing",
    }],
  };
}

export const baselineAssessmentBlueprints = baselineDefinitions.map(
  createBaselineBlueprint,
) satisfies readonly AssessmentBlueprint[];

function getBaselineDefinition(id: string): BaselineDefinition | null {
  return baselineDefinitions.find((definition) => definition.id === id) ?? null;
}

export function getAssessmentBlueprint(id: string): AssessmentBlueprint | null {
  return baselineAssessmentBlueprints.find((blueprint) => blueprint.id === id) ?? null;
}

export function getAssessmentPresentation(
  blueprint: AssessmentBlueprint,
  locale: Locale,
): Readonly<{ title: string; dimensionLabel: string }> {
  const definition = getBaselineDefinition(blueprint.id);
  if (!definition) {
    return {
      title: blueprint.competencyId,
      dimensionLabel: blueprint.dimensions[0]?.label ?? blueprint.competencyId,
    };
  }

  return {
    title: definition.title[locale],
    dimensionLabel: definition.dimensionLabel[locale],
  };
}

export function getPublicAssessmentBlueprintForLocale(
  blueprint: AssessmentBlueprint,
  locale: Locale,
): PublicAssessmentBlueprint {
  const publicBlueprint = toPublicAssessmentBlueprint(blueprint);
  const definition = getBaselineDefinition(blueprint.id);
  if (!definition) return publicBlueprint;

  const challengeCopy = new Map(
    definition.challenges.map((challenge) => [
      `${definition.id}-${challenge.suffix}`,
      challenge,
    ]),
  );

  return {
    ...publicBlueprint,
    dimensions: publicBlueprint.dimensions.map((dimension) =>
      dimension.id === "reasoning"
        ? { ...dimension, label: definition.dimensionLabel[locale] }
        : dimension,
    ),
    challenges: publicBlueprint.challenges.map((challenge) => {
      const localized = challengeCopy.get(challenge.id);
      if (!localized) return challenge;
      const options = new Map(localized.options.map((option) => [option.id, option]));
      return {
        ...challenge,
        prompt: localized.prompt[locale],
        options: challenge.options.map((option) => ({
          ...option,
          label: options.get(option.id)?.label[locale] ?? option.label,
        })),
      };
    }),
  };
}
