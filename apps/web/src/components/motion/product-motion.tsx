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
    const header = document.querySelector<HTMLElement>(".site-header");
    const surfaces = [
      [".product-hero", "blue"],
      [".product-demo", "ink"],
      [".product-thesis", "light"],
      [".product-work", "mist"],
      [".product-skills", "light"],
      [".product-install", "green"],
      [".product-packs", "pale"],
      [".product-close", "blue"],
      [".site-footer", "ink"],
    ] as const;
    const sections = surfaces.flatMap(([selector, tone]) => {
      const element = document.querySelector<HTMLElement>(selector);
      return element ? [{ element, tone }] : [];
    });
    let frame = 0;
    const syncHeaderTone = () => {
      frame = 0;
      if (!header) return;
      const edge = header.getBoundingClientRect().bottom + 1;
      const current = sections.find(({ element }) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= edge && rect.bottom > edge;
      });
      const tone = current?.tone ?? (window.scrollY > 0 ? sections.at(-1)?.tone : "blue");
      if (tone && header.dataset.productTone !== tone) header.dataset.productTone = tone;
    };
    const onToneScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncHeaderTone);
    };
    syncHeaderTone();
    window.addEventListener("scroll", onToneScroll, { passive: true });
    window.addEventListener("resize", onToneScroll);

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: 1.08, defaults: { ease: "power3.out" } })
        .from(root.querySelector(".product-kicker"), { y: 18, autoAlpha: 0, duration: 0.65 })
        .from(root.querySelector(".product-hero h1"), { y: 35, autoAlpha: 0, duration: 0.85 }, "-=0.35")
        .from(root.querySelector(".product-hero__intro"), { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.55")
        .from(root.querySelector(".product-hero .product-actions"), { y: 16, autoAlpha: 0, duration: 0.65 }, "-=0.45")
        .from(root.querySelector(".product-hero__graphic"), { scale: 0.9, autoAlpha: 0, duration: 1.15 }, 0.5)
        .from(root.querySelector(".product-hero__bottom"), { autoAlpha: 0, duration: 0.7 }, 1.15);

      const progress = root.querySelector<HTMLElement>(".product-scroll-track > span");
      if (progress) {
        gsap.fromTo(progress, { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.35 },
        });
      }

      const storyBlocks = root.querySelectorAll<HTMLElement>(
        ".product-demo__copy, .product-thesis__lead, .product-section-heading, .product-install__intro, .product-close__inner",
      );
      const entryBlur = window.matchMedia("(min-width: 700px)").matches ? 9 : 0;
      storyBlocks.forEach((block) => {
        const content = Array.from(block.children).filter((element): element is HTMLElement =>
          element instanceof HTMLElement && !element.classList.contains("product-demo__number"),
        );
        gsap.fromTo(content,
          { y: 32, autoAlpha: 0, filter: `blur(${entryBlur}px)` },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top 92%", end: "top 55%", scrub: 0.55 },
          },
        );
      });

      const groups = [".product-demo .skill-lab", ".product-thesis__steps > div", ".product-case", ".product-skill", ".product-pack", ".product-install__detail"];
      groups.forEach((selector) => {
        root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
          gsap.from(element, {
            y: 34,
            autoAlpha: 0,
            duration: 0.85,
            delay: Math.min(index, 3) * 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
            onComplete: () => gsap.set(element, { clearProps: "transform,opacity,visibility" }),
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

    return () => {
      media.revert();
      window.removeEventListener("scroll", onToneScroll);
      window.removeEventListener("resize", onToneScroll);
      window.cancelAnimationFrame(frame);
      header?.removeAttribute("data-product-tone");
    };
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
