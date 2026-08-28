import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { getAlternateLocale, isLocale, localizePath } from "./i18n";

describe("locale routing", () => {
  it("accepts only canonical locale identifiers", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("pt-BR")).toBe(true);
    expect(isLocale("pt-br")).toBe(false);
    expect(isLocale("fr")).toBe(false);
  });

  it("preserves a slug containing a locale token while switching locales", () => {
    expect(localizePath("/en/skills/designing-ui-systems", "pt-BR")).toBe(
      "/pt-BR/skills/designing-ui-systems",
    );
    expect(localizePath("/pt-BR", "en")).toBe("/en");
    expect(localizePath("/en/skills/enrichment", "pt-BR")).toBe(
      "/pt-BR/skills/enrichment",
    );
  });

  it("returns the other canonical locale", () => {
    expect(getAlternateLocale("en")).toBe("pt-BR");
    expect(getAlternateLocale("pt-BR")).toBe("en");
  });
});

describe("legacy locale redirects", () => {
  it("keeps lower-case Portuguese and legacy skills URLs canonical and permanent", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/pt-br/:path*",
      destination: "/pt-BR/:path*",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/skills/:path*",
      destination: "/en/skills/:path*",
      permanent: true,
    });
  });
});
