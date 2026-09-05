import type { ReactNode } from "react";
import { resolveLocale } from "@/components/foundation-route";
import { CareerLabShell } from "@/components/career/career-lab-shell";
import { CareerProfileProvider } from "@/components/career/career-profile-provider";
import "@/styles/career-lab.css";
import "@/styles/career-lab-shell.css";

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function CareerLabLayout({ children, params }: LayoutProps) {
  const locale = await resolveLocale(params);

  return (
    <CareerProfileProvider>
      <CareerLabShell locale={locale}>{children}</CareerLabShell>
    </CareerProfileProvider>
  );
}
