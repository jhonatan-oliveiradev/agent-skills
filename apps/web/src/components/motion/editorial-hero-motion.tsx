"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DarkVeil } from "./dark-veil";

type EditorialHeroMotionProps = Readonly<{
  eyebrow: string;
  title: ReactNode;
  summary: string;
  children?: ReactNode;
  engine: ReactNode;
}>;

export function EditorialHeroMotion({ eyebrow, title, summary, children, engine }: EditorialHeroMotionProps) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-line bg-canvas"
      data-layout="manifesto-dominant"
      data-motion={reducedMotion ? "static" : "active"}
    >
      <DarkVeil />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--editorial-line)_18%,transparent)_1px,transparent_1px)] bg-[size:clamp(5rem,8vw,8rem)_100%] opacity-[0.14] dark:opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--editorial-canvas)_0%,color-mix(in_srgb,var(--editorial-canvas)_96%,transparent)_16%,color-mix(in_srgb,var(--editorial-canvas)_82%,transparent)_34%,color-mix(in_srgb,var(--editorial-canvas)_22%,transparent)_62%,transparent_84%)] opacity-90 dark:opacity-80"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4.5rem)] w-[calc(100%_-_2rem)] max-w-[92rem] grid-cols-1 items-center gap-y-14 py-20 sm:w-[calc(100%_-_3rem)] sm:py-24 lg:w-[calc(100%_-_4rem)] lg:grid-cols-12 lg:gap-x-[clamp(4rem,7vw,7.5rem)] lg:py-24 xl:gap-x-[clamp(5rem,7vw,8rem)]">
        <div className="self-center lg:col-span-7 lg:pr-2" data-hero-copy="true">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 0.05 }}
            className="mb-9 font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-accent lg:mb-11"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.12 }}
            className="max-w-[15ch] text-balance text-[clamp(3.2rem,14vw,4.4rem)] font-medium leading-[0.92] tracking-[-0.065em] text-foreground sm:text-[clamp(4.1rem,10vw,5.6rem)] lg:text-[clamp(4.75rem,6.2vw,7.5rem)]"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.28 }}
            className="mt-10 lg:mt-12"
          >
            <p className="max-w-[38rem] text-[clamp(1rem,1.2vw,1.18rem)] leading-relaxed text-muted">{summary}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="self-center lg:col-span-5 lg:translate-x-3 xl:translate-x-6"
          data-hero-engine="true"
        >
          {engine}
        </motion.div>
      </div>
    </section>
  );
}
