import type { Locale } from "./locales";

export const skillDistributionCopy = {
  en: {
    chatgptLabel: "ChatGPT",
    chatgptDownload: "Download Skill ZIP",
  },
  "pt-BR": {
    chatgptLabel: "ChatGPT",
    chatgptDownload: "Baixar ZIP da skill",
  },
} as const satisfies Readonly<
  Record<Locale, Readonly<{ chatgptLabel: string; chatgptDownload: string }>>
>;
