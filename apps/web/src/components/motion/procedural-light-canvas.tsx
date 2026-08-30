"use client";

import { useEffect, useRef } from "react";

type ProceduralLightCanvasProps = Readonly<{ label?: string }>;

export function ProceduralLightCanvas({ label }: ProceduralLightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasNode = canvas;

    let frame: number | null = null;
    let visible = true;
    let elapsed = 0;
    const pointer = { x: 0.52, y: 0.56 };
    const context = canvasNode.getContext("2d");

    function resize() {
      const rect = canvasNode.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasNode.width = Math.max(1, Math.floor(rect.width * dpr));
      canvasNode.height = Math.max(1, Math.floor(rect.height * dpr));
    }

    function draw() {
      if (visible && context) {
        elapsed += 0.006;
        const { width, height } = canvasNode;
        context.clearRect(0, 0, width, height);
        context.globalCompositeOperation = "screen";

        const points = [
          [pointer.x + Math.sin(elapsed) * 0.05, pointer.y, 0.44],
          [0.28 + Math.cos(elapsed * 0.7) * 0.07, 0.78, 0.3],
          [0.76 + Math.sin(elapsed * 0.55) * 0.06, 0.74, 0.34],
        ] as const;

        for (const [x, y, size] of points) {
          const radius = Math.max(width, height) * size;
          const gradient = context.createRadialGradient(width * x, height * y, 0, width * x, height * y, radius);
          gradient.addColorStop(0, "rgba(70, 111, 255, 0.46)");
          gradient.addColorStop(0.35, "rgba(39, 75, 216, 0.18)");
          gradient.addColorStop(1, "rgba(5, 9, 18, 0)");
          context.fillStyle = gradient;
          context.fillRect(0, 0, width, height);
        }
      }
      frame = requestAnimationFrame(draw);
    }

    function start() {
      if (frame === null) frame = requestAnimationFrame(draw);
    }

    function stop() {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && document.visibilityState !== "hidden") start();
      else stop();
    });
    const onVisibilityChange = () => {
      if (visible && document.visibilityState !== "hidden") start();
      else stop();
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvasNode.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      pointer.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    };

    resize();
    start();
    resizeObserver.observe(canvasNode);
    intersectionObserver.observe(canvasNode);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvasNode.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvasNode.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-label={label} className="absolute inset-0 size-full" role={label ? "img" : undefined} />;
}
