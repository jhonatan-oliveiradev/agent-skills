"use client";

import clsx from "clsx";
import { motion, useReducedMotion, type MotionValue } from "motion/react";

export type EvidenceThreadMode = "case" | "workflow" | "ledger";

export type HomeEvidenceThreadProps = Readonly<{
  progress: MotionValue<number>;
  mode: EvidenceThreadMode;
  className?: string;
}>;

const pathForMode: Record<EvidenceThreadMode, string> = {
  case: "M50 0 V20 C50 30 72 30 72 42 V60 C72 72 42 72 42 84 V100",
  workflow: "M0 52 H18 C28 52 28 28 40 28 H60 C72 28 72 72 84 72 H100",
  ledger: "M52 0 V18 C52 28 34 28 34 40 V60 C34 72 64 72 64 84 V100",
};

export function HomeEvidenceThread({ progress, mode, className }: HomeEvidenceThreadProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={clsx("pointer-events-none text-accent", className)}
      data-evidence-thread-mode={mode}
      data-testid="evidence-thread"
    >
      <svg
        className="size-full overflow-visible"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={pathForMode[mode]}
          fill="none"
          opacity="0.14"
          stroke="currentColor"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d={pathForMode[mode]}
          fill="none"
          pathLength={reducedMotion ? 1 : progress}
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
