import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { InstallationTerminal } from "@/components/installation-terminal";
import { resolveLocale } from "@/components/foundation-route";
import { installationCommands } from "@/lib/installation";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;
type GettingStartedCopy = typeof messages.en.gettingStarted;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = messages[locale].gettingStarted;
  return {
    title: copy.title,
    description: copy.summary,
    alternates: {
      canonical: `/${locale}/getting-started`,
      languages: { en: "/en/getting-started", "pt-BR": "/pt-BR/getting-started", "x-default": "/en/getting-started" },
    },
  };
}

export default async function GettingStartedPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale].gettingStarted;
  return (
    <article className="shell getting-started-page">
      <header className="getting-started__hero">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.summary}</p>
      </header>
      <section className="getting-started__requirements" aria-labelledby="requirements-title">
        <div><p className="eyebrow">01</p><h2 id="requirements-title">{copy.requirements.title}</h2></div>
        <ul>{copy.requirements.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="getting-started__section" aria-labelledby="install-title">
        <SectionHeading number="02" id="install-title" title={copy.install.title} summary={copy.install.summary} />
        <InstallationTerminal command={installationCommands.complete.bash} label={copy.install.demoLabel} success={copy.install.demoSuccess} />
        <div className="install-option-grid">
          <InstallOption copy={copy} title={copy.install.complete} commands={installationCommands.complete} />
          <InstallOption copy={copy} title={copy.install.skill} commands={installationCommands.skill} />
          <InstallOption copy={copy} title={copy.install.pack} commands={installationCommands.pack} />
        </div>
      </section>
      <section className="getting-started__section getting-started__verify" aria-labelledby="verify-title">
        <SectionHeading number="03" id="verify-title" title={copy.verify.title} summary={copy.verify.summary} />
        <div className="command-pair">
          <Command copy={copy} label={copy.bash} command={installationCommands.verify.bash} />
          <Command copy={copy} label={copy.powershell} command={installationCommands.verify.powershell} />
        </div>
      </section>
      <section className="maintenance-grid" aria-label={copy.maintenanceLabel}>
        <article><p className="eyebrow">04</p><h2>{copy.update.title}</h2><p>{copy.update.summary}</p></article>
        <article><p className="eyebrow">05</p><h2>{copy.remove.title}</h2><p>{copy.remove.summary}</p></article>
      </section>
      <aside className="getting-started__next">
        <div><p className="eyebrow">{copy.next.eyebrow}</p><h2>{copy.next.title}</h2><p>{copy.next.summary}</p></div>
        <div className="hero-actions">
          <Link className="button button--primary" href={`/${locale}/skills`}>{copy.next.skills}</Link>
          <Link className="button button--secondary" href={`/${locale}/packs`}>{copy.next.packs}</Link>
        </div>
      </aside>
    </article>
  );
}

function SectionHeading({ number, id, title, summary }: Readonly<{ number: string; id: string; title: string; summary: string }>) {
  return <div className="getting-started__section-heading"><p className="eyebrow">{number}</p><h2 id={id}>{title}</h2><p>{summary}</p></div>;
}

function InstallOption({ copy, title, commands }: Readonly<{ copy: GettingStartedCopy; title: string; commands: Readonly<{ bash: string; powershell: string }> }>) {
  return <article className="install-option"><h3>{title}</h3><Command copy={copy} label={copy.bash} command={commands.bash} /><Command copy={copy} label={copy.powershell} command={commands.powershell} /></article>;
}

function Command({ copy, label, command }: Readonly<{ copy: GettingStartedCopy; label: string; command: string }>) {
  return <div className="command-entry"><p>{label}</p><CopyCommand command={command} label={copy.copy} copiedLabel={copy.copied} /></div>;
}
