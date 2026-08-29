import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "./copy-command";

function setClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(writeText) },
  });
}

describe("CopyCommand", () => {
  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("shows icon feedback only after the command is copied", async () => {
    setClipboard(async () => undefined);
    render(
      <CopyCommand
        command="npm run build"
        label="Copy command"
        copiedLabel="Command copied"
      />,
    );

    const button = screen.getByRole("button", { name: "Copy command" });
    expect(button).toHaveAttribute("title", "Copy command");
    expect(button.querySelector("svg")).toBeInTheDocument();

    await act(async () => fireEvent.click(button));

    expect(screen.getByRole("button", { name: "Command copied" })).toHaveAttribute(
      "title",
      "Command copied",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Command copied");

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
  });

  it("does not claim success when clipboard access fails", async () => {
    setClipboard(async () => {
      throw new Error("clipboard denied");
    });
    render(
      <CopyCommand command="npm test" label="Copy command" copiedLabel="Command copied" />,
    );

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy command" })),
    );

    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
    expect(screen.queryByText("Command copied")).not.toBeInTheDocument();
  });
});
