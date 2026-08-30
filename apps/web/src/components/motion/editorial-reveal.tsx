"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const elements = {
  article: motion.article,
  div: motion.div,
  section: motion.section,
} as const;

type EditorialRevealProps = {
  as?: keyof typeof elements;
  children: ReactNode;
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

export function EditorialReveal({
  as = "div",
  children,
  delay = 0,
  ...props
}: EditorialRevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = elements[as];

  return (
    <Component
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ amount: 0.2, once: true }}
      transition={{ delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
