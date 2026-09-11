import type {
  LearningModule,
  LearningNote,
  LocalizedCodeExample,
  LocalizedText,
} from "./learning-types";

const reviewedAt = "2026-09-11T00:00:00.000Z";
const levels = ["foundation", "developing", "proficient", "advanced"] as const;

type ModuleLevel = (typeof levels)[number];

type ModuleSpec = Readonly<{
  title: LocalizedText;
  minutes: number;
  understand: LocalizedText;
  commonMistake: LocalizedText;
  practice: LocalizedText;
  consolidation: Readonly<{
    en: readonly [string, string, ...string[]];
    "pt-BR": readonly [string, string, ...string[]];
  }>;
  sourceIds: readonly string[];
  example?: LocalizedCodeExample;
  primarySourcePolicy?: LearningModule["primarySourcePolicy"];
  primarySourceReason?: LocalizedText;
}>;

type NoteSpec = Readonly<{
  id: string;
  competencyId: LearningNote["competencyId"];
  title: LocalizedText;
  summary: LocalizedText;
  objective: LocalizedText;
  modules: Readonly<Record<ModuleLevel, ModuleSpec>>;
}>;

function createModule(
  competencyId: LearningNote["competencyId"],
  level: ModuleLevel,
  spec: ModuleSpec,
): LearningModule {
  const id = `${competencyId}-${level}`;
  return {
    id,
    criterionId: `${competencyId}.${level}`,
    level,
    title: spec.title,
    estimatedMinutes: spec.minutes,
    contentVersion: "1",
    reviewStatus: "reviewed",
    reviewedAt,
    primarySourcePolicy: spec.primarySourcePolicy ?? "required",
    primarySourceReason: spec.primarySourceReason,
    understand: spec.understand,
    example: spec.example,
    commonMistake: spec.commonMistake,
    practice: {
      id: `${id}-practice`,
      prompt: spec.practice,
    },
    consolidationCriteria: spec.consolidation,
    sourceIds: spec.sourceIds,
  };
}

function createNote(spec: NoteSpec): LearningNote {
  const modules = levels.map((level) => createModule(spec.competencyId, level, spec.modules[level]));
  return {
    id: spec.id,
    competencyId: spec.competencyId,
    title: spec.title,
    summary: spec.summary,
    objective: spec.objective,
    estimatedMinutes: modules.reduce((total, learningModule) => total + learningModule.estimatedMinutes, 0),
    modules,
  };
}

const testingPrimaryReason = {
  en: "There is no single normative standard for software-test design; this module uses Testing Library's recognized behavior-first guidance as a pedagogical anchor.",
  "pt-BR": "Não há um único padrão normativo para design de testes de software; este módulo usa a orientação reconhecida e orientada a comportamento do Testing Library como âncora pedagógica.",
} as const;

