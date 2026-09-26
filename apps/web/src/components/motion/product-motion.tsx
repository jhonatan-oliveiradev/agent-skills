"use client";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProductMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>(".product-home");
    if (!root) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = root.querySelectorAll<HTMLElement>(
        ".product-demo__copy, .product-thesis__lead, .product-section-heading, .product-install__intro, .product-close__inner",
      );
      reveal.forEach((element) => {
        gsap.from(element, {
          y: 32,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      const groups = [".product-thesis__steps > div", ".product-case", ".product-skill", ".product-pack", ".product-install__detail"];
      groups.forEach((selector) => {
        root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
          gsap.from(element, {
            y: 34,
            autoAlpha: 0,
            duration: 0.75,
            delay: Math.min(index, 3) * 0.09,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });
      });

      if (window.matchMedia("(min-width: 1060px) and (pointer: fine)").matches) {
        const graphic = root.querySelector<HTMLElement>(".product-hero__graphic");
        if (graphic) {
          gsap.to(graphic, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: ".product-hero", start: "top top", end: "bottom top", scrub: 0.7 },
          });
        }
        root.querySelectorAll<HTMLElement>(".product-case__interface").forEach((element) => {
          gsap.fromTo(element, { yPercent: -7 }, {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: element.closest(".product-case__art"), start: "top bottom", end: "bottom top", scrub: 0.7 },
          });
        });
      }
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
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
  }, []);

  return null;
}
