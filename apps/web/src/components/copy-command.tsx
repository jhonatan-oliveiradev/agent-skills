"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function CopyCommand({
  command,
  label,
  copiedLabel,
}: Readonly<{ command: string; label: string; copiedLabel: string }>) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copy() {
    try {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(command);
      setCopied(true);

      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const actionLabel = copied ? copiedLabel : label;
  const Icon = copied ? Check : Copy;

  return (
    <div className="command-block">
      <code>{command}</code>
      <button
        aria-label={actionLabel}
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-md text-accent transition-[transform,background-color,color] duration-150 ease-editorial hover:bg-accent/10 active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
        onClick={copy}
        title={actionLabel}
        type="button"
      >
        <motion.span
          animate={{ rotate: copied && !reducedMotion ? -8 : 0, scale: copied ? 1.08 : 1 }}
          className="grid place-items-center"
          initial={false}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.16 }}
        >
          <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
        </motion.span>
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
