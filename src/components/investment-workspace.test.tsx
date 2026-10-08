import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { InvestmentWorkspace } from "./investment-workspace";

vi.mock("recharts", () => {
  const Stub = () => <div />;

  return {
    Area: Stub,
    AreaChart: Stub,
    CartesianGrid: Stub,
    ResponsiveContainer: Stub,
    Tooltip: Stub,
    XAxis: Stub,
    YAxis: Stub,
  };
});

describe("InvestmentWorkspace", () => {
  it("navigates between the overview and learning views", () => {
    render(<InvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Trilhas de estudo" }));
    expect(screen.getByRole("heading", { name: "Trilhas de estudo" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simuladores" }));
    expect(screen.getByRole("heading", { name: "Simuladores" })).toBeInTheDocument();
  });

  it("filters the track catalog and searches concepts", () => {
    render(<InvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Trilhas de estudo" }));
    fireEvent.click(screen.getByRole("button", { name: "Produtos" }));
    expect(screen.getByRole("heading", { name: "Ações" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Gestão da renda" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ajuda e conceitos" }));
    const search = screen.getByRole("textbox", { name: "Buscar conceito" });
    fireEvent.change(search, { target: { value: "CVM" } });
    expect(screen.getByRole("heading", { name: "CVM" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Selic" })).not.toBeInTheDocument();
  });

  it("completes the simulator steps and exposes a review state", () => {
    render(<InvestmentWorkspace />);

    for (let step = 0; step < 4; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: /Continuar/ }));
    }

    fireEvent.click(screen.getByRole("button", { name: /Revisar resultado/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Leitura pronta");
  });

  it("opens the risk notice and supports the mobile menu control", () => {
    render(<InvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Aviso de risco" }));
    expect(screen.getByRole("dialog", { name: "Aviso educacional" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Entendi" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const menu = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Minha renda" }));
    expect(screen.getByRole("heading", { name: "Minha renda" })).toBeInTheDocument();
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  it("runs the lesson checkpoint, quiz retry and completion flow", () => {
    render(<InvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir aula" }));
    expect(screen.getByRole("heading", { name: "Renda líquida: o ponto de partida." })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /capacidade matemática de R\$ 800/ }));
    fireEvent.click(screen.getByRole("button", { name: /Verificar checkpoint/ }));
    expect(screen.getByRole("status", { name: "Feedback do checkpoint" })).toHaveTextContent("Boa leitura");

    const firstQuestion = screen.getByRole("group", { name: /Como encontrar o saldo/ });
    fireEvent.click(firstQuestion.querySelectorAll("input")[0]);
    const secondQuestion = screen.getByRole("group", { name: /Ao lidar com uma renda/ });
    fireEvent.click(secondQuestion.querySelectorAll("input")[1]);
    const thirdQuestion = screen.getByRole("group", { name: /O que o resultado/ });
    fireEvent.click(thirdQuestion.querySelectorAll("input")[2]);
    fireEvent.click(screen.getByRole("button", { name: /Enviar respostas/ }));
    expect(screen.getByRole("status", { name: "Resultado do quiz" })).toHaveTextContent("3 de 3");
    fireEvent.click(screen.getByRole("button", { name: /Pronto para concluir/ }));
    expect(screen.getByRole("status", { name: "Aula concluída" })).toHaveTextContent("Aula concluída");
  });
});
