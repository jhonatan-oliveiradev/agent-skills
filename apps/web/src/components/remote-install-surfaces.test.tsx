import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import GettingStartedPage from "@/app/[locale]/getting-started/page";
import PackDetailPage from "@/app/[locale]/packs/[slug]/page";
import SkillDetailPage from "@/app/[locale]/skills/[slug]/page";

const remote = "curl -fsSL https://skills.jhonatanoliveira.com/install";

describe("remote installation surfaces", () => {
  it("promotes the no-clone quick install while preserving the local repository fallback", async () => {
    const { container } = render(
      await GettingStartedPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    const terminal = container.querySelector<HTMLElement>("[data-terminal-demo]");
    expect(terminal).toBeInTheDocument();
    expect(terminal).toHaveTextContent(`${remote} | bash`);
    expect(terminal).toHaveTextContent("bash install.sh");
  });

  it("shows a remote pack command and retains the canonical local Bash and PowerShell commands", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "application-security" }),
      }),
    );

    const callout = container.querySelector<HTMLElement>("[data-remote-install]");
    expect(callout).toBeInTheDocument();
    expect(within(callout!).getByText(`${remote} | bash -s -- --pack application-security`)).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack application-security")).toBeInTheDocument();
    expect(screen.getByText("./install.ps1 --pack application-security")).toBeInTheDocument();
  });

  it("shows a remote skill command and retains the canonical local Bash and PowerShell commands", async () => {
    const { container } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale: "en", slug: "reviewing-web-security" }),
      }),
    );

    const callout = container.querySelector<HTMLElement>("[data-remote-install]");
    expect(callout).toBeInTheDocument();
    expect(within(callout!).getByText(`${remote} | bash -s -- --skill reviewing-web-security`)).toBeInTheDocument();
    expect(screen.getByText("./install.sh --skill reviewing-web-security")).toBeInTheDocument();
    expect(screen.getByText("./install.ps1 --skill reviewing-web-security")).toBeInTheDocument();
  });
});