export const learningNoteCatalog: readonly LearningNote[] = [
  createNote({
    id: "javascript-programming",
    competencyId: "programming-javascript",
    title: {
      en: "JavaScript programming",
      "pt-BR": "Programação com JavaScript",
    },
    summary: {
      en: "Reason explicitly about values, control flow, asynchronous work, failure, and runtime behavior.",
      "pt-BR": "Raciocine de forma explícita sobre valores, fluxo de controle, trabalho assíncrono, falhas e comportamento em runtime.",
    },
    objective: {
      en: "Build a language-level mental model that remains useful when application behavior becomes concurrent, stateful, or failure-prone.",
      "pt-BR": "Construa um modelo mental da linguagem que continue útil quando o comportamento da aplicação se tornar concorrente, stateful ou sujeito a falhas.",
    },
    modules: {
      foundation: {
        title: {
          en: "Control flow before syntax shortcuts",
          "pt-BR": "Fluxo de controle antes dos atalhos de sintaxe",
        },
        minutes: 7,
        understand: {
          en: "Promises and async functions do not remove control flow: an operation starts, settles later, and continues through an explicit success or failure path.",
          "pt-BR": "Promises e funções async não eliminam o fluxo de controle: uma operação começa, termina depois e continua por um caminho explícito de sucesso ou falha.",
        },
        example: {
          language: "javascript",
          code: {
            en: "async function load() {\n  try {\n    return await fetchData();\n  } catch (error) {\n    report(error);\n    throw error;\n  }\n}",
            "pt-BR": "async function load() {\n  try {\n    return await fetchData();\n  } catch (error) {\n    report(error);\n    throw error;\n  }\n}",
          },
        },
        commonMistake: {
          en: "Reading await as if it made the whole program synchronous and ignoring what can happen before the promise settles.",
          "pt-BR": "Ler await como se ele tornasse o programa inteiro síncrono e ignorar o que pode acontecer antes de a promise terminar.",
        },
        practice: {
          en: "Trace one async function and write the exact order of start, suspension, settlement, continuation, and error handling.",
          "pt-BR": "Rastreie uma função async e escreva a ordem exata de início, suspensão, resolução, continuação e tratamento de erro.",
        },
        consolidation: {
          en: [
            "Explains when an async function returns a promise.",
            "Identifies the explicit success and failure paths of a small async flow.",
          ],
          "pt-BR": [
            "Explica quando uma função async retorna uma promise.",
            "Identifica os caminhos explícitos de sucesso e falha de um fluxo assíncrono pequeno.",
          ],
        },
        sourceIds: ["mdn-async-function", "mdn-promise"],
      },
      developing: {
        title: {
          en: "State transitions and async races",
          "pt-BR": "Transições de estado e corridas assíncronas",
        },
        minutes: 8,
        understand: {
          en: "Stateful async code needs ownership and ordering rules. When operations can finish out of order, only a result that is still current should commit state.",
          "pt-BR": "Código assíncrono com estado precisa de regras de ownership e ordenação. Quando operações podem terminar fora de ordem, apenas um resultado que ainda é atual deve aplicar estado.",
        },
        example: {
          language: "javascript",
          code: {
            en: "const requestId = ++latestRequest;\nconst result = await search(query);\nif (requestId === latestRequest) state.result = result;",
            "pt-BR": "const requestId = ++latestRequest;\nconst result = await search(query);\nif (requestId === latestRequest) state.result = result;",
          },
        },
        commonMistake: {
          en: "Assuming promise completion order matches request start order and writing every result into shared state.",
          "pt-BR": "Assumir que a ordem de conclusão das promises corresponde à ordem de início das requisições e gravar todo resultado no estado compartilhado.",
        },
        practice: {
          en: "Refactor a loading/success/error interaction so stale results cannot overwrite the current request and cleanup is explicit.",
          "pt-BR": "Refatore uma interação de loading/sucesso/erro para que resultados obsoletos não sobrescrevam a requisição atual e a limpeza fique explícita.",
        },
        consolidation: {
          en: [
            "Describes the owner of each mutable state transition.",
            "Prevents an older async result from overwriting newer state.",
          ],
          "pt-BR": [
            "Descreve o responsável por cada transição de estado mutável.",
            "Impede que um resultado assíncrono antigo sobrescreva um estado mais novo.",
          ],
        },
        sourceIds: ["mdn-async-function", "mdn-promise"],
      },
      proficient: {
        title: {
          en: "Concurrency with explicit failure boundaries",
          "pt-BR": "Concorrência com limites explícitos de falha",
        },
        minutes: 9,
        understand: {
          en: "Independent promises may run concurrently while dependent work remains sequenced. The chosen combinator also defines how success and failure aggregate.",
          "pt-BR": "Promises independentes podem rodar concorrentemente enquanto trabalho dependente continua sequenciado. O combinador escolhido também define como sucesso e falha são agregados.",
        },
        example: {
          language: "javascript",
          code: {
            en: "const [profile, permissions] = await Promise.all([\n  loadProfile(),\n  loadPermissions(),\n]);",
            "pt-BR": "const [profile, permissions] = await Promise.all([\n  loadProfile(),\n  loadPermissions(),\n]);",
          },
        },
        commonMistake: {
          en: "Using sequential await for independent operations, or Promise.all when partial success is required product behavior.",
          "pt-BR": "Usar await sequencial para operações independentes ou Promise.all quando sucesso parcial é um comportamento necessário do produto.",
        },
        practice: {
          en: "Classify four async operations as dependent or independent, choose the execution strategy, and document its failure semantics.",
          "pt-BR": "Classifique quatro operações assíncronas como dependentes ou independentes, escolha a estratégia de execução e documente sua semântica de falha.",
        },
        consolidation: {
          en: [
            "Chooses sequential versus concurrent execution from data dependencies.",
            "Explains the failure behavior of the chosen promise combinator.",
          ],
          "pt-BR": [
            "Escolhe execução sequencial ou concorrente a partir das dependências de dados.",
            "Explica o comportamento de falha do combinador de promises escolhido.",
          ],
        },
        sourceIds: ["mdn-promise", "mdn-async-function"],
      },
      advanced: {
        title: {
          en: "Resilient async abstractions",
          "pt-BR": "Abstrações assíncronas resilientes",
        },
        minutes: 10,
        understand: {
          en: "A reusable async abstraction should expose cancellation, failure, ordering, and ownership semantics instead of hiding them behind a convenient helper.",
          "pt-BR": "Uma abstração assíncrona reutilizável deve expor semânticas de cancelamento, falha, ordenação e ownership em vez de escondê-las atrás de um helper conveniente.",
        },
        commonMistake: {
          en: "Creating a generic retry or queue helper whose API hides whether work is idempotent, cancellable, or safe to repeat.",
          "pt-BR": "Criar um helper genérico de retry ou fila cuja API esconde se o trabalho é idempotente, cancelável ou seguro para repetição.",
        },
        practice: {
          en: "Design a reusable async operation runner and state its cancellation, retry, concurrency, and error-propagation guarantees.",
          "pt-BR": "Projete um executor reutilizável de operações assíncronas e declare suas garantias de cancelamento, retry, concorrência e propagação de erros.",
        },
        consolidation: {
          en: [
            "Makes concurrency and failure guarantees explicit in an abstraction API.",
            "Justifies when an abstraction should expose instead of hide lifecycle control.",
          ],
          "pt-BR": [
            "Torna explícitas as garantias de concorrência e falha na API de uma abstração.",
            "Justifica quando uma abstração deve expor em vez de esconder controle de lifecycle.",
          ],
        },
        sourceIds: ["mdn-promise", "mdn-async-function"],
      },
    },
  }),
  createNote({
    id: "typescript-application-modeling",
    competencyId: "programming-typescript",
    title: {
      en: "TypeScript application modeling",
      "pt-BR": "Modelagem de aplicações com TypeScript",
    },
    summary: {
      en: "Use the type system to represent valid states and make unsafe boundaries explicit.",
      "pt-BR": "Use o sistema de tipos para representar estados válidos e tornar limites inseguros explícitos.",
    },
    objective: {
      en: "Move from annotating JavaScript shapes to designing domain states, narrowing rules, and maintainable typed boundaries.",
      "pt-BR": "Avance de anotar formatos JavaScript para projetar estados de domínio, regras de narrowing e limites tipados sustentáveis.",
    },
    modules: {
      foundation: {
        title: { en: "Narrow before use", "pt-BR": "Faça narrowing antes de usar" },
        minutes: 7,
        understand: {
          en: "A union becomes useful when control flow narrows it. Runtime checks and discriminants let TypeScript prove which operations are safe on each branch.",
          "pt-BR": "Uma union se torna útil quando o fluxo de controle faz narrowing. Verificações em runtime e discriminantes permitem ao TypeScript provar quais operações são seguras em cada ramo.",
        },
        example: {
          language: "typescript",
          code: {
            en: "function format(value: string | number) {\n  return typeof value === \"number\" ? value.toFixed(2) : value.trim();\n}",
            "pt-BR": "function format(value: string | number) {\n  return typeof value === \"number\" ? value.toFixed(2) : value.trim();\n}",
          },
        },
        commonMistake: {
          en: "Replacing a real narrowing step with a type assertion, which silences uncertainty instead of proving the value shape.",
          "pt-BR": "Substituir uma etapa real de narrowing por uma asserção de tipo, silenciando a incerteza em vez de provar o formato do valor.",
        },
        practice: {
          en: "Refactor a function that uses assertions on a union so each branch narrows from observable runtime information.",
          "pt-BR": "Refatore uma função que usa assertions em uma union para que cada ramo faça narrowing a partir de informação observável em runtime.",
        },
        consolidation: {
          en: ["Distinguishes narrowing from type assertion.", "Writes a control-flow check that safely narrows a union."],
          "pt-BR": ["Distingue narrowing de asserção de tipo.", "Escreve uma verificação de fluxo que faz narrowing seguro de uma union."],
        },
        sourceIds: ["typescript-handbook-narrowing"],
      },
      developing: {
        title: {
          en: "Make impossible states unrepresentable",
          "pt-BR": "Torne estados impossíveis irrepresentáveis",
        },
        minutes: 8,
        understand: {
          en: "Discriminated unions let each application state carry only the fields valid for that state, reducing contradictory booleans and optional-field combinations.",
          "pt-BR": "Discriminated unions permitem que cada estado da aplicação carregue apenas os campos válidos para aquele estado, reduzindo combinações contraditórias de booleanos e campos opcionais.",
        },
        example: {
          language: "typescript",
          code: {
            en: "type LoadState =\n  | { status: \"loading\" }\n  | { status: \"success\"; data: User }\n  | { status: \"error\"; error: Error };",
            "pt-BR": "type LoadState =\n  | { status: \"loading\" }\n  | { status: \"success\"; data: User }\n  | { status: \"error\"; error: Error };",
          },
        },
        commonMistake: {
          en: "One interface with every state-specific field optional, allowing combinations the application should never enter.",
          "pt-BR": "Uma interface única com todos os campos específicos de estado opcionais, permitindo combinações em que a aplicação nunca deveria entrar.",
        },
        practice: {
          en: "Model loading, empty, success, and error as explicit variants and remove fields that are invalid in each variant.",
          "pt-BR": "Modele loading, vazio, sucesso e erro como variantes explícitas e remova campos inválidos de cada variante.",
        },
        consolidation: {
          en: [
            "Identifies an impossible combination allowed by a loose interface.",
            "Models application states as discriminated variants with exhaustive handling.",
          ],
          "pt-BR": [
            "Identifica uma combinação impossível permitida por uma interface frouxa.",
            "Modela estados da aplicação como variantes discriminadas com tratamento exaustivo.",
          ],
        },
        sourceIds: ["typescript-handbook-narrowing"],
      },
      proficient: {
        title: {
          en: "Validate external data at the boundary",
          "pt-BR": "Valide dados externos na fronteira",
        },
        minutes: 9,
        understand: {
          en: "Static types do not validate network or storage data. Treat untrusted values as unknown, validate them, then expose a trusted typed contract to the application.",
          "pt-BR": "Tipos estáticos não validam dados de rede ou storage. Trate valores não confiáveis como unknown, valide-os e então exponha um contrato tipado confiável para a aplicação.",
        },
        commonMistake: {
          en: "Casting JSON directly to the desired interface and treating the assertion as runtime validation.",
          "pt-BR": "Fazer cast direto do JSON para a interface desejada e tratar a assertion como validação em runtime.",
        },
        practice: {
          en: "Design one external-data boundary that accepts unknown, validates the required shape, and returns a narrow domain type.",
          "pt-BR": "Projete uma fronteira de dados externos que aceite unknown, valide o formato necessário e retorne um tipo de domínio estreito.",
        },
        consolidation: {
          en: [
            "Explains why a type assertion cannot validate external data.",
            "Separates an untrusted input type from the trusted domain type returned by a boundary.",
          ],
          "pt-BR": [
            "Explica por que uma asserção de tipo não valida dados externos.",
            "Separa o tipo de entrada não confiável do tipo de domínio confiável retornado por uma fronteira.",
          ],
        },
        sourceIds: ["typescript-handbook-narrowing", "typescript-handbook-type-manipulation"],
      },
      advanced: {
        title: {
          en: "Precision without type-system theater",
          "pt-BR": "Precisão sem teatro de sistema de tipos",
        },
        minutes: 10,
        understand: {
          en: "Advanced type manipulation is useful when it preserves domain relationships and API ergonomics. Complexity that only demonstrates cleverness increases maintenance cost.",
          "pt-BR": "Manipulação avançada de tipos é útil quando preserva relações do domínio e ergonomia da API. Complexidade que apenas demonstra esperteza aumenta o custo de manutenção.",
        },
        commonMistake: {
          en: "Building deeply conditional generic types for a small API when an explicit union would be easier to understand and evolve.",
          "pt-BR": "Construir tipos genéricos profundamente condicionais para uma API pequena quando uma union explícita seria mais fácil de entender e evoluir.",
        },
        practice: {
          en: "Compare two typings for the same reusable API and justify which better balances precision, inference, error messages, and maintenance.",
          "pt-BR": "Compare duas tipagens para a mesma API reutilizável e justifique qual equilibra melhor precisão, inferência, mensagens de erro e manutenção.",
        },
        consolidation: {
          en: [
            "States the domain relationship an advanced type preserves.",
            "Rejects a more precise type design when its maintenance or ergonomics cost is not justified.",
          ],
          "pt-BR": [
            "Declara a relação de domínio preservada por um tipo avançado.",
            "Rejeita um design de tipos mais preciso quando seu custo de manutenção ou ergonomia não se justifica.",
          ],
        },
        sourceIds: ["typescript-handbook-type-manipulation", "typescript-handbook-narrowing"],
      },
    },
  }),
  createNote({
    id: "testing-observable-behavior",
    competencyId: "testing-behavior",
    title: { en: "Testing observable behavior", "pt-BR": "Testando comportamento observável" },
    summary: {
      en: "Protect meaningful behavioral contracts without coupling tests to incidental implementation detail.",
      "pt-BR": "Proteja contratos de comportamento relevantes sem acoplar testes a detalhes incidentais de implementação.",
    },
    objective: {
      en: "Design tests from outcomes, boundaries, failure modes, and risk so refactors can change internals safely.",
      "pt-BR": "Projete testes a partir de resultados, fronteiras, modos de falha e risco para que refactors possam mudar internos com segurança.",
    },
    modules: {
      foundation: {
        title: { en: "Assert the contract, not the mechanism", "pt-BR": "Teste o contrato, não o mecanismo" },
        minutes: 7,
        primarySourcePolicy: "not-available",
        primarySourceReason: testingPrimaryReason,
        understand: {
          en: "A resilient test observes the meaningful output or interaction contract a consumer sees instead of private state or implementation structure.",
          "pt-BR": "Um teste resiliente observa o resultado relevante ou contrato de interação que um consumidor vê em vez de estado privado ou estrutura de implementação.",
        },
        commonMistake: {
          en: "Asserting internal state or helper calls when the user-visible result is the real contract.",
          "pt-BR": "Fazer assertions sobre estado interno ou chamadas de helpers quando o resultado visível ao usuário é o contrato real.",
        },
        practice: {
          en: "Rewrite one implementation-detail assertion as an assertion on an observable result and name the contract it protects.",
          "pt-BR": "Reescreva uma assertion de detalhe de implementação como uma assertion sobre um resultado observável e nomeie o contrato protegido.",
        },
        consolidation: {
          en: ["States the behavioral contract of a test in one sentence.", "Distinguishes a consumer-visible outcome from an implementation detail."],
          "pt-BR": ["Declara o contrato comportamental de um teste em uma frase.", "Distingue um resultado visível ao consumidor de um detalhe de implementação."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      },
      developing: {
        title: { en: "Exercise failure and boundary behavior", "pt-BR": "Exercite falhas e comportamento de fronteira" },
        minutes: 8,
        primarySourcePolicy: "not-available",
        primarySourceReason: testingPrimaryReason,
        understand: {
          en: "Success-only tests leave important contracts unprotected. Boundaries deserve explicit cases for invalid input, rejected operations, empty data, and recovery behavior.",
          "pt-BR": "Testes apenas de sucesso deixam contratos importantes sem proteção. Fronteiras merecem casos explícitos para entrada inválida, operações rejeitadas, dados vazios e comportamento de recuperação.",
        },
        commonMistake: {
          en: "Adding many happy-path examples while never testing the failure branch that carries the highest product risk.",
          "pt-BR": "Adicionar muitos exemplos de happy path sem testar o ramo de falha que carrega o maior risco do produto.",
        },
        practice: {
          en: "For one real boundary, add success, invalid-input, dependency-failure, and recovery cases using observable outcomes.",
          "pt-BR": "Para uma fronteira real, adicione casos de sucesso, entrada inválida, falha de dependência e recuperação usando resultados observáveis.",
        },
        consolidation: {
          en: ["Identifies failure modes from the contract instead of line coverage.", "Writes a boundary test that remains valid after an internal refactor."],
          "pt-BR": ["Identifica modos de falha a partir do contrato em vez de line coverage.", "Escreve um teste de fronteira que continua válido após um refactor interno."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      },
      proficient: {
        title: { en: "Choose the smallest trustworthy boundary", "pt-BR": "Escolha a menor fronteira confiável" },
        minutes: 9,
        primarySourcePolicy: "not-available",
        primarySourceReason: testingPrimaryReason,
        understand: {
          en: "A strong suite places each contract at the lowest layer that can verify it faithfully while preserving integration tests for behavior that only exists across boundaries.",
          "pt-BR": "Uma suíte forte coloca cada contrato na camada mais baixa que consegue verificá-lo com fidelidade, preservando testes de integração para comportamentos que só existem entre fronteiras.",
        },
        commonMistake: {
          en: "Mocking every dependency until an integration contract disappears, or testing every detail through a slow end-to-end path.",
          "pt-BR": "Mockar toda dependência até o contrato de integração desaparecer ou testar todo detalhe por um caminho end-to-end lento.",
        },
        practice: {
          en: "Take five existing tests, name each protected contract, and rewrite any test whose current layer cannot verify that contract faithfully.",
          "pt-BR": "Pegue cinco testes existentes, nomeie o contrato protegido por cada um e reescreva qualquer teste cuja camada atual não consiga verificar esse contrato com fidelidade.",
        },
        consolidation: {
          en: ["Justifies the verification layer for a contract.", "Identifies when a mock removes the behavior the test is supposed to verify."],
          "pt-BR": ["Justifica a camada de verificação de um contrato.", "Identifica quando um mock remove o comportamento que o teste deveria verificar."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      },
      advanced: {
        title: { en: "Verification architecture by risk", "pt-BR": "Arquitetura de verificação orientada a risco" },
        minutes: 10,
        primarySourcePolicy: "not-available",
        primarySourceReason: testingPrimaryReason,
        understand: {
          en: "Verification architecture allocates stronger, more expensive checks to higher-risk contracts while keeping fast deterministic feedback close to development.",
          "pt-BR": "A arquitetura de verificação aloca checks mais fortes e caros para contratos de maior risco, mantendo feedback rápido e determinístico próximo do desenvolvimento.",
        },
        commonMistake: {
          en: "Treating test count or coverage percentage as the strategy instead of identifying risk classes, contracts, and failure diagnostics.",
          "pt-BR": "Tratar quantidade de testes ou porcentagem de coverage como a estratégia em vez de identificar classes de risco, contratos e diagnóstico de falhas.",
        },
        practice: {
          en: "Create a verification matrix for one feature that maps risk classes to unit, integration, end-to-end, and manual checks with a reason for each.",
          "pt-BR": "Crie uma matriz de verificação para uma feature que mapeie classes de risco para checks unitários, integração, end-to-end e manuais, justificando cada um.",
        },
        consolidation: {
          en: ["Connects test-layer investment to explicit product or engineering risk.", "Designs failure diagnostics so a broken contract is localizable rather than merely detected."],
          "pt-BR": ["Conecta investimento em camadas de teste a risco explícito de produto ou engenharia.", "Projeta diagnóstico de falha para que um contrato quebrado seja localizável, não apenas detectado."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      },
    },
  }),
  createNote({
    id: "http-api-boundaries",
    competencyId: "http-api-engineering",
    title: { en: "HTTP and API boundaries", "pt-BR": "Limites HTTP e API" },
    summary: {
      en: "Turn transport details into explicit request, response, validation, failure, and compatibility contracts.",
      "pt-BR": "Transforme detalhes de transporte em contratos explícitos de requisição, resposta, validação, falha e compatibilidade.",
    },
    objective: {
      en: "Use HTTP semantics deliberately so clients can reason about operations, errors, retries, and evolution.",
      "pt-BR": "Use a semântica HTTP deliberadamente para que clientes possam raciocinar sobre operações, erros, retries e evolução.",
    },
    modules: {
      foundation: {
        title: { en: "HTTP semantics are part of the contract", "pt-BR": "Semântica HTTP faz parte do contrato" },
        minutes: 7,
        understand: {
          en: "Method, status, headers, and representation each communicate contract meaning. They are not decoration around a JSON payload.",
          "pt-BR": "Método, status, headers e representação comunicam significado de contrato. Eles não são decoração em volta de um payload JSON.",
        },
        commonMistake: {
          en: "Returning 200 for every outcome and encoding all success or failure semantics only inside an ad-hoc response body.",
          "pt-BR": "Retornar 200 para todo resultado e codificar toda semântica de sucesso ou falha apenas em um body ad hoc.",
        },
        practice: {
          en: "For five endpoint outcomes, choose method/status semantics and explain what a generic HTTP client can infer without domain-specific parsing.",
          "pt-BR": "Para cinco resultados de endpoint, escolha método/status e explique o que um cliente HTTP genérico consegue inferir sem parsing específico de domínio.",
        },
        consolidation: {
          en: ["Explains the semantic role of method and status independently from the body.", "Distinguishes successful, client-error, and server-error response classes."],
          "pt-BR": ["Explica o papel semântico de método e status independentemente do body.", "Distingue classes de resposta de sucesso, erro do cliente e erro do servidor."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      },
      developing: {
        title: { en: "Validate inputs and stabilize failures", "pt-BR": "Valide entradas e estabilize falhas" },
        minutes: 8,
        understand: {
          en: "An API boundary owns validation and the public failure contract. Internal exceptions should become stable client-facing categories instead of leaked implementation detail.",
          "pt-BR": "Uma fronteira de API é responsável pela validação e pelo contrato público de falhas. Exceções internas devem virar categorias estáveis para o cliente em vez de detalhes de implementação vazados.",
        },
        commonMistake: {
          en: "Letting database or framework error strings become the external API contract.",
          "pt-BR": "Deixar strings de erro do banco ou framework virarem o contrato externo da API.",
        },
        practice: {
          en: "Define validation and stable error responses for one endpoint, separating invalid input, missing resource, conflict, and internal failure.",
          "pt-BR": "Defina validação e respostas de erro estáveis para um endpoint, separando entrada inválida, recurso ausente, conflito e falha interna.",
        },
        consolidation: {
          en: ["Identifies validation that belongs at the transport boundary.", "Maps internal failures to stable external semantics without exposing sensitive implementation details."],
          "pt-BR": ["Identifica validação que pertence à fronteira de transporte.", "Mapeia falhas internas para semântica externa estável sem expor detalhes sensíveis de implementação."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      },
      proficient: {
        title: { en: "Idempotency, authorization, and retry safety", "pt-BR": "Idempotência, autorização e segurança de retry" },
        minutes: 9,
        understand: {
          en: "Retry behavior depends on operation semantics. Robust boundaries also verify authorization for the requested resource instead of treating authentication as sufficient permission.",
          "pt-BR": "O comportamento de retry depende da semântica da operação. Fronteiras robustas também verificam autorização para o recurso solicitado em vez de tratar autenticação como permissão suficiente.",
        },
        commonMistake: {
          en: "Automatically retrying a non-idempotent mutation without an idempotency contract and potentially duplicating side effects.",
          "pt-BR": "Repetir automaticamente uma mutação não idempotente sem contrato de idempotência e potencialmente duplicar efeitos colaterais.",
        },
        practice: {
          en: "Analyze a mutation endpoint for duplicate requests, authorization scope, partial failure, and client retry behavior; define the contract that makes each safe.",
          "pt-BR": "Analise um endpoint de mutação quanto a requisições duplicadas, escopo de autorização, falha parcial e retry do cliente; defina o contrato que torna cada caso seguro.",
        },
        consolidation: {
          en: ["Explains whether an operation is safe to retry and why.", "Separates authentication from resource-level authorization in an API contract."],
          "pt-BR": ["Explica se uma operação é segura para retry e por quê.", "Separa autenticação de autorização em nível de recurso em um contrato de API."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      },
      advanced: {
        title: { en: "Evolve contracts under distributed failure", "pt-BR": "Evolua contratos sob falhas distribuídas" },
        minutes: 10,
        understand: {
          en: "API evolution must preserve observable contracts while accounting for caches, intermediaries, retries, latency, and clients that upgrade at different times.",
          "pt-BR": "A evolução de APIs deve preservar contratos observáveis considerando caches, intermediários, retries, latência e clientes que atualizam em momentos diferentes.",
        },
        commonMistake: {
          en: "Treating a server deployment as an atomic contract migration for every client and intermediary.",
          "pt-BR": "Tratar um deploy do servidor como uma migração atômica de contrato para todo cliente e intermediário.",
        },
        practice: {
          en: "Plan a backwards-compatible change to a high-traffic endpoint, including observability, rollout, retry behavior, and a rollback condition.",
          "pt-BR": "Planeje uma mudança retrocompatível em um endpoint de alto tráfego, incluindo observabilidade, rollout, comportamento de retry e condição de rollback.",
        },
        consolidation: {
          en: ["Distinguishes server implementation change from externally observable contract change.", "Describes a compatibility and rollback strategy that accounts for clients and intermediaries."],
          "pt-BR": ["Distingue mudança de implementação do servidor de mudança de contrato externamente observável.", "Descreve uma estratégia de compatibilidade e rollback que considere clientes e intermediários."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      },
    },
  }),
  createNote({
    id: "git-collaboration-workflow",
    competencyId: "git-collaboration",
    title: { en: "Reviewable Git collaboration", "pt-BR": "Colaboração revisável com Git" },
    summary: {
      en: "Shape changes into traceable commits and integration units that reviewers can understand, verify, and recover.",
      "pt-BR": "Estruture mudanças em commits rastreáveis e unidades de integração que revisores consigam entender, verificar e recuperar.",
    },
    objective: {
      en: "Use history as an engineering artifact for intent, review, rollback, and concurrent collaboration.",
      "pt-BR": "Use o histórico como artefato de engenharia para intenção, revisão, rollback e colaboração concorrente.",
    },
    modules: {
      foundation: {
        title: { en: "Commits as coherent history units", "pt-BR": "Commits como unidades coerentes de histórico" },
        minutes: 6,
        understand: {
          en: "A commit records a snapshot plus intent. Focused commits make history inspection, review, and reversal easier than mixed unrelated changes.",
          "pt-BR": "Um commit registra um snapshot com intenção. Commits focados tornam inspeção de histórico, review e reversão mais fáceis do que mudanças não relacionadas misturadas.",
        },
        commonMistake: {
          en: "Using one catch-all commit for formatting, behavior changes, dependency updates, and unrelated fixes.",
          "pt-BR": "Usar um único commit genérico para formatação, mudanças de comportamento, atualização de dependências e correções não relacionadas.",
        },
        practice: {
          en: "Split a mixed change set into focused commits and write a message that states the intent of each one.",
          "pt-BR": "Divida um conjunto misturado de mudanças em commits focados e escreva uma mensagem que declare a intenção de cada um.",
        },
        consolidation: {
          en: ["Explains what belongs together in one commit.", "Uses history to identify and revert a focused change safely."],
          "pt-BR": ["Explica o que pertence junto em um commit.", "Usa o histórico para identificar e reverter uma mudança focada com segurança."],
        },
        sourceIds: ["git-commit-reference"],
      },
      developing: {
        title: { en: "Reviewable branches and pull requests", "pt-BR": "Branches e pull requests revisáveis" },
        minutes: 7,
        understand: {
          en: "A reviewable branch has a bounded purpose, coherent history, verification evidence, and a clear integration path.",
          "pt-BR": "Uma branch revisável tem propósito limitado, histórico coerente, evidência de verificação e um caminho claro de integração.",
        },
        commonMistake: {
          en: "Keeping unrelated work on a long-lived branch until review requires understanding several features at once.",
          "pt-BR": "Manter trabalho não relacionado em uma branch longa até que o review exija entender várias features de uma vez.",
        },
        practice: {
          en: "Prepare a small branch with a clear scope, semantic commits, verification evidence, and an explicit rollback note.",
          "pt-BR": "Prepare uma branch pequena com escopo claro, commits semânticos, evidência de verificação e uma nota explícita de rollback.",
        },
        consolidation: {
          en: ["Explains the intended integration unit from branch history alone.", "States how to isolate or revert the change if integration fails."],
          "pt-BR": ["Explica a unidade de integração pretendida apenas pelo histórico da branch.", "Declara como isolar ou reverter a mudança se a integração falhar."],
        },
        sourceIds: ["git-commit-reference", "pro-git-distributed-workflows"],
      },
      proficient: {
        title: { en: "Integrate concurrent work deliberately", "pt-BR": "Integre trabalho concorrente deliberadamente" },
        minutes: 8,
        understand: {
          en: "Concurrent collaboration needs an integration strategy: contributors prepare bounded changes, an integration owner resolves conflicts with context, and the shared branch remains recoverable.",
          "pt-BR": "Colaboração concorrente precisa de estratégia de integração: contribuidores preparam mudanças limitadas, um responsável integra conflitos com contexto e a branch compartilhada permanece recuperável.",
        },
        commonMistake: {
          en: "Resolving conflicts mechanically without understanding which side owns the intended contract after integration.",
          "pt-BR": "Resolver conflitos mecanicamente sem entender qual lado possui o contrato pretendido após a integração.",
        },
        practice: {
          en: "Simulate two conflicting feature branches, resolve the conflict from intended behavior, and document verification after integration.",
          "pt-BR": "Simule duas branches de feature conflitantes, resolva o conflito a partir do comportamento pretendido e documente a verificação após a integração.",
        },
        consolidation: {
          en: ["Resolves a conflict from ownership and contract intent rather than text position alone.", "Preserves traceability and verification after integrating concurrent work."],
          "pt-BR": ["Resolve um conflito a partir de ownership e intenção do contrato, não apenas da posição textual.", "Preserva rastreabilidade e verificação após integrar trabalho concorrente."],
        },
        sourceIds: ["pro-git-distributed-workflows", "git-commit-reference"],
      },
      advanced: {
        title: { en: "Design collaboration and recovery conventions", "pt-BR": "Projete convenções de colaboração e recuperação" },
        minutes: 9,
        understand: {
          en: "Repository conventions should optimize review, ownership, release safety, and recovery for the team's actual topology instead of copying a branching model by habit.",
          "pt-BR": "Convenções de repositório devem otimizar review, ownership, segurança de release e recuperação para a topologia real do time, em vez de copiar um modelo de branches por hábito.",
        },
        commonMistake: {
          en: "Adopting a complex branching policy without defining who integrates, how releases are cut, or how a bad change is recovered.",
          "pt-BR": "Adotar uma política complexa de branches sem definir quem integra, como releases são cortadas ou como uma mudança ruim é recuperada.",
        },
        practice: {
          en: "Design a repository workflow for a multi-contributor team, including ownership, integration, release, rollback, and emergency-fix paths.",
          "pt-BR": "Projete um workflow de repositório para um time com múltiplos contribuidores, incluindo ownership, integração, release, rollback e caminho de hotfix.",
        },
        consolidation: {
          en: ["Connects repository workflow choices to team topology and release risk.", "Describes a recovery path that preserves traceability under production pressure."],
          "pt-BR": ["Conecta escolhas de workflow do repositório à topologia do time e risco de release.", "Descreve um caminho de recuperação que preserve rastreabilidade sob pressão de produção."],
        },
        sourceIds: ["pro-git-distributed-workflows", "git-commit-reference"],
      },
    },
  }),
  createNote({
    id: "accessible-interface-fundamentals",
    competencyId: "web-accessibility",
    title: { en: "Accessible interface fundamentals", "pt-BR": "Fundamentos de interfaces acessíveis" },
    summary: {
      en: "Treat semantics, keyboard operation, focus, naming, and interaction patterns as correctness requirements.",
      "pt-BR": "Trate semântica, operação por teclado, foco, nomes acessíveis e padrões de interação como requisitos de correção.",
    },
    objective: {
      en: "Build accessibility into interface structure and behavior before relying on visual polish or remediation.",
      "pt-BR": "Construa acessibilidade na estrutura e no comportamento da interface antes de depender de polimento visual ou remediação.",
    },
    modules: {
      foundation: {
        title: { en: "Native semantics first", "pt-BR": "Semântica nativa primeiro" },
        minutes: 7,
        understand: {
          en: "Native controls already provide semantics and expected keyboard behavior. Use the element whose built-in contract matches the interaction before adding ARIA or custom handlers.",
          "pt-BR": "Controles nativos já oferecem semântica e comportamento de teclado esperado. Use o elemento cujo contrato nativo corresponde à interação antes de adicionar ARIA ou handlers customizados.",
        },
        example: {
          language: "html",
          code: {
            en: "<button type=\"button\">Save changes</button>",
            "pt-BR": "<button type=\"button\">Salvar alterações</button>",
          },
        },
        commonMistake: {
          en: "Using a clickable div for a button action and then recreating focus, keyboard, and semantic behavior manually.",
          "pt-BR": "Usar uma div clicável para uma ação de botão e depois recriar manualmente foco, teclado e semântica.",
        },
        practice: {
          en: "Audit five interactive elements and replace any custom primitive whose intent is already represented by a native HTML control.",
          "pt-BR": "Audite cinco elementos interativos e substitua qualquer primitiva customizada cuja intenção já seja representada por um controle HTML nativo.",
        },
        consolidation: {
          en: ["Chooses a native element from interaction intent.", "Explains why keyboard access and accessible naming are correctness requirements."],
          "pt-BR": ["Escolhe um elemento nativo a partir da intenção da interação.", "Explica por que acesso por teclado e nome acessível são requisitos de correção."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      },
      developing: {
        title: { en: "Keyboard, focus, and status are one interaction", "pt-BR": "Teclado, foco e status formam uma única interação" },
        minutes: 8,
        understand: {
          en: "An interaction is not accessible merely because it can receive focus. Users need logical focus order, visible focus, operable controls, and status changes exposed without color alone.",
          "pt-BR": "Uma interação não é acessível apenas porque recebe foco. Usuários precisam de ordem lógica de foco, foco visível, controles operáveis e mudanças de status expostas sem depender apenas de cor.",
        },
        commonMistake: {
          en: "Adding tabindex to a custom control while activation, focus management, or state communication remains mouse-only.",
          "pt-BR": "Adicionar tabindex a um controle customizado enquanto ativação, gerenciamento de foco ou comunicação de estado continuam exclusivos do mouse.",
        },
        practice: {
          en: "Complete one dialog or form flow using only the keyboard, correcting focus order, visible focus, labels, and dynamic status communication.",
          "pt-BR": "Complete um fluxo de dialog ou formulário usando apenas o teclado, corrigindo ordem de foco, foco visível, labels e comunicação dinâmica de status.",
        },
        consolidation: {
          en: ["Completes the interaction without a pointer and without losing focus context.", "Communicates state through text or semantics in addition to visual styling."],
          "pt-BR": ["Completa a interação sem ponteiro e sem perder o contexto de foco.", "Comunica estado por texto ou semântica além do estilo visual."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      },
      proficient: {
        title: { en: "Implement complex patterns from their interaction contract", "pt-BR": "Implemente padrões complexos a partir do contrato de interação" },
        minutes: 9,
        understand: {
          en: "Complex widgets such as dialogs, tabs, menus, and comboboxes have keyboard and focus contracts. Choose the pattern by behavior, then implement and verify it as a whole.",
          "pt-BR": "Widgets complexos como dialogs, tabs, menus e comboboxes têm contratos de teclado e foco. Escolha o padrão pelo comportamento e então implemente e verifique o conjunto.",
        },
        commonMistake: {
          en: "Copying ARIA roles onto custom markup without implementing the keyboard and focus behavior expected by that pattern.",
          "pt-BR": "Copiar roles ARIA para markup customizado sem implementar o comportamento de teclado e foco esperado pelo padrão.",
        },
        practice: {
          en: "Choose one complex widget, compare it with the relevant APG pattern, and verify semantics, keyboard commands, focus entry, and focus exit.",
          "pt-BR": "Escolha um widget complexo, compare-o com o padrão relevante do APG e verifique semântica, comandos de teclado, entrada de foco e saída de foco.",
        },
        consolidation: {
          en: ["Derives implementation requirements from a documented interaction pattern.", "Diagnoses a widget where roles are correct but keyboard or focus behavior is not."],
          "pt-BR": ["Deriva requisitos de implementação de um padrão de interação documentado.", "Diagnostica um widget em que roles estão corretos, mas teclado ou foco não."],
        },
        sourceIds: ["aria-authoring-practices", "wcag-22"],
      },
      advanced: {
        title: { en: "Make accessibility a system invariant", "pt-BR": "Torne acessibilidade uma invariante do sistema" },
        minutes: 10,
        understand: {
          en: "Accessibility scales when component APIs, design-system primitives, review criteria, and regression checks make correct behavior the easiest default.",
          "pt-BR": "Acessibilidade escala quando APIs de componentes, primitivas do design system, critérios de review e checks de regressão tornam o comportamento correto o padrão mais fácil.",
        },
        commonMistake: {
          en: "Relying on periodic audits while reusable components still permit unlabeled, keyboard-incomplete, or focus-unsafe variants.",
          "pt-BR": "Depender de auditorias periódicas enquanto componentes reutilizáveis ainda permitem variantes sem label, incompletas por teclado ou inseguras para foco.",
        },
        practice: {
          en: "Redesign one design-system primitive so accessible naming, keyboard behavior, and focus rules are difficult to bypass in its API and regression checks.",
          "pt-BR": "Redesenhe uma primitiva do design system para que nome acessível, comportamento de teclado e regras de foco sejam difíceis de contornar em sua API e checks de regressão.",
        },
        consolidation: {
          en: ["Encodes accessibility expectations into reusable component contracts.", "Distinguishes accessibility regressions suited to automation from those that still require human verification."],
          "pt-BR": ["Codifica expectativas de acessibilidade em contratos de componentes reutilizáveis.", "Distingue regressões de acessibilidade adequadas à automação daquelas que ainda exigem verificação humana."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      },
    },
  }),
];

const noteById = new Map<string, LearningNote>(
  learningNoteCatalog.map((note) => [note.id, note] as const),
);
const noteByCompetency = new Map<LearningNote["competencyId"], LearningNote>(
  learningNoteCatalog.map((note) => [note.competencyId, note] as const),
);

export function getLearningNote(noteId: string): LearningNote | undefined {
  return noteById.get(noteId);
}

export function getLearningNoteByCompetency(
  competencyId: LearningNote["competencyId"],
): LearningNote | undefined {
  return noteByCompetency.get(competencyId);
}

export function getReviewedLearningModules(note: LearningNote): readonly LearningModule[] {
  return note.modules.filter((learningModule) => learningModule.reviewStatus === "reviewed");
}

export function getLearningModuleByCriterion(
  criterionId: string,
): Readonly<{ note: LearningNote; module: LearningModule }> | undefined {
  for (const note of learningNoteCatalog) {
    const learningModule = note.modules.find(
      (candidate) => candidate.criterionId === criterionId,
    );
    if (learningModule) return { note, module: learningModule };
  }
  return undefined;
}
