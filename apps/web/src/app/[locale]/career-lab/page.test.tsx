import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CareerLabShell } from "@/components/career/career-lab-shell";
import { CareerProfileProvider } from "@/components/career/career-profile-provider";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { Locale } from "@/lib/locales";
import CareerLabPage from "./page";

function storageWith(profile: Awaited<ReturnType<CareerStorage["load"]>>): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

type CareerLabRoute = (props: {
  params: Promise<{ locale: string }>;
}) => ReactNode | Promise<ReactNode>;

async function renderRoot(
  profile: Awaited<ReturnType<CareerStorage["load"]>>,
  locale: Locale = "en",
) {
  const route = CareerLabPage as unknown as CareerLabRoute;
  const page = await route({ params: Promise.resolve({ locale }) });

  render(
    <CareerProfileProvider storage={storageWith(profile)}>
      <CareerLabShell locale={locale}>{page}</CareerLabShell>
    </CareerProfileProvider>,
  );
}

describe("Career Lab root route", () => {
  it("renders the intentional onboarding empty state when no local profile exists", async () => {
    await renderRoot(null);

    expect(await screen.findByRole("link", { name: /start onboarding/i })).toHaveAttribute(
      "href",
      "/en/career-lab/onboarding",
    );
    expect(screen.getAllByRole("link", { name: "Developer Career Pack" })).not.toHaveLength(0);
  });

  it("renders the overview when a valid local profile exists", async () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-09T12:00:00.000Z",
    });

    await renderRoot(profile, "pt-BR");

    expect(
      await screen.findByRole("heading", { name: /desenvolvedor frontend/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/mercado-alvo: br/i)).toBeInTheDocument();
  });
});
