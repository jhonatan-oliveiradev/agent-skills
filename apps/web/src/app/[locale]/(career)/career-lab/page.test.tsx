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
  it("renders an editorial Career Profile entry as a stateful career workspace", async () => {
    await renderRoot(null);

    expect(
      await screen.findByRole("heading", { name: "Build a real map of your career." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start Career Profile" })).toHaveAttribute(
      "href",
      "/en/career-lab/onboarding",
    );
    expect(screen.getByText("01 / Role")).toBeInTheDocument();
    expect(screen.getByText("02 / Market")).toBeInTheDocument();
    expect(screen.getByText("03 / Capacity")).toBeInTheDocument();

    const system = screen.getByRole("list", { name: "Your career system" });
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

  it("localizes the stateful workspace entry for pt-BR", async () => {
    await renderRoot(null, "pt-BR");

    expect(
      await screen.findByRole("heading", { name: "Construa um mapa real da sua carreira." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iniciar Career Profile" })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/onboarding",
    );
    expect(screen.getByText("01 / Função")).toBeInTheDocument();
    expect(screen.getByText("02 / Mercado")).toBeInTheDocument();
    expect(screen.getByText("03 / Capacidade")).toBeInTheDocument();

    const system = screen.getByRole("list", { name: "Seu sistema de carreira" });
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
