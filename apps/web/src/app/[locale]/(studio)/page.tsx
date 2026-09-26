import type { Metadata, Route } from "next";
import Link from "next/link";
import { resolveLocale } from "@/components/foundation-route";
import { MethodEngine } from "@/components/motion/method-engine";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getCatalog, getLocalizedPacks, getLocalizedSkills } from "@/lib/catalog";
import { homeManifesto } from "@/lib/home-content";

type HomePageProps = Readonly<{ params: Promise<{ locale: string }> }>;

const content = {
  en: {
    marker: "A WORKING SYSTEM FOR AI AGENTS",
    headline: <>Your agent can do more.<br /><em>Give it a way to.</em></>,
    intro: "A collection of installable skills that turns a request into a considered process. Better decisions, stronger execution, work you can inspect.",
    discover: "Explore the skills",
    seeHow: "See how it works",
    lab: "THE PRODUCT, IN PRACTICE",
    labTitle: "A skill changes the way the work gets done.",
    labText: "Choose a discipline. Follow the request, the method, and the outcome. Each example leads to an actual skill you can install.",
    thesisLabel: "WHY IT EXISTS",
    thesis: <>A good result starts <em>before</em> the first output.</>,
    thesisText: "Skills give your agent a repeatable way to investigate, decide, build and verify. The instructions, boundaries and source stay open for you to inspect.",
    principles: [
      { title: "Understand the brief", text: "Establish context and constraints before making anything." },
      { title: "Work with a method", text: "Follow a clear process shaped for the task, not a generic response." },
      { title: "Show the evidence", text: "Make decisions and the finished work possible to review." },
    ],
    workLabel: "BUILT WITH SKILLS",
    workTitle: <>Real work.<br /><em>Traceable decisions.</em></>,
    workText: "See where these methods were used in actual projects. Each case documents the problem, the decisions and the evidence.",
    viewCase: "Read the case",
    allCases: "Explore all cases",
    skillsLabel: "START SOMEWHERE",
    skillsTitle: "Pick the capability your next project needs.",
    skillsText: "One skill for a focused job. Each has its own scope, guidance and installation path.",
    skillAction: "Explore skill",
    allSkills: "Browse all skills",
    packsLabel: "GO FURTHER",
    packsTitle: "When the work needs more than one method.",
    packsText: "Packs connect related skills into a more complete workflow. Start with a discipline and expand when the project asks for it.",
    packAction: "Explore pack",
    allPacks: "See all packs",
    closingLabel: "YOUR NEXT PROJECT STARTS HERE",
    closingTitle: <>Give the work<br /><em>a better process.</em></>,
    closingText: "Explore a skill, inspect its source, and bring it into your workflow.",
    install: "How to install",
    source: "View the source",
    caseFallback: "An inspectable account of the work, decisions and verification.",
  },
  "pt-BR": {
    marker: "UM SISTEMA DE TRABALHO PARA AGENTES DE IA",
    headline: <>Seu agente pode fazer mais.<br /><em>Dê a ele um método.</em></>,
    intro: "Uma coleção de skills instaláveis que transforma um pedido em um processo pensado. Decisões melhores, execução mais forte e trabalho que você pode inspecionar.",
    discover: "Explorar as skills",
    seeHow: "Veja como funciona",
    lab: "O PRODUTO NA PRÁTICA",
    labTitle: "Uma skill muda a forma de fazer o trabalho.",
    labText: "Escolha uma disciplina. Acompanhe o pedido, o método e o resultado. Cada exemplo leva a uma skill real que você pode instalar.",
    thesisLabel: "POR QUE EXISTE",
    thesis: <>Um bom resultado começa <em>antes</em> da primeira entrega.</>,
    thesisText: "As skills dão ao agente um caminho repetível para investigar, decidir, construir e verificar. Instruções, limites e código-fonte ficam abertos para inspeção.",
    principles: [
      { title: "Entenda o pedido", text: "Estabeleça contexto e restrições antes de criar qualquer coisa." },
      { title: "Trabalhe com método", text: "Siga um processo próprio para a tarefa, em vez de uma resposta genérica." },
      { title: "Mostre as evidências", text: "Torne as decisões e o resultado possíveis de revisar." },
    ],
    workLabel: "FEITO COM SKILLS",
    workTitle: <>Trabalho real.<br /><em>Decisões rastreáveis.</em></>,
    workText: "Veja onde estes métodos foram usados em projetos reais. Cada caso documenta o problema, as decisões e as evidências.",
    viewCase: "Ler o case",
    allCases: "Explorar todos os cases",
    skillsLabel: "COMECE POR AQUI",
    skillsTitle: "Escolha o recurso que seu próximo projeto precisa.",
    skillsText: "Uma skill para uma tarefa específica. Cada uma tem escopo, instruções e seu próprio caminho de instalação.",
    skillAction: "Conhecer a skill",
    allSkills: "Ver todas as skills",
    packsLabel: "VÁ ALÉM",
    packsTitle: "Quando o trabalho precisa de mais de um método.",
    packsText: "Os packs conectam skills relacionadas em um fluxo mais completo. Comece por uma disciplina e amplie quando o projeto pedir.",
    packAction: "Conhecer o pack",
    allPacks: "Ver todos os packs",
    closingLabel: "SEU PRÓXIMO PROJETO COMEÇA AQUI",
    closingTitle: <>Dê ao trabalho<br /><em>um processo melhor.</em></>,
    closingText: "Explore uma skill, inspecione sua origem e leve o método para o seu workflow.",
    install: "Como instalar",
    source: "Ver código-fonte",
    caseFallback: "Um relato inspecionável do trabalho, das decisões e da verificação.",
  },
} as const;

