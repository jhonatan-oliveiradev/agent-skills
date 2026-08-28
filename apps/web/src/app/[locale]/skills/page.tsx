import type { Metadata } from "next";
import {
  createFoundationMetadata,
  FoundationRoute,
  resolveLocale,
} from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "skills");
}

export default async function SkillsPage({ params }: PageProps) {
  return <FoundationRoute locale={await resolveLocale(params)} section="skills" />;
}
