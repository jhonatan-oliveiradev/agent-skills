"use client";

import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const vertex = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / max(uResolution.y, 1.0);

    float time = uTime * 0.11;
    float field = fbm(vec2(p.x * 0.72 + time, p.y * 1.15 - time * 0.55));
    float fold = sin((p.x + field * 1.8) * 2.1 - time * 2.0) * 0.5 + 0.5;
    float veil = smoothstep(0.26, 0.95, field * 0.72 + fold * 0.52);
    float focus = smoothstep(1.35, 0.08, length(p - vec2(0.38, 0.02)));
    veil *= mix(0.28, 1.0, focus);

    vec3 midnight = vec3(0.005, 0.012, 0.035);
    vec3 blue = vec3(0.055, 0.16, 0.55);
    vec3 violet = vec3(0.28, 0.11, 0.62);
    vec3 color = mix(midnight, blue, veil * 0.72);
    color = mix(color, violet, smoothstep(0.68, 1.0, veil) * 0.45);
    color *= 0.72 + 0.28 * smoothstep(1.5, 0.15, length(p));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function StaticVeil() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_72%_48%,color-mix(in_srgb,var(--editorial-accent)_24%,transparent),transparent_72%),linear-gradient(135deg,color-mix(in_srgb,var(--editorial-accent)_7%,var(--editorial-canvas)),var(--editorial-canvas)_62%)]"
      data-dark-veil="static"
    />
  );
}

export function DarkVeil() {
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof WebGLRenderingContext === "undefined") {
      return;
    }

    const host = hostRef.current;
    if (!host) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
    } catch {
      host.dataset.darkVeil = "static";
      return;
    }

    const { gl } = renderer;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = "block size-full opacity-70 dark:opacity-85";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1));
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
    };

    let frame = 0;
    let visible = true;
    let pageVisible = document.visibilityState !== "hidden";
    const startedAt = performance.now();
    const render = (now: number) => {
      if (visible && pageVisible) {
        program.uniforms.uTime.value = (now - startedAt) / 1000;
        renderer.render({ scene: mesh });
      }
      frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden";
    };

    observer.observe(host);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reducedMotion]);

  if (reducedMotion || typeof WebGLRenderingContext === "undefined") {
    return <StaticVeil />;
  }

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_70%_65%_at_72%_48%,color-mix(in_srgb,var(--editorial-accent)_24%,transparent),transparent_72%),linear-gradient(135deg,color-mix(in_srgb,var(--editorial-accent)_7%,var(--editorial-canvas)),var(--editorial-canvas)_62%)]"
      data-dark-veil="active"
    />
  );
}
