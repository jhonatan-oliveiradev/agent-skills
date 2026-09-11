import type { Locale } from "@/lib/locales";
import type { AssessmentBlueprint } from "./assessment";

type LocalizedText = Readonly<{ en: string; "pt-BR": string }>;

type LocalizedCodeExample = Readonly<{
  language: string;
  code: LocalizedText;
}>;

type PedagogyEntry = Readonly<{
  rationale: LocalizedText;
  wrongSummary: LocalizedText;
  optionNotes?: Readonly<Record<string, LocalizedText>>;
  codeExample?: LocalizedCodeExample;
}>;

export type AssessmentLearningFeedback = Readonly<{
  challengeId: string;
  correctOptionIds: readonly string[];
  rationale: string;
  optionExplanations: Readonly<Record<string, string>>;
  codeExample?: Readonly<{ language: string; code: string }>;
}>;

const pedagogy: Readonly<Record<string, PedagogyEntry>> = {
  "baseline-javascript-question": {
    rationale: {
      en: "Interaction state is easiest to reason about when the component that owns the interaction also owns the state lifecycle and its updates.",
      "pt-BR": "O estado de uma interação é mais previsível quando o componente responsável pela interação também controla seu ciclo de vida e suas atualizações.",
    },
    wrongSummary: {
      en: "Global variables, shared singletons, or DOM attributes blur ownership and let unrelated consumers mutate state outside the interaction boundary.",
      "pt-BR": "Variáveis globais, singletons compartilhados ou atributos do DOM confundem a responsabilidade e permitem mutações fora do limite da interação.",
    },
  },
  "baseline-javascript-debugging": {
    rationale: {
      en: "A race is controlled by proving that the request finishing now is still the current request before its result is committed to state.",
      "pt-BR": "Uma condição de corrida é controlada verificando se a requisição que terminou ainda é a requisição atual antes de aplicar seu resultado ao estado.",
    },
    wrongSummary: {
      en: "Longer timeouts, shared result slots, or ignoring completion order do not establish freshness and therefore cannot prevent stale results from winning.",
      "pt-BR": "Timeouts maiores, resultados globais ou ignorar a ordem de conclusão não provam qual requisição é atual e não impedem que um resultado obsoleto vença.",
    },
  },
  "baseline-javascript-multi-select": {
    rationale: {
      en: "Explicit pending, success, and failure states plus deliberate rejection handling make asynchronous transitions visible and keep failure from becoming hidden state.",
      "pt-BR": "Estados explícitos de pendência, sucesso e falha, combinados com tratamento intencional de rejeições, tornam as transições assíncronas visíveis e evitam falhas ocultas.",
    },
    wrongSummary: {
      en: "Duplicating mutable state or discarding rejected promises makes ownership and failure semantics harder to inspect rather than easier to reason about.",
      "pt-BR": "Duplicar estado mutável ou descartar promises rejeitadas torna responsabilidade e semântica de falha mais difíceis de inspecionar, não mais previsíveis.",
    },
  },
  "baseline-javascript-ordering": {
    rationale: {
      en: "A race-safe flow first identifies the request, then starts work, verifies that identifier after completion, and only then commits the result or handled failure.",
      "pt-BR": "Um fluxo seguro contra corrida identifica a requisição, inicia o trabalho, confirma esse identificador após a conclusão e só então aplica o resultado ou a falha tratada.",
    },
    wrongSummary: {
      en: "Changing that sequence allows work to be committed before its freshness is proven, which reintroduces the stale-result race the flow is meant to prevent.",
      "pt-BR": "Alterar essa sequência permite aplicar trabalho antes de provar que ele ainda é atual, reintroduzindo a corrida de resultado obsoleto que o fluxo deveria evitar.",
    },
  },
  "baseline-typescript-question": {
    rationale: {
      en: "Discriminated unions model the exact valid application states, so narrowing the discriminant makes fields from impossible state combinations unavailable to the type system.",
      "pt-BR": "As uniões discriminadas modelam os estados exatos em que a aplicação pode estar; ao estreitar o discriminante, o TypeScript impede combinações de campos que representam estados impossíveis.",
    },
    wrongSummary: {
      en: "Assertions, any, and all-optional objects weaken or bypass type guarantees instead of encoding which state combinations are actually valid.",
      "pt-BR": "Asserções, any e objetos com tudo opcional enfraquecem ou ignoram garantias de tipo em vez de representar quais combinações de estado são realmente válidas.",
    },
    optionNotes: {
      sound: {
        en: "A discriminated union gives every valid state its own shape and lets the discriminant narrow exactly which fields are available.",
        "pt-BR": "Uma união discriminada dá a cada estado válido um formato próprio e permite que o discriminante determine exatamente quais campos existem.",
      },
      unsound: {
        en: "A non-null assertion only tells the compiler to ignore possible null or undefined values; it does not model valid logical states.",
        "pt-BR": "Uma asserção non-null apenas força o compilador a ignorar a possibilidade de null ou undefined; ela não modela estados lógicos válidos.",
      },
      "any-state": {
        en: "Typing the state as any disables the checks that should prevent contradictory combinations, so the type system can no longer protect the state model.",
        "pt-BR": "Tipar o estado como any desliga as verificações que deveriam impedir combinações contraditórias, removendo a proteção do sistema de tipos.",
      },
      "optional-everything": {
        en: "One interface with every field optional permits both incompatible fields and missing required fields, so impossible states remain representable.",
        "pt-BR": "Uma única interface com todos os campos opcionais permite campos incompatíveis ou campos obrigatórios ausentes, mantendo estados impossíveis representáveis.",
      },
    },
    codeExample: {
      language: "typescript",
      code: {
        en: "type State =\n  | { status: \"loading\" }\n  | { status: \"success\"; data: string }\n  | { status: \"error\"; error: Error };",
        "pt-BR": "type Estado =\n  | { status: \"carregando\" }\n  | { status: \"sucesso\"; dados: string }\n  | { status: \"erro\"; erro: Error };",
      },
    },
  },
  "baseline-typescript-debugging": {
    rationale: {
      en: "Unknown external data must be validated or narrowed at the boundary before nested fields are treated as trustworthy typed values.",
      "pt-BR": "Dados externos tipados como unknown precisam ser validados ou estreitados no limite de entrada antes que campos internos sejam tratados como valores confiáveis.",
    },
    wrongSummary: {
      en: "Casting, disabling strictness, or adding non-null assertions changes what the compiler assumes but does not prove the runtime payload has the required shape.",
      "pt-BR": "Fazer cast, desativar strict ou adicionar non-null muda apenas o que o compilador assume; nenhuma dessas opções prova o formato real do payload em runtime.",
    },
  },
  "baseline-typescript-multi-select": {
    rationale: {
      en: "Treating untrusted input as unknown and handling discriminated variants exhaustively preserve both runtime honesty and compile-time coverage at the boundary.",
      "pt-BR": "Tratar entrada não confiável como unknown e cobrir variantes discriminadas de forma exaustiva preserva honestidade em runtime e cobertura em tempo de compilação.",
    },
    wrongSummary: {
      en: "Any and unchecked type assertions skip the proof step, so downstream code receives confidence that the runtime value has not actually earned.",
      "pt-BR": "Any e asserções de tipo sem validação pulam a etapa de prova e fazem o código posterior confiar em um valor que não foi realmente verificado.",
    },
  },
  "baseline-typescript-ordering": {
    rationale: {
      en: "Safe external-data handling receives the value as unknown, validates its shape, narrows the relevant variant, and only then consumes typed fields.",
      "pt-BR": "O consumo seguro de dados externos recebe o valor como unknown, valida seu formato, estreita a variante relevante e só depois utiliza campos tipados.",
    },
    wrongSummary: {
      en: "Using or narrowing fields before runtime validation assumes facts about untrusted input and moves unsoundness past the boundary instead of containing it there.",
      "pt-BR": "Usar ou estreitar campos antes da validação em runtime pressupõe fatos sobre uma entrada não confiável e espalha a insegurança para além do limite.",
    },
  },
  "baseline-web-platform-question": {
    rationale: {
      en: "A native button already carries action semantics, keyboard activation, focus behavior, and accessibility expectations that browsers and assistive technology understand.",
      "pt-BR": "Um button nativo já oferece semântica de ação, ativação por teclado, foco e expectativas de acessibilidade compreendidas pelo navegador e por tecnologias assistivas.",
    },
    wrongSummary: {
      en: "Clickable divs, spans, and styled paragraphs require developers to rebuild semantics and keyboard behavior that the native element provides by default.",
      "pt-BR": "Divs, spans e parágrafos clicáveis exigem reconstruir manualmente semântica e comportamento de teclado que o elemento nativo já oferece.",
    },
  },
  "baseline-web-platform-debugging": {
    rationale: {
      en: "Replacing the clickable div with a native button fixes the interaction at the semantic primitive, restoring keyboard activation and expected focus behavior together.",
      "pt-BR": "Trocar a div clicável por um button nativo corrige a interação na primitiva semântica, restaurando de uma vez a ativação por teclado e o comportamento esperado de foco.",
    },
    wrongSummary: {
      en: "Adding isolated key or tabindex patches leaves an imitation control that still needs the rest of the native button contract to be reimplemented and maintained.",
      "pt-BR": "Adicionar apenas handlers de teclado ou tabindex mantém um controle imitado que ainda exige reimplementar e manter o restante do contrato de um button nativo.",
    },
  },
  "baseline-web-platform-multi-select": {
    rationale: {
      en: "Visible labels and native form submission semantics establish a resilient baseline that works before optional client-side enhancement is added.",
      "pt-BR": "Labels visíveis e a semântica nativa de formulário e submit estabelecem uma base resiliente que funciona antes de qualquer aprimoramento opcional no cliente.",
    },
    wrongSummary: {
      en: "Click-only submission and removed focus indicators discard browser-native affordances and make the form more fragile for keyboard and assistive-technology users.",
      "pt-BR": "Envio disponível apenas por clique e remoção de indicadores de foco descartam affordances nativas e tornam o formulário mais frágil para teclado e tecnologias assistivas.",
    },
  },
  "baseline-web-platform-ordering": {
    rationale: {
      en: "Progressive enhancement starts with valid semantic HTML, adds optional client behavior, handles lifecycle failures, and then verifies keyboard, focus, and fallback behavior.",
      "pt-BR": "Progressive enhancement começa com HTML semântico funcional, adiciona comportamento opcional no cliente, trata falhas de ciclo de vida e então verifica teclado, foco e fallback.",
    },
    wrongSummary: {
      en: "Enhancing before a valid semantic baseline or skipping failure and accessibility verification turns an optional layer into a single point of failure.",
      "pt-BR": "Aprimorar antes de uma base semântica válida ou pular verificação de falhas e acessibilidade transforma uma camada opcional em ponto único de falha.",
    },
  },
  "baseline-testing-question": {
    rationale: {
      en: "A test protects behavior best when it asserts a public outcome that users or consumers can observe, rather than incidental implementation details.",
      "pt-BR": "Um teste protege melhor o comportamento quando valida um resultado público observável por usuários ou consumidores, em vez de detalhes incidentais de implementação.",
    },
    wrongSummary: {
      en: "Private helper calls, line counts, and incidental internal state couple the test to implementation choices that can change without altering behavior.",
      "pt-BR": "Chamadas privadas, contagem de linhas e estado interno incidental acoplam o teste a escolhas de implementação que podem mudar sem alterar o comportamento.",
    },
  },
  "baseline-testing-debugging": {
    rationale: {
      en: "Waiting for the observable completion condition synchronizes the test with behavior, removing arbitrary timing assumptions that cause flaky async assertions.",
      "pt-BR": "Aguardar a condição observável de conclusão sincroniza o teste com o comportamento e remove suposições arbitrárias de tempo que geram instabilidade assíncrona.",
    },
    wrongSummary: {
      en: "Longer sleeps, random retries, or deleting the assertion hide nondeterminism instead of proving when the behavior is actually complete.",
      "pt-BR": "Esperas maiores, retries aleatórios ou remover a asserção apenas escondem a não determinismo em vez de provar quando o comportamento realmente terminou.",
    },
  },
  "baseline-testing-multi-select": {
    rationale: {
      en: "A useful regression test first fails for the original defect and then asserts the repaired behavior at a meaningful public or contract boundary.",
      "pt-BR": "Um bom teste de regressão primeiro falha para o defeito original e depois valida o comportamento corrigido em um limite público ou contratual significativo.",
    },
    wrongSummary: {
      en: "Mocking every private helper or snapshotting unrelated output adds coupling and noise without proving that the original defect cannot return.",
      "pt-BR": "Mockar todo helper privado ou criar snapshots de saída não relacionada adiciona acoplamento e ruído sem provar que o defeito original não pode voltar.",
    },
  },
  "baseline-testing-ordering": {
    rationale: {
      en: "The regression loop encodes the reported behavior, confirms the focused test fails, applies the smallest fix, and then verifies the focused and surrounding suite are green.",
      "pt-BR": "O ciclo de regressão codifica o comportamento reportado, confirma a falha RED, aplica a menor correção e depois verifica GREEN no teste focado e na suíte relacionada.",
    },
    wrongSummary: {
      en: "Changing the order removes causal evidence: a fix written before a reproduced failure cannot prove that the test actually guards the original defect.",
      "pt-BR": "Trocar a ordem remove evidência causal: uma correção feita antes de reproduzir a falha não prova que o teste realmente protege contra o defeito original.",
    },
  },
  "baseline-http-api-question": {
    rationale: {
      en: "A malformed client request belongs to the 4xx client-error contract, and a clear 400 response communicates that the request itself must be corrected.",
      "pt-BR": "Uma requisição malformada pertence ao contrato de erro 4xx; uma resposta 400 clara comunica que o próprio request precisa ser corrigido.",
    },
    wrongSummary: {
      en: "Returning success, an unrelated redirect, or a generic server error misclassifies the failure and makes clients reason about the wrong recovery behavior.",
      "pt-BR": "Retornar sucesso, redirecionamento sem relação ou erro genérico de servidor classifica a falha incorretamente e induz o cliente a uma estratégia de recuperação errada.",
    },
  },
  "baseline-http-api-debugging": {
    rationale: {
      en: "Retryable creation needs an idempotency boundary so repeated equivalent requests can be recognized without creating duplicate persistent effects.",
      "pt-BR": "Criações sujeitas a retry precisam de um limite de idempotência para reconhecer requisições equivalentes repetidas sem gerar efeitos persistentes duplicados.",
    },
    wrongSummary: {
      en: "Hiding duplicates in the UI, returning early success, or suppressing client errors does not protect the persistence boundary where duplication actually occurs.",
      "pt-BR": "Ocultar duplicados na UI, retornar sucesso antecipado ou suprimir erros no cliente não protege o limite de persistência onde a duplicação realmente acontece.",
    },
  },
  "baseline-http-api-multi-select": {
    rationale: {
      en: "A robust request boundary validates client-controlled input and enforces authorization before protected effects can reach application state or persistence.",
      "pt-BR": "Um limite robusto de requisição valida entradas controladas pelo cliente e aplica autorização antes que efeitos protegidos alcancem estado ou persistência.",
    },
    wrongSummary: {
      en: "Trusting client roles or encoding failures as successful responses weakens the server boundary and hides whether protected operations were actually allowed.",
      "pt-BR": "Confiar em papéis enviados pelo cliente ou representar falhas como sucesso enfraquece o limite do servidor e oculta se operações protegidas eram realmente permitidas.",
    },
  },
  "baseline-http-api-ordering": {
    rationale: {
      en: "A protected mutation should parse and validate input, authenticate and authorize, perform the integrity-protected mutation, and then return an explicit response contract.",
      "pt-BR": "Uma mutação protegida deve interpretar e validar a entrada, autenticar e autorizar, executar a mutação com integridade e então retornar um contrato de resposta explícito.",
    },
    wrongSummary: {
      en: "Mutating before validation or authorization lets untrusted or unauthorized intent cross the safety boundary before the server has established permission and shape.",
      "pt-BR": "Mutar antes de validar ou autorizar permite que intenção não confiável ou não autorizada atravesse o limite de segurança antes de o servidor provar forma e permissão.",
    },
  },
  "baseline-git-question": {
    rationale: {
      en: "A focused coherent commit gives reviewers one understandable intent, a bounded diff, and a history entry that can be inspected or reverted independently.",
      "pt-BR": "Um commit focado e coerente oferece ao revisor uma intenção compreensível, um diff limitado e um registro de histórico que pode ser inspecionado ou revertido isoladamente.",
    },
    wrongSummary: {
      en: "Bulk unrelated changes, repository-wide formatting, and opaque messages increase review noise and make it harder to understand why each line changed.",
      "pt-BR": "Mudanças em massa sem relação, formatação global e mensagens opacas aumentam o ruído de revisão e dificultam entender por que cada linha mudou.",
    },
  },
  "baseline-git-debugging": {
    rationale: {
      en: "A conflict between intentional changes must be resolved by understanding both intents first, because the correct result may preserve or combine parts of each branch.",
      "pt-BR": "Um conflito entre mudanças intencionais deve começar pela compreensão das duas intenções, pois a resolução correta pode preservar ou combinar partes de cada branch.",
    },
    wrongSummary: {
      en: "Blindly accepting ours or theirs, or deleting the file, discards information before the conflicting intentions have been understood and reconciled.",
      "pt-BR": "Aceitar cegamente ours ou theirs, ou excluir o arquivo, descarta informação antes que as intenções conflitantes sejam compreendidas e reconciliadas.",
    },
  },
  "baseline-git-multi-select": {
    rationale: {
      en: "Separating unrelated concerns and explaining intent plus verification create reviewable changes and a collaboration history that future contributors can understand.",
      "pt-BR": "Separar assuntos não relacionados e explicar intenção e verificação produz mudanças revisáveis e um histórico de colaboração compreensível para futuros contribuidores.",
    },
    wrongSummary: {
      en: "Uncoordinated force pushes and generated noise erase or obscure collaboration context instead of making the history easier to review and trust.",
      "pt-BR": "Force-push sem coordenação e ruído gerado apagam ou escondem contexto de colaboração em vez de tornar o histórico mais fácil de revisar e confiar.",
    },
  },
  "baseline-git-ordering": {
    rationale: {
      en: "A safe update flow fetches current refs, integrates intentionally, inspects the resulting diff and history, and verifies the branch before it is pushed to collaborators.",
      "pt-BR": "Um fluxo seguro busca refs atuais, integra de forma intencional, inspeciona diff e histórico resultantes e verifica a branch antes de enviá-la aos colaboradores.",
    },
    wrongSummary: {
      en: "Pushing before integration, inspection, or verification risks publishing stale history, unresolved intent, or regressions that could have been caught locally.",
      "pt-BR": "Enviar antes de integrar, inspecionar ou verificar arrisca publicar histórico obsoleto, intenção não resolvida ou regressões que poderiam ter sido detectadas localmente.",
    },
  },
};

