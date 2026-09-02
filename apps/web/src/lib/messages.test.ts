import { describe, expect, it } from "vitest";
import { messages } from "./messages";

describe("active localized message contract", () => {
  it.each(["en", "pt-BR"] as const)("keeps only the rendered Home message group for %s", (locale) => {
    expect(Object.keys(messages[locale].home).sort()).toEqual(["roadmap"]);
  });

  it.each(["en", "pt-BR"] as const)("omits the obsolete install success snapshot for %s", (locale) => {
    expect(messages[locale].gettingStarted.install).not.toHaveProperty("demoSuccess");
  });
});
