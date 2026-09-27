"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { Locale } from "@/lib/locales";

type Principle = Readonly<{ title: string; text: string }>;

const artifacts = {
  en: [
    {
      phase: "01 / CONTEXT",
      file: "brief.md",
      title: "A request is not a plan yet.",
      lines: ["Device, network and the user's goal", "Fonts, images and layout stability", "Constraints and criteria before implementation"],
      result: "First, define the problem.",
    },
    {
      phase: "02 / METHOD",
      file: "method.md",
      title: "A method guides each decision.",
      lines: ["Prioritize the content that matters", "Investigate the largest rendering cost", "Review responsive layout and interaction states"],
      result: "The process is visible.",
    },
    {
      phase: "03 / EVIDENCE",
      file: "review.md",
      title: "The result can be inspected.",
      lines: ["Document changes and their rationale", "Check the build and real screen sizes", "Record open questions and limits"],
      result: "The work leaves a trail.",
    },
  ],
  "pt-BR": [
    {
      phase: "01 / CONTEXTO",
      file: "pedido.md",
      title: "Um pedido ainda não é um plano.",
      lines: ["Dispositivo, rede e objetivo de uso", "Fontes, imagens e estabilidade do layout", "Restrições e critérios antes da implementação"],
      result: "Primeiro, delimitar o problema.",
    },
    {
      phase: "02 / MÉTODO",
      file: "metodo.md",
      title: "Um método conduz cada decisão.",
      lines: ["Priorizar o conteúdo que importa", "Investigar o maior custo de renderização", "Revisar responsividade e estados de interação"],
      result: "O processo fica visível.",
    },
    {
      phase: "03 / EVIDÊNCIA",
      file: "revisao.md",
      title: "O resultado pode ser inspecionado.",
      lines: ["Documentar mudanças e justificativas", "Verificar build e tamanhos reais de tela", "Registrar dúvidas e limites"],
      result: "O trabalho deixa rastros.",
    },
  ],
} as const;

export function ThesisJourney({ locale, principles }: Readonly<{ locale: Locale; principles: readonly Principle[] }>) {
  const [active, setActive] = useState(0);
  const artifact = artifacts[locale][active];
  const copy = locale === "pt-BR"
    ? { label: "Explore as etapas do método", example: "EXEMPLO DE PROCESSO", request: "Pedido: deixe esta página Next.js mais rápida no celular.", action: "Conheça uma skill de interfaces Next.js" }
    : { label: "Explore the method's stages", example: "EXAMPLE PROCESS", request: "Request: make this Next.js page faster on a phone.", action: "Explore a Next.js interface skill" };

  return (
    <div className="product-thesis__journey">
      <div className="product-thesis__steps" aria-label={copy.label}>
        {principles.map((item, index) => (
          <div className="product-thesis__step" key={item.title}>
            <button type="button" aria-pressed={active === index} aria-controls="thesis-artifact" onClick={() => setActive(index)}>
              <span className="product-thesis__step-number">0{index + 1} <span aria-hidden="true">/ 03</span></span>
              <span className="product-thesis__step-title">{item.title}</span>
              <span className="product-thesis__step-description">{item.text}</span>
              <span className="product-thesis__step-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        ))}
      </div>
      <div className="product-thesis__preview" id="thesis-artifact" aria-live="polite">
        <div className="product-thesis__preview-top"><span><i aria-hidden="true" /> {copy.example}</span><span>AS / 0{active + 1}—03</span></div>
        <div className="product-thesis__preview-request"><span>INPUT</span><p>“{copy.request}”</p></div>
        <div className="product-thesis__preview-document" key={active}>
          <div className="product-thesis__preview-file"><span>{artifact.file}</span><span>{artifact.phase}</span></div>
          <h3>{artifact.title}</h3>
          <ul>{artifact.lines.map((line) => <li key={line}><span aria-hidden="true">↳</span>{line}</li>)}</ul>
          <p className="product-thesis__preview-result"><span aria-hidden="true">✓</span>{artifact.result}</p>
        </div>
        <div className="product-thesis__preview-bottom">
          <span className="product-thesis__preview-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(active + 1) / principles.length})` }} /></span>
          <Link href={`/${locale}/skills/building-premium-nextjs-interfaces` as Route}>{copy.action}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  );
}
