import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EvidencePage from "@/app/[locale]/career-lab/evidence/page";
import { buildPortfolioEvidenceContract } from "@/lib/career/portfolio-evidence";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import { buildRoadmap } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile, EvidenceRecord } from "@/lib/career/types";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider } from "./career-profile-provider";
import { EvidenceForm } from "./evidence-form";
import { EvidenceLedger, EvidenceLedgerSurface } from "./evidence-ledger";

function profileWithRoadmap(): CareerProfile {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-08T18:00:00.000Z",
  });
  return {
    ...profile,
    roadmap: buildRoadmap(profile, getRoleMap("frontend-developer")),
  };
}

function storageWith(profile: CareerProfile): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

const externalEvidence: EvidenceRecord = {
  id: "evidence:portfolio:ui",
  competencyId: "ui-component-modeling",
  class: "E4",
  sourceType: "portfolio",
  trust: "external-unverified",
  observedAt: "2026-09-08T18:20:00.000Z",
  summary: "Public repository with component boundary evidence.",
  sourceUrl: "https://github.com/example/project",
  demonstratedLevel: "proficient",
  criterionIds: [
    "ui-component-modeling.foundation",
    "ui-component-modeling.developing",
    "ui-component-modeling.proficient",
  ],
};

describe("Professional Evidence Ledger", () => {
  it("renders evidence provenance, class, competency, observed date and source URL", () => {
    render(<EvidenceLedger locale="pt-BR" evidence={[externalEvidence]} />);

    const item = screen.getByRole("article");
    expect(within(item).getByText("evidence:portfolio:ui")).toBeInTheDocument();
    expect(within(item).getByText(/e4/i)).toBeInTheDocument();
    expect(within(item).getByText(/portfólio/i)).toBeInTheDocument();
    expect(within(item).getByText(/ui-component-modeling/i)).toBeInTheDocument();
    expect(within(item).getByText(/externo.*não verificado/i)).toBeInTheDocument();
    expect(within(item).getByText(/2026-09-08/)).toBeInTheDocument();
    expect(within(item).getByRole("link", { name: /abrir fonte/i })).toHaveAttribute(
      "href",
      "https://github.com/example/project",
    );
  });

  it("teaches the evidence contract before a first record", async () => {
    render(
      <CareerProfileProvider storage={storageWith(profileWithRoadmap())}>
        <EvidenceLedgerSurface locale="en" />
      </CareerProfileProvider>,
    );

    expect(
      await screen.findByText(/evidence is an inspectable artifact tied to your current roadmap focus/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/repository change, pull request, or test report/i)).toBeInTheDocument();
    expect(screen.getByText(/provenance/i)).toBeInTheDocument();
  });

  it("turns a fully acknowledged evidence contract into traceable external-unverified records", async () => {
    const contract = buildPortfolioEvidenceContract(
      profileWithRoadmap(),
      "ui-state-and-data-flow",
    );
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<EvidenceForm locale="en" contract={contract} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/evidence summary/i), {
      target: { value: "Project demonstrates explicit state ownership and component boundaries." },
    });
    fireEvent.change(screen.getByLabelText(/repository url/i), {
      target: { value: "https://github.com/example/project" },
    });
    for (const checkbox of screen.getAllByRole("checkbox")) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole("button", { name: /record evidence/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const records = onSubmit.mock.calls[0]?.[0] as readonly EvidenceRecord[];
    expect(records).toHaveLength(2);
    expect(records.every((record) => record.class === "E4")).toBe(true);
    expect(records.every((record) => record.sourceType === "portfolio")).toBe(true);
    expect(records.every((record) => record.trust === "external-unverified")).toBe(true);
    expect(records.map((record) => record.competencyId)).toEqual([
      "ui-component-modeling",
      "state-data-flow",
    ]);
  });

  it("publishes the localized Evidence route and enables Evidence in Career Lab navigation", async () => {
    const profile = profileWithRoadmap();
    const page = await EvidencePage({ params: Promise.resolve({ locale: "pt-BR" }) });

    render(
      <CareerProfileProvider storage={storageWith(profile)}>
        <CareerLabShell locale="pt-BR">{page}</CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("link", { name: /evidências/i })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/evidence",
    );
    expect(screen.getByRole("heading", { name: /evidência profissional/i })).toBeInTheDocument();
    expect(screen.getByText(/^contrato de evidência$/i)).toBeInTheDocument();
  });
});
