import { render, within } from "@testing-library/react";
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

  it("keeps pack installation in one canonical section with remote install first-class", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "application-security" }),
      }),
    );

    const installations = container.querySelectorAll<HTMLElement>("#installation");
    const callouts = container.querySelectorAll<HTMLElement>("[data-remote-install]");

    expect(installations).toHaveLength(1);
    expect(callouts).toHaveLength(1);
    expect(installations[0]).toContainElement(callouts[0]);
    expect(
      within(installations[0]).getByText(
        `${remote} | bash -s -- --pack application-security`,
      ),
    ).toBeInTheDocument();
    expect(
      within(installations[0]).getByText("./install.sh --pack application-security"),
    ).toBeInTheDocument();
    expect(
      within(installations[0]).getByText("./install.ps1 --pack application-security"),
    ).toBeInTheDocument();
  });

  it("keeps skill installation in one canonical section with remote install first-class", async () => {
    const { container } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale: "en", slug: "reviewing-web-security" }),
      }),
    );

    const installations = container.querySelectorAll<HTMLElement>("#installation");
    const callouts = container.querySelectorAll<HTMLElement>("[data-remote-install]");

    expect(installations).toHaveLength(1);
    expect(callouts).toHaveLength(1);
    expect(installations[0]).toContainElement(callouts[0]);
    expect(
      within(installations[0]).getByText(
        `${remote} | bash -s -- --skill reviewing-web-security`,
      ),
    ).toBeInTheDocument();
    expect(
      within(installations[0]).getByText("./install.sh --skill reviewing-web-security"),
    ).toBeInTheDocument();
    expect(
      within(installations[0]).getByText("./install.ps1 --skill reviewing-web-security"),
    ).toBeInTheDocument();
  });
});
