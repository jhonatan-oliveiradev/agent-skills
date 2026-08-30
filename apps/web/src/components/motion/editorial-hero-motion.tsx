"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ProceduralLightCanvas } from "./procedural-light-canvas";

type EditorialHeroMotionProps = Readonly<{
  eyebrow: string;
  title: ReactNode;
  summary: string;
  children?: ReactNode;
  visualLabel?: string;
}>;

export function EditorialHeroMotion({ eyebrow, title, summary, children, visualLabel }: EditorialHeroMotionProps) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-line bg-canvas" data-motion={reducedMotion ? "static" : "active"}>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--editorial-line)_35%,transparent)_1px,transparent_1px)] bg-[size:clamp(5rem,8vw,8rem)_100%] opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-[72%] overflow-hidden opacity-90 [mask-image:linear-gradient(to_bottom,transparent,black_24%)]">
        {reducedMotion ? <div className="size-full bg-[radial-gradient(circle_at_52%_75%,color-mix(in_srgb,var(--editorial-accent)_38%,transparent),transparent_52%)]" /> : <ProceduralLightCanvas label={visualLabel} />}
      </div>
      <div className="shell relative z-10 grid min-h-[calc(100svh-4.5rem)] grid-cols-1 content-between gap-16 py-12 md:py-16 lg:grid-cols-12 lg:py-20">
        <motion.p initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0.05 }} className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-accent lg:col-span-12">
          {eyebrow}
        </motion.p>
        <div className="self-center lg:col-span-11">
          <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.12 }} className="max-w-[13ch] text-[clamp(3.5rem,9.5vw,9rem)] font-medium leading-[0.84] tracking-[-0.07em] text-foreground">
            {title}
          </motion.h1>
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.28 }} className="mt-10 grid items-end gap-8 lg:grid-cols-12">
            <p className="max-w-2xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-muted lg:col-span-7">{summary}</p>
            <div className="lg:col-span-5 lg:justify-self-end">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
