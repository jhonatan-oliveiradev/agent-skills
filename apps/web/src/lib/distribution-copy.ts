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

export const packDistributionCopy = {
  en: {
    bundleLabel: "PACK BUNDLE",
    bundleSummary: "Every method in this pack, bundled as an independent Skill ZIP.",
    bundleDownload: "Download pack bundle",
    bundleNote: "For ChatGPT, extract the bundle and upload each Skill ZIP separately.",
  },
  "pt-BR": {
    bundleLabel: "PACOTE DO PACK",
    bundleSummary: "Todos os métodos deste pack, reunidos como ZIPs de skills independentes.",
    bundleDownload: "Baixar pacote",
    bundleNote: "No ChatGPT, extraia o pacote e envie cada ZIP de skill separadamente.",
  },
} as const satisfies Readonly<
  Record<
    Locale,
    Readonly<{
      bundleLabel: string;
      bundleSummary: string;
      bundleDownload: string;
      bundleNote: string;
    }>
  >
>;
