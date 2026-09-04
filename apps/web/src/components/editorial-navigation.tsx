"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const currentIndex = links.findIndex((link) => {
    const href = String(link.href);
    return pathname === href || pathname.startsWith(`${href}/`);
  });
  const routeIndex = currentIndex >= 0 ? currentIndex : 0;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(routeIndex);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeLink = links[activeIndex] ?? links[routeIndex] ?? links[0]!;
  const visible = open || closing;

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (open) {
      const currentLink = panelRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
      (currentLink ?? firstLink)?.focus();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        setClosing(!reducedMotion);
        triggerRef.current?.focus();
        return;
      }
      if (!open || event.key !== "Tab" || !panelRef.current) return;
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
  }, [open, reducedMotion, visible]);

  function openNavigation() {
    setActiveIndex(routeIndex);
    setClosing(false);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setClosing(!reducedMotion);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        aria-controls="primary-navigation"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="navigation-trigger"
        onClick={open ? close : openNavigation}
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
      {visible ? (
        <div className="navigation-layer" data-navigation-transition="header-reveal">
          <motion.button
            animate={{ opacity: open ? 1 : 0 }}
            aria-hidden="true"
            className="navigation-backdrop"
            initial={reducedMotion ? false : { opacity: 0 }}
            onClick={close}
            style={{ pointerEvents: open ? "auto" : "none" }}
            tabIndex={-1}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.28 }}
            type="button"
          />
          <motion.div
            animate={
              open
                ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
                : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.96 }
            }
            aria-hidden={open ? undefined : true}
            aria-label={open ? label : undefined}
            aria-modal={open ? true : undefined}
            className="primary-navigation"
            data-navigation-mode="studio-index"
            data-viewport-contract="desktop-100dvh"
            id="primary-navigation"
            initial={
              reducedMotion
                ? false
                : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.96 }
            }
            onAnimationComplete={() => {
              if (!open && closing) setClosing(false);
            }}
            ref={panelRef}
            role={open ? "dialog" : undefined}
            style={{ maxHeight: "none", pointerEvents: open ? "auto" : "none" }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
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
                    {links.map((link, index) => {
                      const isCurrent = currentIndex === index;
                      return (
                        <motion.li
                          animate={{ opacity: 1, y: 0 }}
                          data-active={activeIndex === index ? "true" : "false"}
                          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                          key={link.href}
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { delay: 0.1 + index * 0.04, duration: 0.32 }
                          }
                        >
                          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                          <Link
                            aria-current={isCurrent ? "page" : undefined}
                            href={link.href}
                            onClick={close}
                            onFocus={() => setActiveIndex(index)}
                            onMouseEnter={() => setActiveIndex(index)}
                          >
                            <span className="sr-only">{link.label}</span>
                            <TextRoll>{link.label}</TextRoll>
                          </Link>
                          <p className="primary-navigation__mobile-context" data-mobile-context="inline">
                            {link.summary}
                          </p>
                        </motion.li>
                      );
                    })}
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
                        {String(activeIndex + 1).padStart(2, "0")} / {String(links.length).padStart(2, "0")}
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
                <Link className="primary-navigation__cta" href={links[0]!.href} onClick={close}>
                  <span>{cta}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
