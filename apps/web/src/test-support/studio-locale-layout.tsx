import type { ReactNode } from "react";
import LocaleLayout, { metadata } from "../app/[locale]/layout";
import StudioLayout from "../app/[locale]/(studio)/layout";

export { metadata };

export default async function StudioLocaleLayoutHarness({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const studio = await StudioLayout({ children, params });
  return LocaleLayout({ children: studio, params });
}
