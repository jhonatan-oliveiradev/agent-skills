"use client";

import { useId, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { messages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

const subscribe = () => () => {};

export function ThemeSwitcher({ locale }: Readonly<{ locale: Locale }>) {
  const id = useId();
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const themeMessages = messages[locale].theme;

  return (
    <label htmlFor={id}>
      {themeMessages.label}
      <select
        id={id}
        onChange={(event) => setTheme(event.target.value)}
        value={mounted ? (theme ?? "system") : "system"}
      >
        <option value="system">{themeMessages.system}</option>
        <option value="light">{themeMessages.light}</option>
        <option value="dark">{themeMessages.dark}</option>
      </select>
    </label>
  );
}