const featuredSlugs = ["designing-ui-systems", "building-premium-nextjs-interfaces", "craft-premium-motion"] as const;
const caseSlugs = ["ping-space-voice-membership-authorization", "rocket-codebase-intelligence-cosmic-sdk-removal", "tsukihara-cinematic-motion-hardening"] as const;
const packSlugs = ["frontend-product", "motion", "application-security"] as const;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: locale === "pt-BR" ? "Agent Skills Studio — Métodos para criar melhor" : "Agent Skills Studio — Better ways to build",
    description: locale === "pt-BR" ? "Skills instaláveis para agentes de IA. Explore métodos, resultados reais e leve uma nova capacidade para seu workflow." : "Installable skills for AI agents. Explore methods, real outcomes, and bring a new capability into your workflow.",
    alternates: { canonical: `/${locale}`, languages: { en: "/en", "pt-BR": "/pt-BR", "x-default": "/en" } },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocale(params);
  const copy = content[locale];
  const catalog = getCatalog();
  const skills = getLocalizedSkills(locale);
  const packs = getLocalizedPacks(locale).filter((pack) => pack.status === "active");
  const cases = getBuiltWithSkillsCases(locale);
  const featured = featuredSlugs.map((slug) => skills.find((skill) => skill.slug === slug)).filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));
  const featuredCases = caseSlugs.map((slug) => cases.find((item) => item.slug === slug)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const featuredPacks = packSlugs.map((slug) => packs.find((pack) => pack.slug === slug)).filter((pack): pack is NonNullable<typeof pack> => Boolean(pack));
  const href = (path: string) => `/${locale}${path}` as Route;

  return (
    <div className="product-home">
      <section className="product-hero" aria-labelledby="product-title">
        <div className="product-hero__orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="product-shell product-hero__inner">
          <div className="product-hero__copy">
            <p className="product-kicker"><span className="product-kicker__dot" />{copy.marker}</p>
            <h1 id="product-title" aria-label={locale === "pt-BR" ? "Seu agente pode fazer mais. Dê a ele um método." : "Your agent can do more. Give it a way to."}>{copy.headline}</h1>
            <p className="product-hero__intro">{copy.intro}</p>
            <div className="product-actions">
              <Link className="product-button product-button--white" href={href("/skills")}>{copy.discover}<span aria-hidden="true">↗</span></Link>
              <a className="product-text-link" href="#product-demo">{copy.seeHow}<span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="product-hero__graphic" aria-hidden="true">
            <span className="product-hero__graphic-ring" /><span className="product-hero__graphic-core">a<span>✳</span>s</span>
            <span className="product-hero__graphic-label product-hero__graphic-label--top">01 / DISCOVER</span>
            <span className="product-hero__graphic-label product-hero__graphic-label--bottom">02 / BUILD</span>
          </div>
          <div className="product-hero__bottom"><span>AGENT SKILLS STUDIO</span><span>{catalog.skills.length} SKILLS&nbsp; · &nbsp;{catalog.packs.length} PACKS</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
      </section>

      <section className="product-demo" id="product-demo" aria-labelledby="demo-title">
        <div className="product-shell product-demo__grid">
          <div className="product-demo__copy">
            <p className="product-eyebrow">{copy.lab}</p>
            <h2 id="demo-title">{copy.labTitle}</h2>
            <p>{copy.labText}</p>
            <div className="product-demo__number" aria-hidden="true">01 — 03</div>
          </div>
          <MethodEngine copy={homeManifesto[locale].engine} metrics={[`${catalog.skills.length} skills`, `${catalog.packs.length} packs`]} locale={locale} />
        </div>
      </section>

      <section className="product-thesis" aria-labelledby="thesis-title">
        <div className="product-shell">
          <div className="product-thesis__lead"><p className="product-eyebrow">{copy.thesisLabel}</p><h2 id="thesis-title">{copy.thesis}</h2><p>{copy.thesisText}</p></div>
          <div className="product-thesis__steps">{copy.principles.map((item, index) => <div key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
        </div>
      </section>

      <section className="product-work" aria-labelledby="work-title">
        <div className="product-shell">
          <header className="product-section-heading"><div><p className="product-eyebrow">{copy.workLabel}</p><h2 id="work-title" aria-label={locale === "pt-BR" ? "Trabalho real. Decisões rastreáveis." : "Real work. Traceable decisions."}>{copy.workTitle}</h2></div><p>{copy.workText}</p></header>
          <div className="product-work__grid">
            {featuredCases.map((item, index) => (
              <Link className={`product-case product-case--${index + 1}`} key={item.slug} href={href(`/built-with-skills/${item.slug}`)}>
                <div className="product-case__top"><span>{item.project.name}</span><span>↗</span></div>
                <div className="product-case__art" aria-hidden="true">
                  {index === 0 && <div className="product-case__interface product-case__interface--voice"><div><i /><span>VOICE / SPACE</span><b>● LIVE</b></div><div><span>MEMBERSHIP</span><strong>VERIFIED ✓</strong></div><div><span>CREDENTIAL</span><strong>AUTHORIZED →</strong></div></div>}
                  {index === 1 && <div className="product-case__interface product-case__interface--graph"><span>LEGACY SDK</span><i /><strong>CODEBASE</strong><i /><span>SAFE REMOVAL ✓</span></div>}
                  {index === 2 && <div className="product-case__interface product-case__interface--motion"><span>FRAME 01</span><span>FRAME 02</span><span>FRAME 03</span><strong>REDUCED MOTION ✓</strong></div>}
                  <span className="product-case__trace">METHOD / {String(index + 1).padStart(2, "0")}<br />EVIDENCE → RESULT</span>
                </div>
                <div className="product-case__content"><span>{item.skills.slice(0, 2).map((slug) => slug.replaceAll("-", " ")).join(" / ")}</span><h3>{item.title}</h3><p>{item.summary || copy.caseFallback}</p><strong>{copy.viewCase} <span aria-hidden="true">↗</span></strong></div>
              </Link>
            ))}
          </div>
          <Link className="product-inline-link" href={href("/built-with-skills")}>{copy.allCases}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="product-skills" aria-labelledby="skills-title">
        <div className="product-shell">
          <header className="product-section-heading"><div><p className="product-eyebrow">{copy.skillsLabel}</p><h2 id="skills-title">{copy.skillsTitle}</h2></div><p>{copy.skillsText}</p></header>
          <div className="product-skills__list">{featured.map((skill, index) => <Link className="product-skill" href={href(`/skills/${skill.slug}`)} key={skill.slug}><span className="product-skill__number">0{index + 1}</span><div><span className="product-skill__category">{skill.category}</span><h3>{skill.displayName}</h3><p>{skill.primaryBenefit}</p></div><span className="product-skill__arrow" aria-label={copy.skillAction}>↗</span></Link>)}</div>
          <Link className="product-inline-link" href={href("/skills")}>{copy.allSkills}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="product-packs" aria-labelledby="packs-title">
        <div className="product-shell">
          <header className="product-section-heading"><div><p className="product-eyebrow">{copy.packsLabel}</p><h2 id="packs-title">{copy.packsTitle}</h2></div><p>{copy.packsText}</p></header>
          <div className="product-packs__grid">{featuredPacks.map((pack, index) => <Link className="product-pack" href={href(`/packs/${pack.slug}`)} key={pack.slug}><span className="product-pack__meta">PACK / 0{index + 1} <span>{pack.skills.length} SKILLS</span></span><span className="product-pack__symbol" aria-hidden="true">{["✳", "◌", "⌘"][index]}</span><h3>{pack.name}</h3><p>{pack.summary}</p><strong>{copy.packAction} <span aria-hidden="true">↗</span></strong></Link>)}</div>
          <Link className="product-inline-link" href={href("/packs")}>{copy.allPacks}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="product-close" aria-labelledby="close-title">
        <div className="product-shell product-close__inner"><p className="product-eyebrow">{copy.closingLabel}</p><h2 id="close-title">{copy.closingTitle}</h2><p>{copy.closingText}</p><div className="product-actions"><Link className="product-button product-button--white" href={href("/skills")}>{copy.discover}<span aria-hidden="true">↗</span></Link><Link className="product-text-link" href={href("/getting-started")}>{copy.install}<span aria-hidden="true">↗</span></Link><a className="product-text-link" href="https://github.com/jhonatan-oliveiradev/agent-skills" target="_blank" rel="noopener noreferrer">{copy.source}<span aria-hidden="true">↗</span></a></div></div>
      </section>
    </div>
  );
}
