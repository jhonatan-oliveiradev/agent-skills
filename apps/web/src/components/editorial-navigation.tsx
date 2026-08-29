"use client";

import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide";
import { motion, useReducedMotion } from "motion/react";
import { MorphIcon } from "morphicons/react";
import { useEffect, useRef, useState } from "react";
import { TextRoll } from "./text-roll";

type NavigationLink = readonly [Route, string];

export function EditorialNavigation({ closeLabel, cta, label, links, openLabel }: Readonly<{ closeLabel: string; cta: string; label: string; links: readonly NavigationLink[]; openLabel: string }>) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? closeLabel : openLabel} className="navigation-trigger" onClick={() => setOpen((current) => !current)} ref={triggerRef} title={open ? closeLabel : openLabel} type="button">
        <MorphIcon aria-hidden="true" icon={open ? X : Menu} reducedMotion="user" size={19} spring="snappy" strokeWidth={1.8} />
      </button>
      {open ? (
          <div className="navigation-layer">
            <motion.button animate={{ opacity: 1 }} aria-hidden="true" className="navigation-backdrop" initial={{ opacity: 0 }} onClick={close} tabIndex={-1} transition={reducedMotion ? { duration: 0 } : { duration: 0.28 }} type="button" />
            <motion.div animate={{ opacity: 1, x: 0, y: 0 }} aria-label={label} aria-modal="true" className="primary-navigation" id="primary-navigation" initial={reducedMotion ? false : { opacity: 0, x: 24, y: -12 }} ref={panelRef} role="dialog" transition={reducedMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
              <div className="primary-navigation__topline"><span>{label}</span><span>01—06</span></div>
              <nav aria-label={label}>
                <ol>
                  {links.map(([href, text], index) => (
                    <motion.li animate={{ opacity: 1, y: 0 }} initial={reducedMotion ? false : { opacity: 0, y: 10 }} key={href} transition={reducedMotion ? { duration: 0 } : { delay: 0.08 + index * 0.035, duration: 0.35 }}>
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <Link href={href} onClick={close}><span className="sr-only">{text}</span><TextRoll>{text}</TextRoll></Link>
                    </motion.li>
                  ))}
                </ol>
              </nav>
              <Link className="primary-navigation__cta" href={links[0][0]} onClick={close}><span>{cta}</span><span aria-hidden="true">↗</span></Link>
            </motion.div>
          </div>
        ) : null}
    </>
  );
}
