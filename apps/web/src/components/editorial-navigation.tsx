"use client";

import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide";
import { motion, useReducedMotion } from "motion/react";
import { MorphIcon } from "morphicons/react";
import { useState } from "react";
import { TextRoll } from "./text-roll";

type NavigationLink = readonly [Route, string];

export function EditorialNavigation({ closeLabel, label, links, openLabel }: Readonly<{ closeLabel: string; label: string; links: readonly NavigationLink[]; openLabel: string }>) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const actionLabel = open ? closeLabel : openLabel;

  return (
    <>
      <button aria-controls="primary-navigation" aria-expanded={open} aria-label={actionLabel} className="navigation-trigger" onClick={() => setOpen((current) => !current)} title={actionLabel} type="button">
        <MorphIcon aria-hidden="true" icon={open ? X : Menu} reducedMotion="user" size={19} spring="snappy" strokeWidth={1.8} />
      </button>
      <nav aria-label={label} className="primary-navigation" data-open={String(open)} data-testid="editorial-navigation" id="primary-navigation">
        <motion.ul animate={{ opacity: 1, y: 0 }} initial={reducedMotion ? false : { opacity: 0, y: -6 }} transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          {links.map(([href, text], index) => (
            <motion.li animate={{ opacity: 1, y: 0 }} initial={reducedMotion ? false : { opacity: 0, y: -5 }} key={href} transition={reducedMotion ? { duration: 0 } : { delay: index * 0.025, duration: 0.3 }}>
              <Link href={href} onClick={() => setOpen(false)}>
                <span className="sr-only">{text}</span>
                <TextRoll>{text}</TextRoll>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </>
  );
}
