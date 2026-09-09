import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider } from "./career-profile-provider";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import { buildRoadmap } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile, NormalizedJobPosting } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";

type IngestionProps = Readonly<{
  locale: Locale;
  onIngest: (postings: readonly NormalizedJobPosting[]) => void | Promise<void>;
}>;
type AnalysisProps = Readonly<{
  locale: Locale;
  profile: CareerProfile;
  postings: readonly NormalizedJobPosting[];
  onSave?: (sample: unknown) => void | Promise<void>;
}>;
type MarketPageModule = {
  default: (props: { params: Promise<{ locale: string }> }) => Promise<ReactNode>;
};

type MarketComponentsModule = {
  MarketIngestion: ComponentType<IngestionProps>;
};
type MarketAnalysisModule = {
  MarketAnalysis: ComponentType<AnalysisProps>;
};

type MarketModule = {
  normalizeJobPosting(input: Record<string, unknown>): NormalizedJobPosting;
};

async function loadModule<T>(path: string): Promise<T> {
  try {
    return (await import(path)) as T;
  } catch (error) {
    expect(error, `expected ${path} to load after implementation`).toBeUndefined();
    return null as T;
  }
}

function profileWithRoadmap(): CareerProfile {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "Brazil",
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Career Market ingestion and analysis", () => {
  it("normalizes pasted job text locally with explicit capability provenance", async () => {
    const { MarketIngestion } = await loadModule<MarketComponentsModule>("./market-ingestion");
    const onIngest = vi.fn();
    render(<MarketIngestion locale="en" onIngest={onIngest} />);

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "Example Co" },
    });
    fireEvent.change(screen.getByLabelText(/job description/i), {
      target: { value: "Build React interfaces with TypeScript and Vitest." },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze pasted description/i }));

    await waitFor(() => expect(onIngest).toHaveBeenCalledTimes(1));
    const postings = onIngest.mock.calls[0]?.[0] as readonly NormalizedJobPosting[];
    expect(postings[0]?.source.type).toBe("pasted");
    expect(postings[0]?.postedAt).toBeNull();
    expect(postings[0]?.explicitSignals.map((signal) => signal.competencyId)).toEqual(
      expect.arrayContaining([
        "ui-component-modeling",
        "programming-typescript",
        "testing-behavior",
      ]),
    );
    expect(postings[0]?.explicitSignals.every((signal) => signal.provenance === "explicit")).toBe(true);
  });

  it("keeps URL provenance and shows the direct paste/import fallback when browser fetch fails", async () => {
    const { MarketIngestion } = await loadModule<MarketComponentsModule>("./market-ingestion");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    render(<MarketIngestion locale="en" onIngest={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "Example Co" },
    });
    const urlInput = screen.getByLabelText(/posting url/i);
    fireEvent.change(urlInput, { target: { value: "https://jobs.example/123" } });
    fireEvent.click(screen.getByRole("button", { name: /fetch url/i }));

    expect(
      await screen.findByText(/paste the job description or import a market-analysis artifact/i),
    ).toBeInTheDocument();
    expect(urlInput).toHaveValue("https://jobs.example/123");
    expect(fetch).toHaveBeenCalledWith(
      "https://jobs.example/123/",
      expect.objectContaining({ credentials: "omit" }),
    );
  });

  it("validates imported market-analysis JSON and marks normalized postings as agent-import", async () => {
    const { MarketIngestion } = await loadModule<MarketComponentsModule>("./market-ingestion");
    const onIngest = vi.fn();
    render(<MarketIngestion locale="en" onIngest={onIngest} />);
    const file = new File(["{}"], "market-analysis.json", { type: "application/json" });
    Object.defineProperty(file, "text", {
      value: vi.fn().mockResolvedValue(
        JSON.stringify({
          schemaVersion: "1",
          artifactType: "market-analysis",
          provenance: { trust: "external-unverified" },
          postings: [
            {
              title: "Frontend Engineer",
              company: "Imported Co",
              capturedAt: "2026-09-08T18:00:00.000Z",
              rawSnapshot: "React and TypeScript role.",
            },
          ],
        }),
      ),
    });

    fireEvent.change(screen.getByLabelText(/import market analysis/i), {
      target: { files: [file] },
    });

    await waitFor(() => expect(onIngest).toHaveBeenCalledTimes(1));
    const postings = onIngest.mock.calls[0]?.[0] as readonly NormalizedJobPosting[];
    expect(postings[0]?.source.type).toBe("agent-import");
    expect(screen.getByRole("status")).toHaveTextContent(/imported/i);
  });

  it("renders separate fit gaps, sample health, demand provenance and a save action", async () => {
    const { MarketAnalysis } = await loadModule<MarketAnalysisModule>("./market-analysis");
    const market = await loadModule<MarketModule>("@/lib/career/market");
    const profile = profileWithRoadmap();
    const posting = market.normalizeJobPosting({
      title: "Frontend Engineer",
      company: "Example Co",
      source: { type: "pasted", capturedAt: "2026-09-08T18:00:00.000Z" },
      rawSnapshot: "React, TypeScript and Vitest. 5+ years of experience.",
    });
    const onSave = vi.fn();

    render(
      <MarketAnalysis
        locale="en"
        profile={profile}
        postings={[posting]}
        onSave={onSave}
      />,
    );

    expect(screen.getByRole("heading", { name: /capability gaps/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /evidence gaps/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /structural gaps/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hard constraints/i })).toBeInTheDocument();
    expect(screen.getByText(/explicit/i)).toBeInTheDocument();
    expect(screen.getByText(/unknown date/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /save market sample/i }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
  });

  it("publishes the localized Market route and enables it in the Career Lab rail", async () => {
    const pageModule = await loadModule<MarketPageModule>(
      "@/app/[locale]/career-lab/market/page",
    );
    const profile = profileWithRoadmap();
    const page = await pageModule.default({ params: Promise.resolve({ locale: "pt-BR" }) });

    render(
      <CareerProfileProvider storage={storageWith(profile)}>
        <CareerLabShell locale="pt-BR">{page}</CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("link", { name: /mercado/i })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/market",
    );
    expect(screen.getByRole("heading", { name: /inteligência de mercado/i })).toBeInTheDocument();
  });
});
