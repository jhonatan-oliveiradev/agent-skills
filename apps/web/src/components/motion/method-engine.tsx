"use client";

import { motion, useReducedMotion } from "motion/react";

export type MethodEngineCopy = Readonly<{
  label: string;
  promptLabel: string;
  prompt: string;
  stages: readonly [string, string, string];
  resultLabel: string;
  result: string;
}>;

type MethodEngineProps = Readonly<{
  copy: MethodEngineCopy;
  metrics: readonly string[];
}>;

const skills = [
  "designing-ui-systems",
  "building-premium-nextjs-interfaces",
  "craft-premium-motion",
] as const;

export function MethodEngine({ copy, metrics }: MethodEngineProps) {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 14 };
  const transition = (delay: number) => ({ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const });

  return (
    <section
      aria-label={copy.label}
      className="relative isolate overflow-hidden border border-line bg-surface/95 shadow-[0_1.5rem_6rem_color-mix(in_srgb,var(--editorial-accent)_12%,transparent)]"
      data-motion={reducedMotion ? "static" : "active"}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--editorial-line)_30%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--editorial-line)_24%,transparent)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40" />
      <span aria-hidden="true" className="absolute left-0 top-0 size-3 border-l border-t border-accent" />
      <span aria-hidden="true" className="absolute right-0 top-0 size-3 border-r border-t border-accent" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 size-3 border-b border-l border-accent" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 size-3 border-b border-r border-accent" />

      <div className="relative border-b border-line px-5 py-4 sm:px-7 sm:py-5 xl:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em]">
          <span className="text-accent">AS / METHOD 01</span>
          <span className="flex items-center gap-2 text-muted"><span aria-hidden="true" className="size-1.5 rounded-full bg-success shadow-[0_0_1rem_var(--editorial-success)]" />{copy.label}</span>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.68rem] font-medium text-muted">
          {metrics.map((metric) => <li key={metric}>{metric}</li>)}
        </ul>
      </div>

      <div className="relative p-5 sm:p-7 xl:p-8">
        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition(0.1)} className="border-l-2 border-accent bg-canvas/75 px-4 py-4 sm:px-5">
          <p className="m-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">01 / {copy.promptLabel}</p>
          <p className="mt-3 max-w-[48ch] text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-foreground">“{copy.prompt}”</p>
        </motion.div>

        <div className="relative my-7 grid grid-cols-3 gap-3 sm:my-8">
          <div aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-3.5 h-px bg-line" />
          <motion.div aria-hidden="true" initial={reducedMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={transition(0.28)} className="absolute left-[16.66%] right-[16.66%] top-3.5 h-px origin-left bg-accent" />
          {copy.stages.map((stage, index) => (
            <motion.div key={stage} initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition(0.22 + index * 0.12)} className="relative z-10 text-center">
              <span aria-hidden="true" className="mx-auto grid size-7 place-items-center border border-accent bg-surface font-mono text-[0.6rem] text-accent">0{index + 1}</span>
              <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted">{stage}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          {skills.map((skill, index) => (
            <motion.div key={skill} initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition(0.42 + index * 0.1)} className="group flex items-center gap-3 border-y border-line/70 bg-canvas/55 px-4 py-3 transition-[border-color,transform] duration-300 ease-editorial hover:translate-x-1 hover:border-accent">
              <span className="font-mono text-[0.58rem] text-accent">0{index + 1}</span>
              <span className="min-w-0 font-mono text-[0.68rem] leading-relaxed text-foreground sm:text-[0.72rem]">{skill}</span>
              <span aria-hidden="true" className="ml-auto h-px w-6 bg-line transition-[width,background-color] duration-300 group-hover:w-10 group-hover:bg-accent" />
            </motion.div>
          ))}
        </div>

        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition(0.78)} className="mt-6 border border-accent bg-[color-mix(in_srgb,var(--editorial-accent)_9%,var(--editorial-surface))] p-4 sm:p-5">
          <p className="m-0 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent"><span aria-hidden="true">✓</span> {copy.resultLabel}</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{copy.result}</p>
        </motion.div>
      </div>
    </section>
  );
}
