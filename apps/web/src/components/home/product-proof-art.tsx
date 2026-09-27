import type { LocalizedPack } from "@/lib/catalog";
import type { Locale } from "@/lib/locales";

const labels = {
  en: {
    boundary: "MEDIA CREDENTIAL / SPACE VOICE",
    channel: "VOICE CHANNEL",
    membership: "ACTIVE MEMBERSHIP",
    credential: "CREDENTIAL ISSUED",
    verified: "AUTHORIZATION / VERIFIED AT THE BOUNDARY",
    owner: "ROCKET / SOURCE MAP",
    runtime: "PUBLIC RUNTIME",
    payload: "PAYLOAD + LOCAL FALLBACK",
    migration: "HISTORICAL MIGRATION",
    fetch: "NATIVE FETCH PRESERVED",
    removed: "OBSOLETE COSMIC SDK REMOVED",
    eclipse: "TSUKIHARA / ECLIPSE STUDY",
    reduced: "REDUCED MOTION / ON-DEMAND FRAMES",
    example: "EXAMPLE WORKFLOW",
    request: "A new product interface",
    output: "A reviewable interface system",
    methods: "METHODS IN THE PACK",
    sample: "A SAMPLE OF THE METHOD",
  },
  "pt-BR": {
    boundary: "CREDENCIAL DE MÍDIA / VOZ NO SPACE",
    channel: "CANAL DE VOZ",
    membership: "MEMBRO ATIVO",
    credential: "CREDENCIAL EMITIDA",
    verified: "AUTORIZAÇÃO / VERIFICADA NA EMISSÃO",
    owner: "ROCKET / MAPA DO CÓDIGO",
    runtime: "RUNTIME PÚBLICO",
    payload: "PAYLOAD + FALLBACK LOCAL",
    migration: "MIGRAÇÃO HISTÓRICA",
    fetch: "FETCH NATIVO PRESERVADO",
    removed: "SDK COSMIC OBSOLETO REMOVIDO",
    eclipse: "TSUKIHARA / ESTUDO DO ECLIPSE",
    reduced: "MOVIMENTO REDUZIDO / FRAMES SOB DEMANDA",
    example: "EXEMPLO DE WORKFLOW",
    request: "Uma nova interface de produto",
    output: "Uma interface de produto pronta para revisão",
    methods: "MÉTODOS DO PACK",
    sample: "UMA AMOSTRA DO MÉTODO",
  },
} as const;

export function CaseProofArt({ index, locale }: Readonly<{ index: number; locale: Locale }>) {
  const copy = labels[locale];

  if (index === 0) return (
    <div className="product-proof product-proof--ping" aria-hidden="true">
      <div className="product-proof__top"><span>{copy.boundary}</span><span>01 / 03</span></div>
      <div className="product-proof__ping-path">
        <span className="product-proof__ping-node"><i />{copy.channel}</span>
        <span className="product-proof__ping-node"><i />{copy.membership}<b>✓</b></span>
        <span className="product-proof__ping-node"><i />{copy.credential}<b>↗</b></span>
      </div>
      <span className="product-proof__foot">{copy.verified}</span>
    </div>
  );

  if (index === 1) return (
    <div className="product-proof product-proof--rocket" aria-hidden="true">
      <div className="product-proof__top"><span>{copy.owner}</span><span>02 / 03</span></div>
      <div className="product-proof__routes">
        <div><span>{copy.runtime}</span><strong>{copy.payload}</strong></div>
        <div><span>{copy.migration}</span><strong>{copy.fetch}</strong></div>
      </div>
      <span className="product-proof__removed"><span>−</span> {copy.removed}</span>
    </div>
  );

  return (
    <div className="product-proof product-proof--tsukihara" aria-hidden="true">
      <div className="product-proof__top"><span>{copy.eclipse}</span><span>03 / 03</span></div>
      <div className="product-proof__eclipse"><span className="product-proof__eclipse-rim" /><span className="product-proof__eclipse-disc" /></div>
      <span className="product-proof__foot">{copy.reduced}</span>
    </div>
  );
}

export function PackMethodMap({ pack, locale, featured }: Readonly<{
  pack: LocalizedPack;
  locale: Locale;
  featured: boolean;
}>) {
  const copy = labels[locale];
  return (
    <div className={`product-pack__map${featured ? " product-pack__map--featured" : ""}`}>
      <span className="product-pack__map-label">{featured ? copy.example : copy.methods}</span>
      {featured && <span className="product-pack__flow-line" aria-hidden="true" />}
      {featured && <div className="product-pack__request"><span>INPUT / 01</span><strong>{copy.request}</strong></div>}
      <ol className="product-pack__methods">
        {pack.skills.slice(0, 3).map((skill, index) => (
          <li key={skill.slug}><span>0{index + 1}</span><strong>{skill.displayName}</strong><span>↗</span></li>
        ))}
      </ol>
      {featured && <div className="product-pack__output"><span>OUTPUT / 03</span><strong>{copy.output}</strong><span>✓</span></div>}
      <span className="product-pack__map-foot">{copy.sample} / 03—{String(pack.skills.length).padStart(2, "0")}</span>
    </div>
  );
}
