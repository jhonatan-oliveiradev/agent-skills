import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
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
  it("renders an editorial Career Profile entry as an operational career workbench", async () => {
    await renderRoot(null);

    expect(
      await screen.findByRole("heading", { name: "Build a real map of your career." }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / Role")).toBeInTheDocument();
    expect(screen.getByText("02 / Market")).toBeInTheDocument();
    expect(screen.getByText("03 / Capacity")).toBeInTheDocument();

    const currentStep = screen.getByRole("complementary", { name: "Current step" });
    expect(within(currentStep).getByRole("heading", { name: "Profile" })).toBeInTheDocument();
    expect(within(currentStep).getByText("Define your role, market and weekly capacity.")).toBeInTheDocument();
    expect(within(currentStep).getByRole("link", { name: "Start Career Profile" })).toHaveAttribute(
      "href",
      "/en/career-lab/onboarding",
    );

    const system = screen.getByRole("list", { name: "Your career system" });
    const stages = within(system).getAllByRole("listitem");
    expect(stages).toHaveLength(5);
    expect(stages[0]).toHaveAttribute("aria-current", "step");
    expect(system).toHaveTextContent("Profile");
    expect(system).toHaveTextContent("Not started");
    expect(system).toHaveTextContent("Assessment");
    expect(system).toHaveTextContent("Waiting for profile");
    expect(system).toHaveTextContent("Roadmap");
    expect(system).toHaveTextContent("Waiting for assessment");
    expect(system).toHaveTextContent("Evidence");
    expect(system).toHaveTextContent("0 evidence records");
    expect(system).toHaveTextContent("Market");
    expect(system).toHaveTextContent("Waiting for target role");
    expect(screen.getAllByRole("link", { name: "Developer Career Pack" })).not.toHaveLength(0);
  });

  it("localizes the operational workbench entry for pt-BR", async () => {
    await renderRoot(null, "pt-BR");

    expect(
      await screen.findByRole("heading", { name: "Construa um mapa real da sua carreira." }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / Função")).toBeInTheDocument();
    expect(screen.getByText("02 / Mercado")).toBeInTheDocument();
    expect(screen.getByText("03 / Capacidade")).toBeInTheDocument();

    const currentStep = screen.getByRole("complementary", { name: "Etapa atual" });
    expect(within(currentStep).getByRole("heading", { name: "Perfil" })).toBeInTheDocument();
    expect(
      within(currentStep).getByText("Defina sua função, mercado e capacidade semanal."),
    ).toBeInTheDocument();
    expect(within(currentStep).getByRole("link", { name: "Iniciar Career Profile" })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/onboarding",
    );

    const system = screen.getByRole("list", { name: "Seu sistema de carreira" });
    const stages = within(system).getAllByRole("listitem");
    expect(stages).toHaveLength(5);
    expect(stages[0]).toHaveAttribute("aria-current", "step");
    expect(system).toHaveTextContent("Perfil");
    expect(system).toHaveTextContent("Não iniciado");
    expect(system).toHaveTextContent("Aguardando perfil");
    expect(system).toHaveTextContent("Aguardando avaliação");
    expect(system).toHaveTextContent("0 evidências");
    expect(system).toHaveTextContent("Aguardando função-alvo");
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
