import type { Route } from "next";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { EditorialMetadata } from "@/components/editorial/editorial-metadata";
import { EditorialSectionHeading } from "@/components/editorial/editorial-section-heading";
import type { BuiltWithSkillsCase } from "@/lib/built-with-skills";
import type { LocalizedPack, LocalizedSkillDetail } from "@/lib/catalog";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/messages";
import { MethodReader } from "./method-reader";
import { PromptSpecimen } from "./prompt-specimen";

interface DossierEditorialCopy {
  readonly methodLabel: string;
  readonly onThisMethod: string;
  readonly promptLabel: string;
  readonly technicalNotes: string;
}

interface RelationsCopy {
  readonly partOfSystems: string;
  readonly partOfSystemsSummary: string;
  readonly usedInEvidence: string;
  readonly usedInEvidenceSummary: string;
  readonly inspectReport: string;
}

export function MethodDossier({
  skill,
  index,
  locale,
  category,
  difficulty,
  maturity,
  relatedPacks,
  evidenceCases,
  commands,
  sourceUrl,
  detail,
  catalogCopy,
  editorialCopy,
  relationsCopy,
}: Readonly<{
  skill: LocalizedSkillDetail;
  index: number;
  locale: Locale;
  category: string;
  difficulty: string;
  maturity: string;
  relatedPacks: readonly LocalizedPack[];
  evidenceCases: readonly BuiltWithSkillsCase[];
  commands: Readonly<{ bash: string; powershell: string }>;
  sourceUrl: string;
  detail: Messages["skillDetail"];
  catalogCopy: Messages["skillsCatalog"];
  editorialCopy: DossierEditorialCopy;
  relationsCopy: RelationsCopy;
}>) {
  const ordinal = String(index + 1).padStart(2, "0");
  const sections = [
    { id: "when-to-use", label: detail.whenToUse },
    { id: "when-not-to-use", label: detail.whenNotToUse },
    { id: "use-cases", label: detail.useCases },
    { id: "example-prompts", label: detail.examplePrompts },
    { id: "installation", label: detail.installation },
    { id: "compatibility", label: detail.compatibility },
    { id: "dependencies", label: detail.dependencies },
    ...(relatedPacks.length ? [{ id: "packs", label: relationsCopy.partOfSystems }] : []),
    ...(evidenceCases.length
      ? [{ id: "used-in-evidence", label: relationsCopy.usedInEvidence }]
      : []),
    ...(skill.relatedSkills.length
      ? [{ id: "related-skills", label: detail.relatedSkills }]
      : []),
  ] as const;

  return (
    <article className="shell editorial-page method-dossier" data-method-dossier="root">
      <Link className="method-dossier__back" href={`/${locale}/skills` as Route}>
        ← {detail.back}
      </Link>

      <header className="method-dossier__hero" data-method-dossier="hero">
        <div className="method-dossier__hero-grid">
          <div className="method-dossier__ordinal" aria-hidden="true">
            {ordinal}
          </div>
          <div className="method-dossier__identity">
            <p className="method-dossier__eyebrow">
              <span>{editorialCopy.methodLabel}</span>
              <span aria-hidden="true">/</span>
              <span>{ordinal}</span>
              <span aria-hidden="true">·</span>
              <span>{category}</span>
            </p>
            <h1>{skill.displayName}</h1>
            <p className="method-dossier__summary">{skill.summary}</p>
          </div>
        </div>

        <EditorialMetadata
          className="method-dossier__metadata"
          items={[
            { label: catalogCopy.difficulty, value: difficulty },
            { label: catalogCopy.maturity, value: maturity },
            { label: detail.version, value: skill.version },
            { label: detail.updated, value: skill.updatedAt },
          ]}
        />
      </header>

      <section
        className="method-dossier__benefit"
        data-method-dossier="benefit"
        aria-labelledby="method-benefit-title"
      >
        <p id="method-benefit-title">{detail.benefit}</p>
        <strong>{skill.primaryBenefit}</strong>
      </section>

      <MethodReader label={editorialCopy.onThisMethod} sections={sections}>
        <section
          className="method-dossier__section method-dossier__section--prose"
          data-editorial-section
          id="when-to-use"
        >
          <EditorialSectionHeading title={detail.whenToUse} />
          <p>{skill.whenToUse}</p>
        </section>

        <section
          className="method-dossier__section method-dossier__section--prose"
          data-editorial-section
          id="when-not-to-use"
        >
          <EditorialSectionHeading title={detail.whenNotToUse} />
          <p>{skill.whenNotToUse}</p>
        </section>

        <section className="method-dossier__section" data-editorial-section id="use-cases">
          <EditorialSectionHeading title={detail.useCases} />
          <ol className="method-dossier__use-cases">
            {skill.useCases.map((item, itemIndex) => (
              <li key={item}>
                <span aria-hidden="true">{String(itemIndex + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="method-dossier__section" data-editorial-section id="example-prompts">
          <EditorialSectionHeading title={detail.examplePrompts} />
          <div className="method-dossier__prompts">
            {skill.examplePrompts.map((prompt, promptIndex) => (
              <PromptSpecimen
                key={prompt}
                index={promptIndex}
                prompt={prompt}
                promptLabel={editorialCopy.promptLabel}
                copyLabel={detail.copy}
                copiedLabel={detail.copied}
              />
            ))}
          </div>
        </section>

        <section
          className="method-dossier__section method-dossier__installation"
          data-editorial-section
          id="installation"
        >
          <EditorialSectionHeading title={detail.installation} summary={detail.installationSummary} />
          <div className="method-dossier__commands">
            <div>
              <p>{detail.bash}</p>
              <CopyCommand command={commands.bash} label={detail.copy} copiedLabel={detail.copied} />
            </div>
            <div>
              <p>{detail.powershell}</p>
              <CopyCommand
                command={commands.powershell}
                label={detail.copy}
                copiedLabel={detail.copied}
              />
            </div>
          </div>
        </section>

        <div className="method-dossier__technical-intro" aria-hidden="true">
          {editorialCopy.technicalNotes}
        </div>

        <section className="method-dossier__section" data-editorial-section id="compatibility">
          <EditorialSectionHeading title={detail.compatibility} />
          <dl className="method-dossier__technical-list">
            <div>
              <dt>{detail.surfaces}</dt>
              <dd>{skill.compatibility.surfaces.join(", ")}</dd>
            </div>
            <div>
              <dt>{detail.operatingSystems}</dt>
              <dd>{skill.compatibility.operatingSystems.join(", ")}</dd>
            </div>
            <div>
              <dt>{detail.installModes}</dt>
              <dd>{skill.compatibility.installModes.join(", ")}</dd>
            </div>
          </dl>
        </section>

        <section className="method-dossier__section" data-editorial-section id="dependencies">
          <EditorialSectionHeading title={detail.dependencies} />
          {skill.dependencies.length ? (
            <ul className="method-dossier__link-rows">
              {skill.dependencies.map((dependency) => (
                <li key={dependency.name}>
                  {dependency.url ? (
                    <a href={dependency.url} rel="noreferrer noopener" target="_blank">
                      {dependency.name}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span>{dependency.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="method-dossier__empty-note">{detail.noDependencies}</p>
          )}
        </section>

        {relatedPacks.length ? (
          <section className="method-dossier__section" data-editorial-section id="packs">
            <EditorialSectionHeading
              title={relationsCopy.partOfSystems}
              summary={relationsCopy.partOfSystemsSummary}
            />
            <ul className="editorial-relations__list">
              {relatedPacks.map((pack) => (
                <li className="editorial-relation-row" key={pack.slug}>
                  <Link data-interaction="connect" href={`/${locale}/packs/${pack.slug}` as Route}>
                    <span className="editorial-relation-row__eyebrow">{pack.status}</span>
                    <strong>{pack.name}</strong>
                    <span className="editorial-relation-row__meta">{pack.skills.length} methods</span>
                    <span className="editorial-relation-row__arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {evidenceCases.length ? (
          <section
            className="method-dossier__section editorial-relations"
            data-editorial-section
            data-method-evidence
            id="used-in-evidence"
          >
            <EditorialSectionHeading
              title={relationsCopy.usedInEvidence}
              summary={relationsCopy.usedInEvidenceSummary}
            />
            <ul className="editorial-relations__list">
              {evidenceCases.map((item) => (
                <li className="editorial-relation-row" key={item.slug}>
                  <Link
                    data-interaction="navigate"
                    href={`/${locale}/built-with-skills/${item.slug}` as Route}
                  >
                    <span className="editorial-relation-row__eyebrow">{item.date}</span>
                    <strong>{item.title}</strong>
                    <span className="editorial-relation-row__meta">{relationsCopy.inspectReport}</span>
                    <span className="editorial-relation-row__arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {skill.relatedSkills.length ? (
          <section className="method-dossier__section" data-editorial-section id="related-skills">
            <EditorialSectionHeading title={detail.relatedSkills} />
            <ul className="method-dossier__link-rows">
              {skill.relatedSkills.map((related) => (
                <li key={related.slug}>
                  <Link href={`/${locale}/skills/${related.slug}` as Route}>
                    {related.displayName}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </MethodReader>

      <footer className="method-dossier__source">
        <span>{editorialCopy.methodLabel} / {ordinal}</span>
        <a href={sourceUrl} rel="noreferrer noopener" target="_blank">
          {detail.source}
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </article>
  );
}
