import type { Locale } from "./locales";

type GlobalStateCopy = Readonly<{
  loading: Readonly<{
    status: string;
    title: string;
    summary: string;
  }>;
  error: Readonly<{
    status: string;
    title: string;
    summary: string;
    retry: string;
    skills: string;
  }>;
  notFound: Readonly<{
    status: string;
    title: string;
    summary: string;
    skills: string;
    home: string;
  }>;
}>;

export const globalStateCopy: Readonly<Record<Locale, GlobalStateCopy>> = {
  en: {
    loading: {
      status: "STATE / LOADING",
      title: "Preparing the next view.",
      summary: "The Studio is resolving the requested route and its catalog-backed content.",
    },
    error: {
      status: "STATE / REQUEST ERROR",
      title: "This view could not be completed.",
      summary: "An unexpected request stopped this view before it could finish. Retry it, or return to the method library.",
      retry: "Retry this view",
      skills: "Explore skills",
    },
    notFound: {
      status: "404 / ROUTE NOT FOUND",
      title: "This route is not in the Studio.",
      summary: "The address does not match a published Studio page. Use the method library or return to the Studio home.",
      skills: "Explore skills",
      home: "Studio home",
    },
  },
  "pt-BR": {
    loading: {
      status: "ESTADO / CARREGANDO",
      title: "Preparando a próxima visualização.",
      summary: "O Studio está resolvendo a rota solicitada e o conteúdo derivado do catálogo.",
    },
    error: {
      status: "ESTADO / ERRO DE REQUISIÇÃO",
      title: "Não foi possível concluir esta visualização.",
      summary: "Uma requisição inesperada interrompeu esta visualização antes da conclusão. Tente novamente ou volte à biblioteca de métodos.",
      retry: "Tentar novamente",
      skills: "Explorar skills",
    },
    notFound: {
      status: "404 / ROTA NÃO ENCONTRADA",
      title: "Esta rota não existe no Studio.",
      summary: "O endereço não corresponde a uma página publicada do Studio. Use a biblioteca de métodos ou volte ao início.",
      skills: "Explorar skills",
      home: "Início do Studio",
    },
  },
};
