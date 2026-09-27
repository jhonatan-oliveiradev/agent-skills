// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ThesisJourney } from "./thesis-journey";

it("lets a visitor inspect each stage of the method and reach the related skill", () => {
  render(<ThesisJourney locale="pt-BR" principles={[
    { title: "Entenda o pedido", text: "Defina o contexto." },
    { title: "Trabalhe com método", text: "Siga o processo." },
    { title: "Mostre as evidências", text: "Revise o resultado." },
  ]} />);

  const first = screen.getByRole("button", { name: /entenda o pedido/i });
  expect(first).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Um pedido ainda não é um plano.")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /mostre as evidências/i }));
  expect(first).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText("O resultado pode ser inspecionado.")).toBeInTheDocument();
  expect(screen.getByText("Registrar dúvidas e limites")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /skill de interfaces next\.js/i })).toHaveAttribute("href", "/pt-BR/skills/building-premium-nextjs-interfaces");
});
