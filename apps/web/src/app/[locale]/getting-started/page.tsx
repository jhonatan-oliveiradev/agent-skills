import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { resolveLocale } from "@/components/foundation-route";
import { InstallationTerminal } from "@/components/installation-terminal";
import { getCatalog } from "@/lib/catalog";
import { fieldManualCopy } from "@/lib/editorial-secondary-copy";
import { chatgptDistribution, installationCommands } from "@/lib/installation";
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
      languages: {
        en: "/en/getting-started",
        "pt-BR": "/pt-BR/getting-started",
        "x-default": "/en/getting-started",
      },
    },
  };
}

export default async function GettingStartedPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale].gettingStarted;
  const manual = fieldManualCopy[locale];
  const catalog = getCatalog();

  return (
    <article className="shell getting-started-page field-manual" data-field-manual>
      <header className="getting-started__hero field-manual__hero">
        <div className="field-manual__publication" aria-label={manual.publicationLabel}>
          <span>{manual.publicationLabel}</span>
          <span>{manual.editionLabel}</span>
        </div>

        <div className="field-manual__hero-grid">
          <div className="field-manual__hero-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="field-manual__summary">{copy.summary}</p>
          </div>

          <dl className="field-manual__metadata">
            {manual.metrics.map((metric) => (
              <div className="field-manual__metadata-item" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <nav
        className="field-manual__index"
        data-field-manual-index
        aria-label={manual.indexLabel}
      >
        <p>{manual.indexLabel}</p>
        <ol>
          {manual.stages.map((stage, index) => (
            <li key={stage.id}>
              <a data-interaction="navigate" href={`#${stage.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.label}</strong>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section
        className="getting-started__requirements field-manual__stage field-manual__orientation"
        data-editorial-section
        data-field-manual-stage="orientation"
        id="orientation"
        aria-labelledby="requirements-title"
      >
        <div className="field-manual__stage-heading">
          <p className="eyebrow">01</p>
          <h2 id="requirements-title">{copy.requirements.title}</h2>
        </div>
        <ul>
          {copy.requirements.items.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="getting-started__section field-manual__stage field-manual__install"
        data-editorial-section
        data-field-manual-stage="install"
        id="install"
        aria-labelledby="install-title"
      >
        <SectionHeading
          number="02"
          id="install-title"
          title={copy.install.title}
          summary={copy.install.summary}
        />
        <InstallationTerminal
          command={installationCommands.complete.bash}
          label={copy.install.demoLabel}
          success={`${catalog.skills.length} ${manual.installationSuccessSuffix}`}
        />
        <div className="install-command-matrix">
          <InstallOption
            copy={copy}
            title={copy.install.complete}
            commands={installationCommands.complete}
          />
          <InstallOption
            copy={copy}
            title={copy.install.skill}
            commands={installationCommands.skill}
          />
          <InstallOption
            copy={copy}
            title={copy.install.pack}
            commands={installationCommands.pack}
          />
        </div>
        <InstallOption
          copy={copy}
          title={manual.claudeCodeLabel}
          commands={installationCommands.claudeCode}
        />
        <article className="installation-command-row" data-chatgpt-distribution>
          <div className="installation-command-row__label">
            <h3>{manual.chatgptLabel}</h3>
            <p>{manual.chatgptSummary}</p>
            <p>{manual.chatgptAvailability}</p>
          </div>
          <div className="command-entry">
            <p>{manual.chatgptSkillDownloadLabel}</p>
            <code>{manual.chatgptSkillDownloadPath}</code>
          </div>
          <div className="command-entry">
            <p>{manual.chatgptSkillUploadLabel}</p>
            <code>{manual.chatgptSkillUploadPath}</code>
          </div>
          <div className="command-entry">
            <p>{manual.chatgptMarketplaceLabel}</p>
            <code>{manual.chatgptMarketplacePath}</code>
            <CopyCommand
              command={chatgptDistribution.repositoryUrl}
              label={copy.copy}
              copiedLabel={copy.copied}
            />
          </div>
        </article>
      </section>

      <section
        className="getting-started__section getting-started__verify field-manual__stage field-manual__verify"
        data-editorial-section
        data-field-manual-stage="verify"
        id="verify"
        aria-labelledby="verify-title"
      >
        <SectionHeading
          number="03"
          id="verify-title"
          title={copy.verify.title}
          summary={copy.verify.summary}
        />
        <article className="installation-command-row installation-command-row--verify">
          <div className="installation-command-row__label">
            <span className="eyebrow">03A</span>
            <h3>{copy.verify.commands}</h3>
          </div>
          <Command copy={copy} label={copy.bash} command={installationCommands.verify.bash} />
          <Command
            copy={copy}
            label={copy.powershell}
            command={installationCommands.verify.powershell}
          />
        </article>
      </section>

      <section
        className="field-manual__stage field-manual__maintain"
        data-editorial-section
        data-field-manual-stage="maintain"
        id="maintain"
        aria-labelledby="maintain-title"
      >
        <div className="field-manual__stage-heading">
          <p className="eyebrow">04</p>
          <h2 id="maintain-title">{copy.maintenanceLabel}</h2>
        </div>
        <div className="maintenance-grid" aria-label={copy.maintenanceLabel}>
          <article>
            <p className="eyebrow">04A</p>
            <h3>{copy.update.title}</h3>
            <p>{copy.update.summary}</p>
          </article>
          <article>
            <p className="eyebrow">04B</p>
            <h3>{copy.remove.title}</h3>
            <p>{copy.remove.summary}</p>
          </article>
        </div>
      </section>

      <section
        className="getting-started__next field-manual__stage field-manual__continue"
        data-editorial-section
        data-field-manual-stage="continue"
        id="continue"
        aria-labelledby="continue-title"
      >
        <div>
          <p className="eyebrow">05 / {copy.next.eyebrow}</p>
          <h2 id="continue-title">{copy.next.title}</h2>
          <p>{copy.next.summary}</p>
        </div>
        <div className="hero-actions">
          <Link
            className="button button--primary"
            data-interaction="navigate"
            href={`/${locale}/skills`}
          >
            {copy.next.skills}
          </Link>
          <Link
            className="button button--secondary"
            data-interaction="navigate"
            href={`/${locale}/packs`}
          >
            {copy.next.packs}
          </Link>
        </div>
      </section>
    </article>
  );
}

function SectionHeading({
  number,
  id,
  title,
  summary,
}: Readonly<{ number: string; id: string; title: string; summary: string }>) {
  return (
    <div className="getting-started__section-heading field-manual__section-heading">
      <div>
        <p className="eyebrow">{number}</p>
        <h2 id={id}>{title}</h2>
      </div>
      <p>{summary}</p>
    </div>
  );
}

function InstallOption({
  copy,
  title,
  commands,
}: Readonly<{
  copy: GettingStartedCopy;
  title: string;
  commands: Readonly<{ bash: string; powershell: string }>;
}>) {
  return (
    <article className="installation-command-row">
      <div className="installation-command-row__label">
        <h3>{title}</h3>
      </div>
      <Command copy={copy} label={copy.bash} command={commands.bash} />
      <Command copy={copy} label={copy.powershell} command={commands.powershell} />
    </article>
  );
}

function Command({
  copy,
  label,
  command,
}: Readonly<{ copy: GettingStartedCopy; label: string; command: string }>) {
  return (
    <div className="command-entry">
      <p>{label}</p>
      <CopyCommand command={command} label={copy.copy} copiedLabel={copy.copied} />
    </div>
  );
}
