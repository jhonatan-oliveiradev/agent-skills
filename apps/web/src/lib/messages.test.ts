import { describe, expect, it } from "vitest";
import { messages } from "./messages";

describe("active localized message contract", () => {
  it.each(["en", "pt-BR"] as const)("keeps only active Home and install copy for %s", (locale) => {
    expect(Object.keys(messages[locale].home).sort()).toEqual(["roadmap"]);
    expect(messages[locale].gettingStarted.install).not.toHaveProperty("demoSuccess");
  });
});
