import type { LearningModule, LearningNote } from "./learning-types";

const reviewedAt = "2026-09-11T00:00:00.000Z";

type ReviewedModuleInput = Omit<
  LearningModule,
  "contentVersion" | "reviewStatus" | "reviewedAt" | "primarySourcePolicy"
> &
  Readonly<{
    primarySourcePolicy?: LearningModule["primarySourcePolicy"];
  }>;

function reviewedModule(input: ReviewedModuleInput): LearningModule {
  return {
    ...input,
    contentVersion: "1",
    reviewStatus: "reviewed",
    reviewedAt,
    primarySourcePolicy: input.primarySourcePolicy ?? "required",
  };
}

export const learningNoteCatalog = [
  {
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
    estimatedMinutes: 34,
    modules: [
      reviewedModule({
        id: "programming-javascript-foundation",
        criterionId: "programming-javascript.foundation",
        level: "foundation",
        title: { en: "Control flow before syntax shortcuts", "pt-BR": "Fluxo de controle antes dos atalhos de sintaxe" },
        estimatedMinutes: 7,
        understand: {
          en: "Promises and async functions do not remove control flow: an operation is started, settles later, and continues through an explicit success or failure path.",
          "pt-BR": "Promises e funções async não eliminam o fluxo de controle: uma operação é iniciada, termina depois e continua por um caminho explícito de sucesso ou falha.",
        },
        example: {
          language: "javascript",
          code: {
            en: "async function load() {\n  try {\n    return await fetchData();\n  } catch (error) {\n    report(error);\n    throw error;\n  }\n}",
            "pt-BR": "async function load() {\n  try {\n    return await fetchData();\n  } catch (error) {\n    report(error);\n    throw error;\n  }\n}",
          },
        },
        commonMistake: {
          en: "Reading await as if it made the whole program synchronous, which hides what can happen before the promise settles.",
          "pt-BR": "Ler await como se ele tornasse o programa inteiro síncrono, ocultando o que pode acontecer antes de a promise terminar.",
        },
        practice: {
          id: "programming-javascript-foundation-practice",
          prompt: {
            en: "Trace one async function and write the exact order of start, suspension, settlement, continuation, and error handling.",
            "pt-BR": "Rastreie uma função async e escreva a ordem exata de início, suspensão, resolução, continuação e tratamento de erro.",
          },
        },
        consolidationCriteria: {
          en: ["Explains when an async function returns a promise.", "Can identify the explicit success and failure paths of a small async flow."],
          "pt-BR": ["Explica quando uma função async retorna uma promise.", "Consegue identificar os caminhos explícitos de sucesso e falha de um fluxo assíncrono pequeno."],
        },
        sourceIds: ["mdn-async-function", "mdn-promise"],
      }),
      reviewedModule({
        id: "programming-javascript-developing",
        criterionId: "programming-javascript.developing",
        level: "developing",
        title: { en: "State transitions and async races", "pt-BR": "Transições de estado e corridas assíncronas" },
        estimatedMinutes: 8,
        understand: {
          en: "Stateful async code needs ownership and ordering rules. When multiple operations can finish out of order, only the result that is still current should commit state.",
          "pt-BR": "Código assíncrono com estado precisa de regras de ownership e ordenação. Quando várias operações podem terminar fora de ordem, apenas o resultado que ainda é atual deve aplicar estado.",
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
          id: "programming-javascript-developing-practice",
          prompt: {
            en: "Refactor a loading/success/error interaction so stale results cannot overwrite the current request and cleanup is explicit.",
            "pt-BR": "Refatore uma interação de loading/sucesso/erro para que resultados obsoletos não sobrescrevam a requisição atual e a limpeza fique explícita.",
          },
        },
        consolidationCriteria: {
          en: ["Can describe the owner of each mutable state transition.", "Can prevent an older async result from overwriting newer state."],
          "pt-BR": ["Consegue descrever o responsável por cada transição de estado mutável.", "Consegue impedir que um resultado assíncrono antigo sobrescreva um estado mais novo."],
        },
        sourceIds: ["mdn-async-function", "mdn-promise"],
      }),
      reviewedModule({
        id: "programming-javascript-proficient",
        criterionId: "programming-javascript.proficient",
        level: "proficient",
        title: { en: "Concurrency with explicit failure boundaries", "pt-BR": "Concorrência com limites explícitos de falha" },
        estimatedMinutes: 9,
        understand: {
          en: "Independent promises may run concurrently, while dependent work must remain sequenced. The chosen combinator also defines how success and failure aggregate.",
          "pt-BR": "Promises independentes podem rodar concorrentemente, enquanto trabalho dependente deve continuar sequenciado. O combinador escolhido também define como sucesso e falha são agregados.",
        },
        example: {
          language: "javascript",
          code: {
            en: "const [profile, permissions] = await Promise.all([\n  loadProfile(),\n  loadPermissions(),\n]);",
            "pt-BR": "const [profile, permissions] = await Promise.all([\n  loadProfile(),\n  loadPermissions(),\n]);",
          },
        },
        commonMistake: {
          en: "Using sequential await for independent operations, or using Promise.all when partial success is a required product behavior.",
          "pt-BR": "Usar await sequencial para operações independentes ou usar Promise.all quando sucesso parcial é um comportamento necessário do produto.",
        },
        practice: {
          id: "programming-javascript-proficient-practice",
          prompt: {
            en: "Classify four async operations as dependent or independent, choose the appropriate execution strategy, and document its failure semantics.",
            "pt-BR": "Classifique quatro operações assíncronas como dependentes ou independentes, escolha a estratégia de execução adequada e documente sua semântica de falha.",
          },
        },
        consolidationCriteria: {
          en: ["Chooses sequential versus concurrent execution from data dependencies.", "Can explain the failure behavior of the chosen promise combinator."],
          "pt-BR": ["Escolhe execução sequencial ou concorrente a partir das dependências de dados.", "Consegue explicar o comportamento de falha do combinador de promises escolhido."],
        },
        sourceIds: ["mdn-promise", "mdn-async-function"],
      }),
      reviewedModule({
        id: "programming-javascript-advanced",
        criterionId: "programming-javascript.advanced",
        level: "advanced",
        title: { en: "Resilient async abstractions", "pt-BR": "Abstrações assíncronas resilientes" },
        estimatedMinutes: 10,
        understand: {
          en: "A reusable async abstraction should expose cancellation, failure, ordering, and ownership semantics rather than hiding them behind a convenient helper.",
          "pt-BR": "Uma abstração assíncrona reutilizável deve expor semânticas de cancelamento, falha, ordenação e ownership em vez de escondê-las atrás de um helper conveniente.",
        },
        commonMistake: {
          en: "Creating a generic retry or queue helper whose API hides whether work is idempotent, cancellable, or safe to repeat.",
          "pt-BR": "Criar um helper genérico de retry ou fila cuja API esconde se o trabalho é idempotente, cancelável ou seguro para repetição.",
        },
        practice: {
          id: "programming-javascript-advanced-practice",
          prompt: {
            en: "Design the contract of a reusable async operation runner and state its cancellation, retry, concurrency, and error-propagation guarantees.",
            "pt-BR": "Projete o contrato de um executor reutilizável de operações assíncronas e declare suas garantias de cancelamento, retry, concorrência e propagação de erros.",
          },
        },
        consolidationCriteria: {
          en: ["Makes concurrency and failure guarantees explicit in an abstraction API.", "Can justify when an abstraction should expose rather than hide lifecycle control."],
          "pt-BR": ["Torna explícitas as garantias de concorrência e falha na API de uma abstração.", "Consegue justificar quando uma abstração deve expor em vez de esconder controle de lifecycle."],
        },
        sourceIds: ["mdn-promise", "mdn-async-function"],
      }),
    ],
  },
  {
    id: "typescript-application-modeling",
    competencyId: "programming-typescript",
    title: { en: "TypeScript application modeling", "pt-BR": "Modelagem de aplicações com TypeScript" },
    summary: {
      en: "Use the type system to represent valid states and make unsafe boundaries explicit.",
      "pt-BR": "Use o sistema de tipos para representar estados válidos e tornar limites inseguros explícitos.",
    },
    objective: {
      en: "Move from annotating JavaScript shapes to designing domain states, narrowing rules, and maintainable typed boundaries.",
      "pt-BR": "Avance de anotar formatos JavaScript para projetar estados de domínio, regras de narrowing e limites tipados sustentáveis.",
    },
    estimatedMinutes: 34,
    modules: [
      reviewedModule({
        id: "programming-typescript-foundation",
        criterionId: "programming-typescript.foundation",
        level: "foundation",
        title: { en: "Narrow before use", "pt-BR": "Faça narrowing antes de usar" },
        estimatedMinutes: 7,
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
          id: "programming-typescript-foundation-practice",
          prompt: {
            en: "Refactor a function that uses assertions on a union so each branch narrows from observable runtime information.",
            "pt-BR": "Refatore uma função que usa assertions em uma union para que cada ramo faça narrowing a partir de informação observável em runtime.",
          },
        },
        consolidationCriteria: {
          en: ["Distinguishes narrowing from type assertion.", "Can write a control-flow check that safely narrows a union."],
          "pt-BR": ["Distingue narrowing de asserção de tipo.", "Consegue escrever uma verificação de fluxo que faz narrowing seguro de uma union."],
        },
        sourceIds: ["typescript-handbook-narrowing"],
      }),
      reviewedModule({
        id: "programming-typescript-developing",
        criterionId: "programming-typescript.developing",
        level: "developing",
        title: { en: "Make impossible states unrepresentable", "pt-BR": "Torne estados impossíveis irrepresentáveis" },
        estimatedMinutes: 8,
        understand: {
          en: "Discriminated unions let each application state carry only the fields valid for that state, reducing contradictory boolean and optional-field combinations.",
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
          id: "programming-typescript-developing-practice",
          prompt: {
            en: "Model loading, empty, success, and error as explicit variants and remove fields that are invalid in each variant.",
            "pt-BR": "Modele loading, vazio, sucesso e erro como variantes explícitas e remova campos inválidos de cada variante.",
          },
        },
        consolidationCriteria: {
          en: ["Can identify an impossible combination allowed by a loose interface.", "Can model application states as discriminated variants with exhaustive handling."],
          "pt-BR": ["Consegue identificar uma combinação impossível permitida por uma interface frouxa.", "Consegue modelar estados da aplicação como variantes discriminadas com tratamento exaustivo."],
        },
        sourceIds: ["typescript-handbook-narrowing"],
      }),
      reviewedModule({
        id: "programming-typescript-proficient",
        criterionId: "programming-typescript.proficient",
        level: "proficient",
        title: { en: "Validate external data at the boundary", "pt-BR": "Valide dados externos na fronteira" },
        estimatedMinutes: 9,
        understand: {
          en: "Static types do not validate network or storage data. Treat untrusted values as unknown, validate them, then expose a trusted typed contract to the rest of the application.",
          "pt-BR": "Tipos estáticos não validam dados de rede ou storage. Trate valores não confiáveis como unknown, valide-os e então exponha um contrato tipado confiável para o restante da aplicação.",
        },
        commonMistake: {
          en: "Casting JSON directly to the desired interface and treating the assertion as runtime validation.",
          "pt-BR": "Fazer cast direto do JSON para a interface desejada e tratar a assertion como validação em runtime.",
        },
        practice: {
          id: "programming-typescript-proficient-practice",
          prompt: {
            en: "Design one external-data boundary that accepts unknown, validates the required shape, and returns a narrow domain type.",
            "pt-BR": "Projete uma fronteira de dados externos que aceite unknown, valide o formato necessário e retorne um tipo de domínio estreito.",
          },
        },
        consolidationCriteria: {
          en: ["Explains why a type assertion cannot validate external data.", "Can separate an untrusted input type from the trusted domain type returned by a boundary."],
          "pt-BR": ["Explica por que uma asserção de tipo não valida dados externos.", "Consegue separar o tipo de entrada não confiável do tipo de domínio confiável retornado por uma fronteira."],
        },
        sourceIds: ["typescript-handbook-narrowing", "typescript-handbook-type-manipulation"],
      }),
      reviewedModule({
        id: "programming-typescript-advanced",
        criterionId: "programming-typescript.advanced",
        level: "advanced",
        title: { en: "Precision without type-system theater", "pt-BR": "Precisão sem teatro de sistema de tipos" },
        estimatedMinutes: 10,
        understand: {
          en: "Advanced type manipulation is valuable when it preserves domain relationships and API ergonomics. Complexity that merely demonstrates type-system cleverness increases maintenance cost.",
          "pt-BR": "Manipulação avançada de tipos é valiosa quando preserva relações do domínio e ergonomia da API. Complexidade que apenas demonstra esperteza no sistema de tipos aumenta o custo de manutenção.",
        },
        commonMistake: {
          en: "Building deeply conditional generic types for a small API when a simpler explicit union would be easier to understand and evolve.",
          "pt-BR": "Construir tipos genéricos profundamente condicionais para uma API pequena quando uma union explícita mais simples seria mais fácil de entender e evoluir.",
        },
        practice: {
          id: "programming-typescript-advanced-practice",
          prompt: {
            en: "Compare two typings for the same reusable API and justify which one better balances precision, inference, error messages, and maintenance.",
            "pt-BR": "Compare duas tipagens para a mesma API reutilizável e justifique qual equilibra melhor precisão, inferência, mensagens de erro e manutenção.",
          },
        },
        consolidationCriteria: {
          en: ["Can state the domain relationship an advanced type preserves.", "Can reject a more precise type design when its maintenance or ergonomics cost is not justified."],
          "pt-BR": ["Consegue declarar a relação de domínio preservada por um tipo avançado.", "Consegue rejeitar um design de tipos mais preciso quando seu custo de manutenção ou ergonomia não se justifica."],
        },
        sourceIds: ["typescript-handbook-type-manipulation", "typescript-handbook-narrowing"],
      }),
    ],
  },
  {
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
    estimatedMinutes: 34,
    modules: [
      reviewedModule({
        id: "testing-behavior-foundation",
        criterionId: "testing-behavior.foundation",
        level: "foundation",
        title: { en: "Assert the contract, not the mechanism", "pt-BR": "Teste o contrato, não o mecanismo" },
        estimatedMinutes: 7,
        primarySourcePolicy: "not-available",
        primarySourceReason: {
          en: "There is no single normative standard for software-test design; this module uses Testing Library's recognized behavior-first guidance as a pedagogical anchor.",
          "pt-BR": "Não há um único padrão normativo para design de testes de software; este módulo usa a orientação reconhecida e orientada a comportamento do Testing Library como âncora pedagógica.",
        },
        understand: {
          en: "A resilient test observes the same meaningful output or interaction contract that a consumer observes, rather than private state or implementation structure.",
          "pt-BR": "Um teste resiliente observa o mesmo resultado relevante ou contrato de interação que um consumidor observa, em vez de estado privado ou estrutura de implementação.",
        },
        commonMistake: {
          en: "Asserting internal state or helper calls when the user-visible result is the real contract.",
          "pt-BR": "Fazer assertions sobre estado interno ou chamadas de helpers quando o resultado visível ao usuário é o contrato real.",
        },
        practice: {
          id: "testing-behavior-foundation-practice",
          prompt: {
            en: "Rewrite one implementation-detail assertion as an assertion on an observable result and name the contract it protects.",
            "pt-BR": "Reescreva uma assertion de detalhe de implementação como uma assertion sobre um resultado observável e nomeie o contrato protegido.",
          },
        },
        consolidationCriteria: {
          en: ["Can state the behavioral contract of a test in one sentence.", "Can distinguish a consumer-visible outcome from an implementation detail."],
          "pt-BR": ["Consegue declarar o contrato comportamental de um teste em uma frase.", "Consegue distinguir um resultado visível ao consumidor de um detalhe de implementação."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      }),
      reviewedModule({
        id: "testing-behavior-developing",
        criterionId: "testing-behavior.developing",
        level: "developing",
        title: { en: "Exercise failure and boundary behavior", "pt-BR": "Exercite falhas e comportamento de fronteira" },
        estimatedMinutes: 8,
        primarySourcePolicy: "not-available",
        primarySourceReason: {
          en: "There is no single normative standard for software-test design; this module uses Testing Library's recognized behavior-first guidance as a pedagogical anchor.",
          "pt-BR": "Não há um único padrão normativo para design de testes de software; este módulo usa a orientação reconhecida e orientada a comportamento do Testing Library como âncora pedagógica.",
        },
        understand: {
          en: "Success-only tests leave important contracts unprotected. Boundaries deserve explicit cases for invalid input, rejected operations, empty data, and recovery behavior.",
          "pt-BR": "Testes apenas de sucesso deixam contratos importantes sem proteção. Fronteiras merecem casos explícitos para entrada inválida, operações rejeitadas, dados vazios e comportamento de recuperação.",
        },
        commonMistake: {
          en: "Adding many happy-path examples while never testing the failure branch that carries the highest product risk.",
          "pt-BR": "Adicionar muitos exemplos de happy path sem testar o ramo de falha que carrega o maior risco do produto.",
        },
        practice: {
          id: "testing-behavior-developing-practice",
          prompt: {
            en: "For one real boundary, add a success, invalid-input, dependency-failure, and recovery case using observable outcomes.",
            "pt-BR": "Para uma fronteira real, adicione casos de sucesso, entrada inválida, falha de dependência e recuperação usando resultados observáveis.",
          },
        },
        consolidationCriteria: {
          en: ["Identifies failure modes from the contract rather than from line coverage.", "Can write a boundary test whose assertion remains valid after an internal refactor."],
          "pt-BR": ["Identifica modos de falha a partir do contrato em vez de line coverage.", "Consegue escrever um teste de fronteira cuja assertion continua válida após um refactor interno."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      }),
      reviewedModule({
        id: "testing-behavior-proficient",
        criterionId: "testing-behavior.proficient",
        level: "proficient",
        title: { en: "Choose the smallest trustworthy boundary", "pt-BR": "Escolha a menor fronteira confiável" },
        estimatedMinutes: 9,
        primarySourcePolicy: "not-available",
        primarySourceReason: {
          en: "There is no single normative standard for software-test design; this module uses Testing Library's recognized behavior-first guidance as a pedagogical anchor.",
          "pt-BR": "Não há um único padrão normativo para design de testes de software; este módulo usa a orientação reconhecida e orientada a comportamento do Testing Library como âncora pedagógica.",
        },
        understand: {
          en: "A strong suite places each contract at the lowest layer that can verify it faithfully, while preserving integration tests for behavior that only exists across boundaries.",
          "pt-BR": "Uma suíte forte coloca cada contrato na camada mais baixa que consegue verificá-lo com fidelidade, preservando testes de integração para comportamentos que só existem entre fronteiras.",
        },
        commonMistake: {
          en: "Mocking every dependency until an integration contract disappears from the test, or testing every detail through a slow end-to-end path.",
          "pt-BR": "Mockar toda dependência até o contrato de integração desaparecer do teste ou testar todo detalhe por um caminho end-to-end lento.",
        },
        practice: {
          id: "testing-behavior-proficient-practice",
          prompt: {
            en: "Take five existing tests, name each protected contract, and move or rewrite any test whose current layer cannot verify that contract faithfully.",
            "pt-BR": "Pegue cinco testes existentes, nomeie o contrato protegido por cada um e mova ou reescreva qualquer teste cuja camada atual não consiga verificar esse contrato com fidelidade.",
          },
        },
        consolidationCriteria: {
          en: ["Can justify the verification layer for a contract.", "Can identify when a mock removes the behavior the test is supposed to verify."],
          "pt-BR": ["Consegue justificar a camada de verificação de um contrato.", "Consegue identificar quando um mock remove o comportamento que o teste deveria verificar."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      }),
      reviewedModule({
        id: "testing-behavior-advanced",
        criterionId: "testing-behavior.advanced",
        level: "advanced",
        title: { en: "Verification architecture by risk", "pt-BR": "Arquitetura de verificação orientada a risco" },
        estimatedMinutes: 10,
        primarySourcePolicy: "not-available",
        primarySourceReason: {
          en: "There is no single normative standard for software-test design; this module uses Testing Library's recognized behavior-first guidance as a pedagogical anchor.",
          "pt-BR": "Não há um único padrão normativo para design de testes de software; este módulo usa a orientação reconhecida e orientada a comportamento do Testing Library como âncora pedagógica.",
        },
        understand: {
          en: "Verification architecture allocates stronger, more expensive checks to higher-risk contracts while keeping fast deterministic feedback close to development.",
          "pt-BR": "A arquitetura de verificação aloca checks mais fortes e caros para contratos de maior risco, mantendo feedback rápido e determinístico próximo do desenvolvimento.",
        },
        commonMistake: {
          en: "Treating test count or coverage percentage as the strategy instead of identifying risk classes, contracts, and failure diagnostics.",
          "pt-BR": "Tratar quantidade de testes ou porcentagem de coverage como a estratégia em vez de identificar classes de risco, contratos e diagnóstico de falhas.",
        },
        practice: {
          id: "testing-behavior-advanced-practice",
          prompt: {
            en: "Create a verification matrix for one feature that maps risk classes to unit, integration, end-to-end, and manual checks with a reason for each.",
            "pt-BR": "Crie uma matriz de verificação para uma feature que mapeie classes de risco para checks unitários, integração, end-to-end e manuais, justificando cada um.",
          },
        },
        consolidationCriteria: {
          en: ["Can connect test-layer investment to explicit product or engineering risk.", "Can design failure diagnostics so a broken contract is localizable rather than merely detected."],
          "pt-BR": ["Consegue conectar investimento em camadas de teste a risco explícito de produto ou engenharia.", "Consegue projetar diagnóstico de falha para que um contrato quebrado seja localizável, não apenas detectado."],
        },
        sourceIds: ["testing-library-guiding-principles"],
      }),
    ],
  },
  {
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
    estimatedMinutes: 34,
    modules: [
      reviewedModule({
        id: "http-api-engineering-foundation",
        criterionId: "http-api-engineering.foundation",
        level: "foundation",
        title: { en: "HTTP semantics are part of the contract", "pt-BR": "Semântica HTTP faz parte do contrato" },
        estimatedMinutes: 7,
        understand: {
          en: "Method, status, headers, and representation each communicate contract meaning. They are not interchangeable decoration around a JSON payload.",
          "pt-BR": "Método, status, headers e representação comunicam significado de contrato. Eles não são decoração intercambiável em volta de um payload JSON.",
        },
        commonMistake: {
          en: "Returning 200 for every outcome and encoding all success or failure semantics only inside an ad-hoc response body.",
          "pt-BR": "Retornar 200 para todo resultado e codificar toda semântica de sucesso ou falha apenas em um body ad hoc.",
        },
        practice: {
          id: "http-api-engineering-foundation-practice",
          prompt: {
            en: "For five endpoint outcomes, choose method/status semantics and explain what a generic HTTP client can infer without domain-specific parsing.",
            "pt-BR": "Para cinco resultados de endpoint, escolha método/status e explique o que um cliente HTTP genérico consegue inferir sem parsing específico de domínio.",
          },
        },
        consolidationCriteria: {
          en: ["Can explain the semantic role of method and status code independently from the body.", "Can distinguish successful, client-error, and server-error response classes."],
          "pt-BR": ["Consegue explicar o papel semântico de método e status code independentemente do body.", "Consegue distinguir classes de resposta de sucesso, erro do cliente e erro do servidor."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      }),
      reviewedModule({
        id: "http-api-engineering-developing",
        criterionId: "http-api-engineering.developing",
        level: "developing",
        title: { en: "Validate inputs and stabilize failures", "pt-BR": "Valide entradas e estabilize falhas" },
        estimatedMinutes: 8,
        understand: {
          en: "An API boundary owns validation and the public failure contract. Internal exceptions should be translated into stable client-facing categories instead of leaking implementation detail.",
          "pt-BR": "Uma fronteira de API é responsável pela validação e pelo contrato público de falhas. Exceções internas devem ser traduzidas em categorias estáveis para o cliente em vez de vazar detalhe de implementação.",
        },
        commonMistake: {
          en: "Letting database or framework error strings become the external API contract.",
          "pt-BR": "Deixar strings de erro do banco ou framework virarem o contrato externo da API.",
        },
        practice: {
          id: "http-api-engineering-developing-practice",
          prompt: {
            en: "Define validation and stable error responses for one endpoint, separating invalid input, missing resource, conflict, and internal failure.",
            "pt-BR": "Defina validação e respostas de erro estáveis para um endpoint, separando entrada inválida, recurso ausente, conflito e falha interna.",
          },
        },
        consolidationCriteria: {
          en: ["Can identify which validation belongs at the transport boundary.", "Can map internal failures to stable external semantics without exposing sensitive implementation details."],
          "pt-BR": ["Consegue identificar qual validação pertence à fronteira de transporte.", "Consegue mapear falhas internas para semântica externa estável sem expor detalhes sensíveis de implementação."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      }),
      reviewedModule({
        id: "http-api-engineering-proficient",
        criterionId: "http-api-engineering.proficient",
        level: "proficient",
        title: { en: "Idempotency, authorization, and retry safety", "pt-BR": "Idempotência, autorização e segurança de retry" },
        estimatedMinutes: 9,
        understand: {
          en: "Retry behavior depends on operation semantics. Robust boundaries also verify authorization for the requested resource rather than treating authentication as sufficient permission.",
          "pt-BR": "O comportamento de retry depende da semântica da operação. Fronteiras robustas também verificam autorização para o recurso solicitado em vez de tratar autenticação como permissão suficiente.",
        },
        commonMistake: {
          en: "Automatically retrying a non-idempotent mutation without an idempotency contract, potentially duplicating side effects.",
          "pt-BR": "Repetir automaticamente uma mutação não idempotente sem contrato de idempotência, potencialmente duplicando efeitos colaterais.",
        },
        practice: {
          id: "http-api-engineering-proficient-practice",
          prompt: {
            en: "Analyze a mutation endpoint for duplicate requests, authorization scope, partial failure, and client retry behavior; define the contract that makes each safe.",
            "pt-BR": "Analise um endpoint de mutação quanto a requisições duplicadas, escopo de autorização, falha parcial e retry do cliente; defina o contrato que torna cada caso seguro.",
          },
        },
        consolidationCriteria: {
          en: ["Can explain whether an operation is safe to retry and why.", "Can separate authentication from resource-level authorization in an API contract."],
          "pt-BR": ["Consegue explicar se uma operação é segura para retry e por quê.", "Consegue separar autenticação de autorização em nível de recurso em um contrato de API."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      }),
      reviewedModule({
        id: "http-api-engineering-advanced",
        criterionId: "http-api-engineering.advanced",
        level: "advanced",
        title: { en: "Evolve contracts under distributed failure", "pt-BR": "Evolua contratos sob falhas distribuídas" },
        estimatedMinutes: 10,
        understand: {
          en: "API evolution must preserve observable contracts while accounting for caches, intermediaries, retries, latency, and clients that upgrade at different times.",
          "pt-BR": "A evolução de APIs deve preservar contratos observáveis considerando caches, intermediários, retries, latência e clientes que atualizam em momentos diferentes.",
        },
        commonMistake: {
          en: "Treating a server deployment as an atomic contract migration for every client and intermediary.",
          "pt-BR": "Tratar um deploy do servidor como uma migração atômica de contrato para todo cliente e intermediário.",
        },
        practice: {
          id: "http-api-engineering-advanced-practice",
          prompt: {
            en: "Plan a backwards-compatible change to a high-traffic endpoint, including observability, rollout, retry behavior, and a rollback condition.",
            "pt-BR": "Planeje uma mudança retrocompatível em um endpoint de alto tráfego, incluindo observabilidade, rollout, comportamento de retry e condição de rollback.",
          },
        },
        consolidationCriteria: {
          en: ["Can distinguish server implementation change from externally observable contract change.", "Can describe a compatibility and rollback strategy that accounts for clients and intermediaries."],
          "pt-BR": ["Consegue distinguir mudança de implementação do servidor de mudança de contrato externamente observável.", "Consegue descrever uma estratégia de compatibilidade e rollback que considere clientes e intermediários."],
        },
        sourceIds: ["rfc-9110-http-semantics"],
      }),
    ],
  },
  {
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
    estimatedMinutes: 30,
    modules: [
      reviewedModule({
        id: "git-collaboration-foundation",
        criterionId: "git-collaboration.foundation",
        level: "foundation",
        title: { en: "Commits as coherent history units", "pt-BR": "Commits como unidades coerentes de histórico" },
        estimatedMinutes: 6,
        understand: {
          en: "A commit records a snapshot plus intent. Focused commits make history inspection, review, and reversal easier than mixed unrelated changes.",
          "pt-BR": "Um commit registra um snapshot com intenção. Commits focados tornam inspeção de histórico, review e reversão mais fáceis do que mudanças não relacionadas misturadas.",
        },
        commonMistake: {
          en: "Using one catch-all commit for formatting, behavior changes, dependency updates, and unrelated fixes.",
          "pt-BR": "Usar um único commit genérico para formatação, mudanças de comportamento, atualização de dependências e correções não relacionadas.",
        },
        practice: {
          id: "git-collaboration-foundation-practice",
          prompt: {
            en: "Split a mixed change set into focused commits and write a message that states the intent of each one.",
            "pt-BR": "Divida um conjunto misturado de mudanças em commits focados e escreva uma mensagem que declare a intenção de cada um.",
          },
        },
        consolidationCriteria: {
          en: ["Can explain what belongs together in one commit.", "Can use history to identify and revert a focused change safely."],
          "pt-BR": ["Consegue explicar o que pertence junto em um commit.", "Consegue usar o histórico para identificar e reverter uma mudança focada com segurança."],
        },
        sourceIds: ["git-commit-reference"],
      }),
      reviewedModule({
        id: "git-collaboration-developing",
        criterionId: "git-collaboration.developing",
        level: "developing",
        title: { en: "Reviewable branches and pull requests", "pt-BR": "Branches e pull requests revisáveis" },
        estimatedMinutes: 7,
        understand: {
          en: "A reviewable branch has a bounded purpose, coherent history, verification evidence, and a clear integration path.",
          "pt-BR": "Uma branch revisável tem propósito limitado, histórico coerente, evidência de verificação e um caminho claro de integração.",
        },
        commonMistake: {
          en: "Keeping unrelated work on a long-lived branch until review requires understanding several features at once.",
          "pt-BR": "Manter trabalho não relacionado em uma branch longa até que o review exija entender várias features de uma vez.",
        },
        practice: {
          id: "git-collaboration-developing-practice",
          prompt: {
            en: "Prepare a small branch with a clear scope, semantic commits, verification evidence, and an explicit rollback note.",
            "pt-BR": "Prepare uma branch pequena com escopo claro, commits semânticos, evidência de verificação e uma nota explícita de rollback.",
          },
        },
        consolidationCriteria: {
          en: ["Can explain the intended integration unit from branch history alone.", "Can state how to isolate or revert the change if integration fails."],
          "pt-BR": ["Consegue explicar a unidade de integração pretendida apenas pelo histórico da branch.", "Consegue declarar como isolar ou reverter a mudança se a integração falhar."],
        },
        sourceIds: ["git-commit-reference", "pro-git-distributed-workflows"],
      }),
      reviewedModule({
        id: "git-collaboration-proficient",
        criterionId: "git-collaboration.proficient",
        level: "proficient",
        title: { en: "Integrate concurrent work deliberately", "pt-BR": "Integre trabalho concorrente deliberadamente" },
        estimatedMinutes: 8,
        understand: {
          en: "Concurrent collaboration needs an integration strategy: contributors prepare bounded changes, an integration owner resolves conflicts with context, and the shared branch remains recoverable.",
          "pt-BR": "Colaboração concorrente precisa de estratégia de integração: contribuidores preparam mudanças limitadas, um responsável integra conflitos com contexto e a branch compartilhada permanece recuperável.",
        },
        commonMistake: {
          en: "Resolving conflicts mechanically without understanding which side owns the intended contract after integration.",
          "pt-BR": "Resolver conflitos mecanicamente sem entender qual lado possui o contrato pretendido após a integração.",
        },
        practice: {
          id: "git-collaboration-proficient-practice",
          prompt: {
            en: "Simulate two conflicting feature branches, resolve the conflict from the intended behavior, and document the verification performed after integration.",
            "pt-BR": "Simule duas branches de feature conflitantes, resolva o conflito a partir do comportamento pretendido e documente a verificação feita após a integração.",
          },
        },
        consolidationCriteria: {
          en: ["Can resolve a conflict from ownership and contract intent rather than text position alone.", "Can preserve traceability and verification after integrating concurrent work."],
          "pt-BR": ["Consegue resolver um conflito a partir de ownership e intenção do contrato, não apenas da posição textual.", "Consegue preservar rastreabilidade e verificação após integrar trabalho concorrente."],
        },
        sourceIds: ["pro-git-distributed-workflows", "git-commit-reference"],
      }),
      reviewedModule({
        id: "git-collaboration-advanced",
        criterionId: "git-collaboration.advanced",
        level: "advanced",
        title: { en: "Design collaboration and recovery conventions", "pt-BR": "Projete convenções de colaboração e recuperação" },
        estimatedMinutes: 9,
        understand: {
          en: "Repository conventions should optimize review, ownership, release safety, and recovery for the team's actual topology rather than copy a branching model by habit.",
          "pt-BR": "Convenções de repositório devem otimizar review, ownership, segurança de release e recuperação para a topologia real do time, em vez de copiar um modelo de branches por hábito.",
        },
        commonMistake: {
          en: "Adopting a complex branching policy without defining who integrates, how releases are cut, or how a bad change is recovered.",
          "pt-BR": "Adotar uma política complexa de branches sem definir quem integra, como releases são cortadas ou como uma mudança ruim é recuperada.",
        },
        practice: {
          id: "git-collaboration-advanced-practice",
          prompt: {
            en: "Design a repository workflow for a multi-contributor team, including ownership, integration, release, rollback, and emergency-fix paths.",
            "pt-BR": "Projete um workflow de repositório para um time com múltiplos contribuidores, incluindo ownership, integração, release, rollback e caminho de hotfix.",
          },
        },
        consolidationCriteria: {
          en: ["Can connect repository workflow choices to team topology and release risk.", "Can describe a recovery path that preserves traceability under production pressure."],
          "pt-BR": ["Consegue conectar escolhas de workflow do repositório à topologia do time e risco de release.", "Consegue descrever um caminho de recuperação que preserve rastreabilidade sob pressão de produção."],
        },
        sourceIds: ["pro-git-distributed-workflows", "git-commit-reference"],
      }),
    ],
  },
  {
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
    estimatedMinutes: 34,
    modules: [
      reviewedModule({
        id: "web-accessibility-foundation",
        criterionId: "web-accessibility.foundation",
        level: "foundation",
        title: { en: "Native semantics first", "pt-BR": "Semântica nativa primeiro" },
        estimatedMinutes: 7,
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
          en: "Using a clickable div for a button action and then trying to recreate focus, keyboard, and semantic behavior manually.",
          "pt-BR": "Usar uma div clicável para uma ação de botão e depois tentar recriar manualmente foco, teclado e semântica.",
        },
        practice: {
          id: "web-accessibility-foundation-practice",
          prompt: {
            en: "Audit five interactive elements and replace any custom primitive whose intent is already represented by a native HTML control.",
            "pt-BR": "Audite cinco elementos interativos e substitua qualquer primitiva customizada cuja intenção já seja representada por um controle HTML nativo.",
          },
        },
        consolidationCriteria: {
          en: ["Can choose a native element from interaction intent.", "Can explain why keyboard access and accessible naming are correctness requirements, not optional enhancements."],
          "pt-BR": ["Consegue escolher um elemento nativo a partir da intenção da interação.", "Consegue explicar por que acesso por teclado e nome acessível são requisitos de correção, não melhorias opcionais."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      }),
      reviewedModule({
        id: "web-accessibility-developing",
        criterionId: "web-accessibility.developing",
        level: "developing",
        title: { en: "Keyboard, focus, and status are one interaction", "pt-BR": "Teclado, foco e status formam uma única interação" },
        estimatedMinutes: 8,
        understand: {
          en: "An interaction is not accessible merely because it can receive focus. Users need a logical focus sequence, visible focus, operable controls, and status changes exposed without relying on color alone.",
          "pt-BR": "Uma interação não é acessível apenas porque recebe foco. Usuários precisam de sequência lógica de foco, foco visível, controles operáveis e mudanças de status expostas sem depender apenas de cor.",
        },
        commonMistake: {
          en: "Adding tabindex to a custom control but leaving activation, focus management, or state communication mouse-only.",
          "pt-BR": "Adicionar tabindex a um controle customizado, mas deixar ativação, gerenciamento de foco ou comunicação de estado exclusivos do mouse.",
        },
        practice: {
          id: "web-accessibility-developing-practice",
          prompt: {
            en: "Complete one dialog or form flow using only the keyboard, correcting focus order, visible focus, labels, and dynamic status communication.",
            "pt-BR": "Complete um fluxo de dialog ou formulário usando apenas o teclado, corrigindo ordem de foco, foco visível, labels e comunicação dinâmica de status.",
          },
        },
        consolidationCriteria: {
          en: ["Can complete the interaction without a pointer and without losing focus context.", "Can communicate state through text or semantics in addition to visual styling."],
          "pt-BR": ["Consegue completar a interação sem ponteiro e sem perder o contexto de foco.", "Consegue comunicar estado por texto ou semântica além do estilo visual."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      }),
      reviewedModule({
        id: "web-accessibility-proficient",
        criterionId: "web-accessibility.proficient",
        level: "proficient",
        title: { en: "Implement complex patterns from their interaction contract", "pt-BR": "Implemente padrões complexos a partir do contrato de interação" },
        estimatedMinutes: 9,
        understand: {
          en: "Complex widgets such as dialogs, tabs, menus, and comboboxes have keyboard and focus contracts. The pattern should be chosen by behavior, then implemented and verified as a whole.",
          "pt-BR": "Widgets complexos como dialogs, tabs, menus e comboboxes têm contratos de teclado e foco. O padrão deve ser escolhido pelo comportamento e então implementado e verificado como um todo.",
        },
        commonMistake: {
          en: "Copying ARIA roles onto custom markup without implementing the keyboard and focus behavior expected by that pattern.",
          "pt-BR": "Copiar roles ARIA para markup customizado sem implementar o comportamento de teclado e foco esperado pelo padrão.",
        },
        practice: {
          id: "web-accessibility-proficient-practice",
          prompt: {
            en: "Choose one complex widget, compare its behavior with the relevant APG pattern, and verify semantics, keyboard commands, focus entry, and focus exit.",
            "pt-BR": "Escolha um widget complexo, compare seu comportamento com o padrão relevante do APG e verifique semântica, comandos de teclado, entrada de foco e saída de foco.",
          },
        },
        consolidationCriteria: {
          en: ["Can derive implementation requirements from a documented interaction pattern.", "Can diagnose a widget where roles are correct but keyboard or focus behavior is not."],
          "pt-BR": ["Consegue derivar requisitos de implementação de um padrão de interação documentado.", "Consegue diagnosticar um widget em que roles estão corretos, mas teclado ou foco não."],
        },
        sourceIds: ["aria-authoring-practices", "wcag-22"],
      }),
      reviewedModule({
        id: "web-accessibility-advanced",
        criterionId: "web-accessibility.advanced",
        level: "advanced",
        title: { en: "Make accessibility a system invariant", "pt-BR": "Torne acessibilidade uma invariante do sistema" },
        estimatedMinutes: 10,
        understand: {
          en: "Accessibility scales when component APIs, design-system primitives, review criteria, and regression checks make the correct behavior the easiest default.",
          "pt-BR": "Acessibilidade escala quando APIs de componentes, primitivas do design system, critérios de review e checks de regressão tornam o comportamento correto o padrão mais fácil.",
        },
        commonMistake: {
          en: "Relying on periodic accessibility audits while reusable components continue to permit unlabeled, keyboard-incomplete, or focus-unsafe variants.",
          "pt-BR": "Depender de auditorias periódicas enquanto componentes reutilizáveis continuam permitindo variantes sem label, incompletas por teclado ou inseguras para foco.",
        },
        practice: {
          id: "web-accessibility-advanced-practice",
          prompt: {
            en: "Choose one design-system primitive and redesign its API, examples, and regression checks so accessible naming, keyboard behavior, and focus rules are difficult to bypass.",
            "pt-BR": "Escolha uma primitiva do design system e redesenhe sua API, exemplos e checks de regressão para que nome acessível, comportamento de teclado e regras de foco sejam difíceis de contornar.",
          },
        },
        consolidationCriteria: {
          en: ["Can encode accessibility expectations into reusable component contracts.", "Can identify which accessibility regressions should be prevented automatically and which still require human verification."],
          "pt-BR": ["Consegue codificar expectativas de acessibilidade em contratos de componentes reutilizáveis.", "Consegue identificar quais regressões de acessibilidade devem ser prevenidas automaticamente e quais ainda exigem verificação humana."],
        },
        sourceIds: ["wcag-22", "aria-authoring-practices"],
      }),
    ],
  },
] as const satisfies readonly LearningNote[];

const noteById = new Map(learningNoteCatalog.map((note) => [note.id, note] as const));
const noteByCompetency = new Map(
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
