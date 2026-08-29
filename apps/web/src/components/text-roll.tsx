"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const stagger = 0.018;

export function TextRoll({ children, className }: Readonly<{ children: string; className?: string }>) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <span className={className}>{children}</span>;

  return (
    <motion.span aria-hidden="true" className={cn("text-roll", className)} initial="rest" whileHover="hover">
      {["current", "next"].map((line) => (
        <span className={cn("text-roll__line", line === "next" && "text-roll__line--next")} key={line}>
          {children.split("").map((letter, index) => (
            <motion.span
              className="text-roll__letter"
              key={`${line}-${letter}-${index}`}
              transition={{ delay: stagger * index, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              variants={line === "current" ? { rest: { y: 0 }, hover: { y: "-100%" } } : { rest: { y: "100%" }, hover: { y: 0 } }}
            >
              {letter === " " ? "\u00a0" : letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
