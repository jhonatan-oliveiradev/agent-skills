import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("composes conditional classes and keeps the last Tailwind conflict", () => {
    expect(cn("px-2 text-muted", false && "hidden", "px-4 text-accent")).toBe(
      "px-4 text-accent",
    );
  });
});
