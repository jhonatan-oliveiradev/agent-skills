import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleRedirect } from "./locale-redirect";

function renderRedirect({
  languages,
  storedLocale,
}: {
  languages: readonly string[];
  storedLocale?: string;
}) {
  if (storedLocale === undefined) {
    window.localStorage.removeItem("agent-skills-locale");
  } else {
    window.localStorage.setItem("agent-skills-locale", storedLocale);
  }

  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages as string[]);
  const replace = vi.fn();
  render(<LocaleRedirect location={{ replace }} />);
  return replace;
}

describe("LocaleRedirect", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("uses a valid saved preference before browser languages", () => {
    const replace = renderRedirect({ languages: ["en-US"], storedLocale: "pt-BR" });

    expect(replace).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith("/pt-BR");
  });

  it("ignores an invalid saved preference", () => {
    const replace = renderRedirect({ languages: ["en-US"], storedLocale: "fr" });

    expect(replace).toHaveBeenCalledWith("/en");
  });

  it("uses navigator.languages when any preference is Portuguese", () => {
    const replace = renderRedirect({ languages: ["en-US", "pt-PT"] });

    expect(replace).toHaveBeenCalledWith("/pt-BR");
  });

  it("falls back to English through location.replace", () => {
    const replace = renderRedirect({ languages: ["de-DE", "en-GB"] });

    expect(replace).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith("/en");
  });
});
