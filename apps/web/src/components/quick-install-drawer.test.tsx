// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { QuickInstallDrawer } from "./quick-install-drawer";

it("opens the quick install guide with distinct remote, Bash and PowerShell commands", async () => {
  render(<QuickInstallDrawer locale="pt-BR" name="Design de produto" remoteCommand="curl install.example/skill" commands={{ bash: "./install.sh --skill design", powershell: ".\\install.ps1 -Skill design" }} />);

  fireEvent.click(screen.getByRole("button", { name: "Instalar agora" }));
  const dialog = await screen.findByRole("dialog", { name: "Design de produto" });
  expect(dialog).toHaveTextContent("Instalação rápida · Bash / WSL / macOS");
  expect(dialog).toHaveTextContent("Repositório local · Windows PowerShell");
  expect(dialog).toHaveTextContent("./install.sh --skill design");
  expect(dialog).toHaveTextContent(".\\install.ps1 -Skill design");
  expect(dialog.querySelectorAll("button[aria-label='Copiar']")).toHaveLength(3);

  fireEvent.click(screen.getByRole("button", { name: "Fechar guia de instalação" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
