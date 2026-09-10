import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resolveLocale } from "@/components/foundation-route";
import { CareerGuidanceProvider } from "@/components/career/career-guidance-provider";
import { CareerLabShell } from "@/components/career/career-lab-shell";
import { CareerProfileProvider } from "@/components/career/career-profile-provider";
import "@/styles/career-lab.css";
import "@/styles/career-learning-evidence.css";
import "@/styles/career-market.css";
import "@/styles/career-convergence.css";
import "@/styles/career-shell-separation.css";
import "@/styles/career-guidance.css";
import "@/styles/career-overview.css";

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

type MetadataProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const metadataCopy = {
  en: {
    title: "Career Lab",
    description:
      "A local-first developer career workspace for evidence-aware baselines, adaptive roadmaps, portfolio evidence, and market signals stored in your browser.",
  },
  "pt-BR": {
    title: "Career Lab",
    description:
      "Um workspace local de carreira para devs com baseline orientado por evidências, roadmap adaptativo, portfólio e sinais de mercado armazenados no navegador.",
  },
} as const;

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = metadataCopy[locale];
  const path = `/${locale}/career-lab`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/career-lab",
        "pt-BR": "/pt-BR/career-lab",
        "x-default": "/en/career-lab",
      },
    },
    openGraph: {
      type: "website",
      title: copy.title,
      description: copy.description,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function CareerLabLayout({ children, params }: LayoutProps) {
  const locale = await resolveLocale(params);

  return (
    <CareerProfileProvider>
      <CareerGuidanceProvider>
        <CareerLabShell locale={locale}>{children}</CareerLabShell>
      </CareerGuidanceProvider>
    </CareerProfileProvider>
  );
}
