import { describe, expect, it } from "vitest";
import { getCompetencyLabel } from "./presentation";

describe("career presentation labels", () => {
  it("humanizes canonical competency ids without hiding the technical fallback", () => {
    expect(getCompetencyLabel("programming-javascript", "pt-BR")).toBe("JavaScript");
    expect(getCompetencyLabel("ui-component-modeling", "pt-BR")).toBe(
      "Modelagem de componentes de UI",
    );
    expect(getCompetencyLabel("programming-javascript", "en")).toBe("JavaScript programming");
    expect(getCompetencyLabel("unknown-future-id", "pt-BR")).toBe("unknown-future-id");
  });
});