function defaultCorrectExplanation(locale: Locale, rationale: string): string {
  return locale === "pt-BR"
    ? `Esta alternativa faz parte do gabarito porque expressa o princípio avaliado. ${rationale}`
    : `This option is part of the answer key because it expresses the principle being assessed. ${rationale}`;
}

function defaultWrongExplanation(locale: Locale, wrongSummary: string): string {
  return locale === "pt-BR"
    ? `Esta alternativa não faz parte do gabarito. ${wrongSummary}`
    : `This option is not part of the answer key. ${wrongSummary}`;
}

export function getAssessmentLearningFeedbackForLocale(
  blueprint: AssessmentBlueprint,
  locale: Locale,
): readonly AssessmentLearningFeedback[] {
  return blueprint.challenges.map((challenge) => {
    const entry = pedagogy[challenge.id];
    const rationale =
      entry?.rationale[locale] ??
      (locale === "pt-BR"
        ? "A resposta correta preserva o limite e o comportamento explicitamente avaliados neste desafio."
        : "The correct answer preserves the boundary and behavior explicitly assessed by this challenge.");
    const wrongSummary =
      entry?.wrongSummary[locale] ??
      (locale === "pt-BR"
        ? "As alternativas incorretas não satisfazem o limite técnico exigido pelo desafio."
        : "The incorrect options do not satisfy the technical boundary required by the challenge.");
    const correct = new Set(challenge.correctOptionIds);

    return {
      challengeId: challenge.id,
      correctOptionIds: challenge.correctOptionIds,
      rationale,
      optionExplanations: Object.fromEntries(
        challenge.options.map((option) => [
          option.id,
          entry?.optionNotes?.[option.id]?.[locale] ??
            (correct.has(option.id)
              ? defaultCorrectExplanation(locale, rationale)
              : defaultWrongExplanation(locale, wrongSummary)),
        ]),
      ),
      ...(entry?.codeExample
        ? {
            codeExample: {
              language: entry.codeExample.language,
              code: entry.codeExample.code[locale],
            },
          }
        : {}),
    };
  });
}
