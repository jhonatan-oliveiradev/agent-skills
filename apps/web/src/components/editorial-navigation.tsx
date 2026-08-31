"use client";

import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MorphIcon } from "morphicons/react";
import { useEffect, useRef, useState } from "react";
import { TextRoll } from "./text-roll";

type NavigationLink = Readonly<{
  href: Route;
  label: string;
  kicker: string;
  summary: string;
}>;

type NavigationMetadata = Readonly<{
  packs: number;
  skills: number;
  version: string;
}>;

type EditorialNavigationProps = Readonly<{
  closeLabel: string;
  collectionLabel: string;
  cta: string;
  indexLabel: string;
  indexSummary: string;
  indexTitle: string;
  label: string;
  links: readonly NavigationLink[];
  metadata: NavigationMetadata;
  openLabel: string;
  versionLabel: string;
}>;

export function EditorialNavigation({
  closeLabel,
  collectionLabel,
  cta,
  indexLabel,
  indexSummary,
  indexTitle,
  label,
  links,
  metadata,
  openLabel,
  versionLabel,
}: EditorialNavigationProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeLink = links[activeIndex] ?? links[0];

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
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'),
      );
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
      <button
        aria-controls="primary-navigation"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="navigation-trigger"
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
        title={open ? closeLabel : openLabel}
        type="button"
      >
        <span className="navigation-trigger__label">{indexLabel}</span>
        <MorphIcon
          aria-hidden="true"
          icon={open ? X : Menu}
          reducedMotion="user"
          size={17}
          spring="snappy"
          strokeWidth={1.7}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <div className="navigation-layer">
            <motion.button
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="navigation-backdrop"
              initial={{ opacity: 0 }}
              onClick={close}
              tabIndex={-1}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
              type="button"
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              aria-label={label}
              aria-modal="true"
              className="primary-navigation"
              data-navigation-mode="studio-index"
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              id="primary-navigation"
              initial={reducedMotion ? false : { opacity: 0, y: -18 }}
              ref={panelRef}
              role="dialog"
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <div className="shell primary-navigation__frame">
                <div className="primary-navigation__masthead">
                  <div>
                    <span className="primary-navigation__eyebrow">{indexLabel} / 01—06</span>
                    <h2>{indexTitle}</h2>
                  </div>
                  <p>{indexSummary}</p>
                </div>

                <div className="primary-navigation__layout">
                  <nav aria-label={label} className="primary-navigation__list">
                    <ol>
                      {links.map((link, index) => (
                        <motion.li
                          animate={{ opacity: 1, y: 0 }}
                          data-active={activeIndex === index ? "true" : "false"}
                          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                          key={link.href}
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { delay: 0.06 + index * 0.045, duration: 0.34 }
                          }
                        >
                          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                          <Link
                            href={link.href}
                            onClick={close}
                            onFocus={() => setActiveIndex(index)}
                            onMouseEnter={() => setActiveIndex(index)}
                          >
                            <span className="sr-only">{link.label}</span>
                            <TextRoll>{link.label}</TextRoll>
                          </Link>
                        </motion.li>
                      ))}
                    </ol>
                  </nav>

                  <aside aria-live="polite" className="primary-navigation__context">
                    <AnimatePresence mode="wait">
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                        key={activeLink.href}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
                      >
                        <span>{activeLink.kicker}</span>
                        <p>{activeLink.summary}</p>
                        <span className="primary-navigation__context-index" aria-hidden="true">
                          {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </aside>
                </div>

                <div className="primary-navigation__footer">
                  <dl className="primary-navigation__metadata">
                    <div>
                      <dt>{collectionLabel}</dt>
                      <dd>{metadata.skills} SKILLS</dd>
                    </div>
                    <div>
                      <dt aria-hidden="true">&nbsp;</dt>
                      <dd>{metadata.packs} PACKS</dd>
                    </div>
                    <div>
                      <dt>{versionLabel}</dt>
                      <dd>{metadata.version}</dd>
                    </div>
                  </dl>
                  <Link className="primary-navigation__cta" href={links[0].href} onClick={close}>
                    <span>{cta}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
