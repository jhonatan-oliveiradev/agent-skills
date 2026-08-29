"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { messages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export type ThemeTransitionVariant = "rectangle";
export type ThemeTransitionStart =
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left";

type ThemeTransitionToggleProps = Readonly<{
  blur?: boolean;
  className?: string;
  locale: Locale;
  start?: ThemeTransitionStart;
  variant?: ThemeTransitionVariant;
}>;

export function ThemeTransitionToggle({
  blur = false,
  className,
  locale,
  start = "bottom-up",
  variant = "rectangle",
}: ThemeTransitionToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const copy = messages[locale].theme;
  const actionLabel = isDark ? copy.switchToLight : copy.switchToDark;

  function toggleTheme() {
    const applyTheme = () => setTheme(nextTheme);

    if (reducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    document.documentElement.dataset.themeTransitionVariant = variant;
    document.documentElement.dataset.themeTransition = start;
    document.documentElement.dataset.themeTransitionBlur = String(blur);
    document.startViewTransition(applyTheme);
  }

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <button
      aria-label={actionLabel}
      aria-pressed={isDark}
      className={cn(
        "grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface p-1.5 text-foreground",
        "transition-[transform,background-color,border-color,color] duration-200 ease-editorial",
        "hover:-translate-y-0.5 hover:border-foreground/45 active:translate-y-0 active:scale-95",
        "motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
      onClick={toggleTheme}
      title={actionLabel}
      type="button"
    >
      <svg aria-hidden="true" fill="none" viewBox="0 0 240 240">
        <motion.g animate={{ rotate: isDark ? -180 : 0 }} transition={transition}>
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="currentColor"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="var(--editorial-canvas)"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="currentColor"
          transition={transition}
        />
      </svg>
    </button>
  );
}
