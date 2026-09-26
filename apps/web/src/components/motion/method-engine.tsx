"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/locales";

export type MethodEngineCopy = Readonly<{
  label: string; promptLabel: string; prompt: string;
  stages: readonly [string, string, string]; resultLabel: string; result: string;
}>;

type MethodEngineProps = Readonly<{ copy: MethodEngineCopy; metrics: readonly string[]; locale: Locale }>;

const examples = {
  en: [
    { name: "Interface systems", skill: "designing-ui-systems", request: "Turn these scattered screens into one coherent interface system.", method: "Find repeated patterns, establish tokens, and define reusable components.", outcome: "A consistent UI language across screens and states.", tags: ["TOKENS", "COMPONENTS", "STATES"] },
    { name: "Frontend craft", skill: "building-premium-nextjs-interfaces", request: "Build this Next.js page so it looks refined and works everywhere.", method: "Shape the layout, implement responsive behavior, and verify real interaction states.", outcome: "An implemented interface ready to review on desktop and mobile.", tags: ["NEXT.JS", "RESPONSIVE", "ACCESSIBILITY"] },
    { name: "Motion direction", skill: "craft-premium-motion", request: "Make these interactions feel intentional and connected.", method: "Define motion principles, choreograph key transitions, and respect reduced motion.", outcome: "A motion system that guides attention without getting in the way.", tags: ["TIMING", "TRANSITIONS", "REDUCED MOTION"] },
  ],
  "pt-BR": [
    { name: "Sistemas de interface", skill: "designing-ui-systems", request: "Transforme estas telas soltas em um sistema de interface coerente.", method: "Identifique padrões, estabeleça tokens e defina componentes reutilizáveis.", outcome: "Uma linguagem visual consistente entre telas e estados.", tags: ["TOKENS", "COMPONENTES", "ESTADOS"] },
    { name: "Engenharia frontend", skill: "building-premium-nextjs-interfaces", request: "Construa esta página Next.js com qualidade visual e responsividade.", method: "Organize o layout, implemente a adaptação e verifique os estados reais de interação.", outcome: "Uma interface implementada para desktop e mobile.", tags: ["NEXT.JS", "RESPONSIVO", "ACESSIBILIDADE"] },
    { name: "Direção de motion", skill: "craft-premium-motion", request: "Faça estas interações parecerem intencionais e conectadas.", method: "Defina princípios de movimento, coreografe transições e respeite movimento reduzido.", outcome: "Um sistema de movimento que orienta a atenção.", tags: ["TIMING", "TRANSIÇÕES", "MOVIMENTO REDUZIDO"] },
  ],
} as const;

export function MethodEngine({ copy, metrics, locale }: MethodEngineProps) {
  const [active, setActive] = useState(0);
  const example = examples[locale][active];
  return (
    <section aria-label={copy.label} className="skill-lab">
      <div className="skill-lab__chrome"><span className="skill-lab__lights" aria-hidden="true"><i /><i /><i /></span><span>AGENT SKILLS / {locale === "pt-BR" ? "EM AÇÃO" : "IN ACTION"}</span><span className="skill-lab__live">● {locale === "pt-BR" ? "EXEMPLO INTERATIVO" : "INTERACTIVE EXAMPLE"}</span></div>
      <div className="skill-lab__body">
        <div className="skill-lab__intro"><span className="skill-lab__index">/ 001—003</span><p>{locale === "pt-BR" ? "Escolha um método. Veja o que ele muda." : "Choose a method. See what it changes."}</p></div>
        <div className="skill-lab__tabs" role="tablist" aria-label={locale === "pt-BR" ? "Exemplos de skills" : "Skill examples"}>
          {examples[locale].map((item, index) => <button key={item.skill} type="button" role="tab" id={`skill-tab-${index}`} aria-selected={active === index} aria-controls="skill-lab-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = (index + (event.key === "ArrowRight" ? 1 : 2)) % 3; setActive(next); document.getElementById(`skill-tab-${next}`)?.focus(); } }}>{item.name}</button>)}
        </div>
        <div role="tabpanel" id="skill-lab-panel" aria-labelledby={`skill-tab-${active}`} className="skill-lab__panel" key={example.skill}>
          <div className="skill-lab__prompt"><span className="skill-lab__caption">01 / {copy.promptLabel}</span><p>“{example.request}”</p></div>
          <div className="skill-lab__connector" aria-hidden="true"><span /><span>{example.skill}</span><span /></div>
          <div className="skill-lab__output"><span className="skill-lab__caption">02 / {locale === "pt-BR" ? "O MÉTODO" : "THE METHOD"}</span><p>{example.method}</p><div className="skill-lab__tags">{example.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className="skill-lab__result"><span className="skill-lab__caption">03 / {copy.resultLabel}</span><p>{example.outcome}</p></div>
          <Link className="skill-lab__link" href={`/${locale}/skills/${example.skill}` as Route}><span className="skill-lab__link-label">{locale === "pt-BR" ? "Conhecer e instalar esta skill" : "Explore and install this skill"}</span><span className="skill-lab__link-arrow" aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="skill-lab__foot">{metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
    </section>
  );
}
