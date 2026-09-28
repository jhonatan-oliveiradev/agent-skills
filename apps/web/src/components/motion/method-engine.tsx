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

function ArtifactPreview({ kind, locale }: { kind: number; locale: Locale }) {
  const pt = locale === "pt-BR";
  return (
    <figure className={`skill-lab__artifact skill-lab__artifact--${kind}`}>
      <div className="skill-lab__artifact-bar"><span>{pt ? "RECORTE DA ENTREGA" : "DELIVERABLE STUDY"} / 0{kind + 1}</span><span>{pt ? "EXEMPLO ILUSTRATIVO" : "ILLUSTRATIVE EXAMPLE"}</span></div>
      {kind === 0 && <div className="skill-lab__system-study">
        <div className="skill-lab__system-page">
          <div className="skill-lab__system-nav"><strong>forma<span>✳</span></strong><span>{pt ? "Coleção" : "Collection"}&nbsp; ↗</span></div>
          <div className="skill-lab__system-hero"><span>01 / {pt ? "UMA NOVA PERSPECTIVA" : "A NEW PERSPECTIVE"}</span><strong>{pt ? "Espaço para" : "Room to"}<br /><em>{pt ? "o essencial." : "focus."}</em></strong><i aria-hidden="true">✳</i></div>
          <div className="skill-lab__system-bottom"><span>{pt ? "Explorar a coleção" : "Explore the collection"} &nbsp;↗</span><span>FORM / 001</span></div>
        </div>
        <div className="skill-lab__system-spec"><span>01 / {pt ? "FUNDAÇÃO" : "FOUNDATION"}</span><div className="skill-lab__swatches" aria-hidden="true"><i /><i /><i /></div><span>02 / {pt ? "COMPONENTE" : "COMPONENT"}</span><div className="skill-lab__sample-button">{pt ? "Explorar" : "Explore"} <span>↗</span></div><span>03 / {pt ? "ESTADOS" : "STATES"}</span><div className="skill-lab__sample-states" aria-hidden="true"><i /><i /><i /></div></div>
      </div>}
      {kind === 1 && <div className="skill-lab__frontend-study">
        <div className="skill-lab__viewport-label">{pt ? "MESMA INTERFACE / DUAS LARGURAS" : "ONE INTERFACE / TWO VIEWPORTS"}</div>
        <div className="skill-lab__screens">
          <div className="skill-lab__desktop-screen"><div className="skill-lab__screen-nav"><b>MONO /</b><span>01 &nbsp; 02 &nbsp; 03</span></div><div className="skill-lab__screen-content"><div><small>{pt ? "EDIÇÃO Nº 01" : "EDITION NO. 01"}</small><strong>{pt ? "Ideias em" : "Ideas in"}<br />movimento<span>.</span></strong><i>{pt ? "Ver projeto ↗" : "View project ↗"}</i></div><span className="skill-lab__screen-art" aria-hidden="true"><span /></span></div></div>
          <div className="skill-lab__mobile-screen"><div className="skill-lab__screen-nav"><b>MONO /</b><span>☰</span></div><small>{pt ? "EDIÇÃO Nº 01" : "EDITION NO. 01"}</small><strong>{pt ? "Ideias em" : "Ideas in"}<br />movimento<span>.</span></strong><span className="skill-lab__screen-art" aria-hidden="true"><span /></span><i>{pt ? "Ver projeto ↗" : "View project ↗"}</i></div>
        </div><div className="skill-lab__viewport-foot"><span>↔ {pt ? "LAYOUT ADAPTÁVEL" : "ADAPTIVE LAYOUT"}</span><span>↗ {pt ? "ESTADOS REVISÁVEIS" : "REVIEWABLE STATES"}</span></div>
      </div>}
      {kind === 2 && <div className="skill-lab__motion-study">
        <div className="skill-lab__motion-stage"><span className="skill-lab__motion-coordinate">SCENE 01 / 03</span><div className="skill-lab__motion-orbit" aria-hidden="true"><i /><i /><b>✳</b></div><strong>{pt ? "Atenção em" : "Attention in"}<br /><em>{pt ? "movimento." : "motion."}</em></strong><span className="skill-lab__motion-cue">{pt ? "DESCUBRA O PRÓXIMO CAPÍTULO" : "DISCOVER THE NEXT CHAPTER"} &nbsp; ↗</span></div>
        <div className="skill-lab__motion-timeline"><span>00:00</span><div aria-hidden="true"><i /><i /><i /></div><span>00:03</span></div><div className="skill-lab__motion-notes"><span>01 &nbsp; {pt ? "ENTRADA" : "ENTRANCE"}</span><span>02 &nbsp; {pt ? "FOCO" : "FOCUS"}</span><span>03 &nbsp; {pt ? "CONTINUIDADE" : "CONTINUITY"}</span></div>
      </div>}
      <figcaption>{pt ? "Uma visualização do tipo de entrega que o método ajuda a construir." : "A visual study of the kind of deliverable the method helps you build."}</figcaption>
    </figure>
  );
}

export function MethodEngine({ copy, metrics, locale }: MethodEngineProps) {
  const [active, setActive] = useState(0);
  const example = examples[locale][active];
  return (
    <section aria-label={copy.label} className="skill-lab">
      <div className="skill-lab__chrome"><span className="skill-lab__lights" aria-hidden="true"><i /><i /><i /></span><span>AGENT SKILLS / {locale === "pt-BR" ? "EM AÇÃO" : "IN ACTION"}</span><span className="skill-lab__live">● {locale === "pt-BR" ? "EXEMPLO INTERATIVO" : "INTERACTIVE EXAMPLE"}</span></div>
      <div className="skill-lab__body">
        <div className="skill-lab__intro"><span className="skill-lab__index">/ 001—003</span><p>{locale === "pt-BR" ? "Escolha um método. Veja o que ele muda." : "Choose a method. See what it changes."}</p></div>
        <div className="skill-lab__tabs" role="tablist" aria-label={locale === "pt-BR" ? "Exemplos de skills" : "Skill examples"}>
          {examples[locale].map((item, index) => <button key={item.skill} type="button" role="tab" id={`skill-tab-${index}`} aria-label={item.name} aria-selected={active === index} aria-controls="skill-lab-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = (index + (event.key === "ArrowRight" ? 1 : 2)) % 3; setActive(next); document.getElementById(`skill-tab-${next}`)?.focus(); } }}><span aria-hidden="true">0{index + 1}</span>{item.name}</button>)}
        </div>
        <div role="tabpanel" id="skill-lab-panel" aria-labelledby={`skill-tab-${active}`} className="skill-lab__panel" key={example.skill}>
          <div className="skill-lab__brief"><span className="skill-lab__caption">01 / {copy.promptLabel}</span><p>“{example.request}”</p></div>
          <div className="skill-lab__method"><div><span className="skill-lab__caption">02 / {locale === "pt-BR" ? "O MÉTODO" : "THE METHOD"}</span><p>{example.method}</p></div><div className="skill-lab__tags">{example.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <ArtifactPreview kind={active} locale={locale} />
          <div className="skill-lab__conclusion"><div><span className="skill-lab__caption">03 / {copy.resultLabel}</span><p>{example.outcome}</p></div><Link className="skill-lab__link" href={`/${locale}/skills/${example.skill}` as Route}><span className="skill-lab__link-label">{locale === "pt-BR" ? "Conhecer e instalar esta skill" : "Explore and install this skill"}</span><span className="skill-lab__link-arrow" aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
      <div className="skill-lab__foot">{metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
    </section>
  );
}
