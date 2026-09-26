"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const studioTargets = [
  ".editorial-page__hero-copy",
  ".editorial-packs-page__hero > *",
  ".editorial-colophon__hero-grid > *",
  ".institutional-page__hero-grid > *",
  ".field-manual__hero-grid > *",
  ".living-program__hero-grid > *",
  ".method-dossier__hero-grid > *",
  ".pack-blueprint__hero-copy",
  ".evidence-report__hero-copy",
  ".editorial-section-heading",
  ".institutional-page__section-heading",
  ".living-program__chapter-header",
  "[data-editorial-section] > header",
  ".methods-page section > header",
  ".packs-page section > header",
].join(", ");

const careerTargets = [
  ".career-lab-entry__intro",
  ".career-lab-entry__dimensions",
  ".career-lab-entry__workspace-header",
  ".career-lab-entry__journey li",
  ".career-overview__hero",
  ".career-overview__grid",
  ".career-onboarding > header",
].join(", ");

export function InteriorMotion({ area }: Readonly<{ area: "studio" | "career" }>) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (area === "studio" && document.querySelector(".product-home")) return;

    const root = document.querySelector<HTMLElement>("#main-content");
    if (!root) return;
    const context = gsap.context(() => {
      const selector = area === "studio" ? studioTargets : careerTargets;
      const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
      targets.forEach((target, index) => {
        // Keep first-viewport content visible until the browser has finished loading.
        const inView = target.getBoundingClientRect().top < window.innerHeight * .88;
        gsap.from(target, {
          y: inView ? 18 : 30,
          autoAlpha: 0,
          filter: window.innerWidth >= 700 ? "blur(5px)" : "blur(0px)",
          duration: inView ? .7 : .85,
          delay: inView ? Math.min(index, 3) * .08 : 0,
          ease: "power3.out",
          scrollTrigger: inView ? undefined : { trigger: target, start: "top 90%", once: true },
          onComplete: () => gsap.set(target, { clearProps: "transform,opacity,visibility,filter" }),
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [area, pathname]);

  useEffect(() => {
    if (area === "studio" && document.querySelector(".product-home")) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let disposed = false;
    let revision = 0;
    let lenis: import("lenis").default | undefined;
    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => lenis?.raf(time * 1000);

    const stop = () => {
      gsap.ticker.remove(tick);
      lenis?.off("scroll", onScroll);
      lenis?.destroy();
      lenis = undefined;
    };
    const update = async () => {
      const current = ++revision;
      stop();
      if (reducedMotion.matches || !finePointer.matches) return;
      const { default: Lenis } = await import("lenis");
      if (disposed || current !== revision || reducedMotion.matches || !finePointer.matches) return;
      lenis = new Lenis({ autoRaf: false, anchors: true, autoToggle: true, duration: 1.05 });
      lenis.on("scroll", onScroll);
      gsap.ticker.add(tick);
      ScrollTrigger.refresh();
    };

    void update();
    reducedMotion.addEventListener("change", update);
    finePointer.addEventListener("change", update);
    return () => {
      disposed = true;
      revision++;
      reducedMotion.removeEventListener("change", update);
      finePointer.removeEventListener("change", update);
      stop();
    };
  }, [area, pathname]);

  return null;
}
