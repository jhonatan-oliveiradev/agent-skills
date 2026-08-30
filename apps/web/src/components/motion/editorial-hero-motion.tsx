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
    <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-line bg-canvas lg:min-h-[clamp(52rem,100svh,68rem)]" data-layout="expanded" data-motion={reducedMotion ? "static" : "active"}>
      <DarkVeil />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--editorial-line)_20%,transparent)_1px,transparent_1px)] bg-[size:clamp(5rem,8vw,8rem)_100%] opacity-25" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--editorial-canvas)_0%,color-mix(in_srgb,var(--editorial-canvas)_88%,transparent)_36%,color-mix(in_srgb,var(--editorial-canvas)_32%,transparent)_72%,var(--editorial-canvas)_100%)] opacity-80" />
      <div className="shell relative z-10 grid min-h-[calc(100svh-4.5rem)] grid-cols-1 content-center gap-x-12 gap-y-12 py-20 sm:py-24 lg:min-h-[clamp(52rem,100svh,68rem)] lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14 lg:py-28 xl:max-w-[92rem] xl:gap-x-20">
        <motion.p initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0.05 }} className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-accent lg:col-span-12">
          {eyebrow}
        </motion.p>
        <div className="self-center lg:col-span-5 xl:col-span-5">
          <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.12 }} className="max-w-[12ch] text-[clamp(3.75rem,5.8vw,6.75rem)] font-medium leading-[0.88] tracking-[-0.07em] text-foreground">
            {title}
          </motion.h1>
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.28 }} className="mt-10">
            <p className="max-w-xl text-[clamp(1rem,1.35vw,1.2rem)] leading-relaxed text-muted">{summary}</p>
            <div className="mt-7">{children}</div>
          </motion.div>
        </div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ ...transition, delay: 0.2 }} className="self-center lg:col-span-7 lg:pl-2 xl:pl-6">{engine}</motion.div>
      </div>
    </section>
  );
}
