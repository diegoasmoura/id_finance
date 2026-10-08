"use client";

import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpenText,
  ChartLineUp,
  Check,
  Compass,
  GraduationCap,
  House,
  Info,
  Lightning,
  LockKey,
  Money,
  PlayCircle,
  Question,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Target,
  TrendUp,
  Wallet,
  List,
  X,
} from "@phosphor-icons/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildProjection,
  buildScenarios,
  calculateSummary,
  type FinancialInputs,
} from "@/lib/finance/simulator";
import { authClient } from "@/lib/auth-client";
import { LearningView, type WorkspaceView } from "./learning-views";
import { SessionActions } from "./session-actions";
import { SessionGuard } from "./session-guard";

const initialInputs: FinancialInputs = {
  monthlyIncome: 5500,
  additionalIncome: 500,
  fixedExpenses: 2200,
  variableExpenses: 800,
  debtPayments: 400,
  currentReserve: 5000,
  reserveMonths: 6,
  monthlyGoal: 2100,
};

const steps = [
  { id: "income", label: "Sua renda", icon: Money },
  { id: "expenses", label: "Suas despesas", icon: Wallet },
  { id: "protection", label: "Sua proteção", icon: ShieldCheck },
  { id: "contribution", label: "Seu aporte", icon: Target },
  { id: "scenarios", label: "Seus cenários", icon: TrendUp },
] as const;

type StepId = (typeof steps)[number]["id"];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

function numberValue(value: string): number {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function InputField({
  label,
  value,
  onChange,
  hint,
  prefix = "R$",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  prefix?: string;
}) {
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    const parsedDraft = draft === "" ? 0 : numberValue(draft);
    if (parsedDraft !== value) setDraft(String(value));
  }, [draft, value]);

  return (
    <div className="input-field">
      <label htmlFor={fieldId}>{label}</label>
      <div className="input-wrap">
        <span className="input-prefix">{prefix}</span>
        <input
          aria-describedby={hint ? hintId : undefined}
          id={fieldId}
          inputMode="decimal"
          min="0"
          onChange={(event) => {
            const rawValue = event.target.value;
            setDraft(rawValue);
            onChange(numberValue(rawValue));
          }}
          step="0.01"
          type="number"
          value={draft}
        />
      </div>
      {hint ? <small id={hintId}>{hint}</small> : null}
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div
      aria-label={`${Math.round(value)}% da reserva completa`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(value)}
      className="progress-ring"
      role="progressbar"
    >
      <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={radius} />
        <circle
          className="ring-value"
          cx="50"
          cy="50"
          r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <strong>{Math.round(value)}%</strong>
    </div>
  );
}

export function InvestmentWorkspace() {
  const { data: session } = authClient.useSession();
  const accountName = session?.user.name || session?.user.email || "";
  const [activeView, setActiveView] = useState<WorkspaceView>("overview");
  const [activeStep, setActiveStep] = useState<StepId>("income");
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showRiskNotice, setShowRiskNotice] = useState(false);
  const [inputs, setInputs] = useState<FinancialInputs>(initialInputs);
  const reducedMotion = useReducedMotion();
  const summary = useMemo(() => calculateSummary(inputs), [inputs]);
  const projection = useMemo(() => buildProjection(inputs), [inputs]);
  const scenarios = useMemo(() => buildScenarios(inputs), [inputs]);
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const viewLabels: Record<WorkspaceView, string> = {
    overview: "Minha capacidade de aporte",
    journey: "Minha jornada",
    tracks: "Trilhas de estudo",
    simulators: "Simuladores",
    income: "Minha renda",
    concepts: "Ajuda e conceitos",
    lesson: "Aula: renda líquida",
  };

  function updateInput(key: keyof FinancialInputs, value: number) {
    setInputs((current) => ({ ...current, [key]: value }));
    setShowReview(false);
  }

  function moveStep(direction: number) {
    const nextIndex = Math.min(steps.length - 1, Math.max(0, activeIndex + direction));
    if (direction > 0 && activeIndex < steps.length - 1) {
      setCompletedSteps((current) => current.includes(activeStep) ? current : [...current, activeStep]);
    }
    setActiveStep(steps[nextIndex].id);
    setShowReview(false);
  }

  function navigate(view: WorkspaceView) {
    setActiveView(view);
    setMobileNavOpen(false);
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(steps.length - 1, Math.max(0, index + direction));
    setActiveStep(steps[nextIndex].id);
  }

  return (
    <main className="app-shell">
      <SessionGuard />
      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="brand-lockup">
          <Image alt="ID Estratégia Financeira" className="brand-logo" height={52} src="/ID Estratégia Financeira Logo.png" width={190} />
          <button aria-label="Fechar menu" className="mobile-menu-close" onClick={() => setMobileNavOpen(false)} type="button"><X size={21} /></button>
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <p className="nav-label">Workspace</p>
          <button className={`nav-item ${activeView === "overview" ? "active" : ""}`} onClick={() => navigate("overview")} type="button">
            <House size={18} weight="duotone" />
            Visão geral
          </button>
          <button className={`nav-item ${activeView === "journey" ? "active" : ""}`} onClick={() => navigate("journey")} type="button">
            <Compass size={18} weight="duotone" />
            Minha jornada
            <span className="nav-count">1</span>
          </button>
          <button className={`nav-item ${activeView === "tracks" ? "active" : ""}`} onClick={() => navigate("tracks")} type="button">
            <BookOpenText size={18} weight="duotone" />
            Trilhas de estudo
          </button>
          <button className={`nav-item ${activeView === "simulators" ? "active" : ""}`} onClick={() => navigate("simulators")} type="button">
            <ChartLineUp size={18} weight="duotone" />
            Simuladores
          </button>
        </nav>

        <nav className="main-nav secondary-nav" aria-label="Recursos">
          <p className="nav-label">Seu espaço</p>
          <button className={`nav-item ${activeView === "income" ? "active" : ""}`} onClick={() => navigate("income")} type="button">
            <Wallet size={18} weight="duotone" />
            Minha renda
          </button>
          <button className={`nav-item ${activeView === "concepts" ? "active" : ""}`} onClick={() => navigate("concepts")} type="button">
            <Question size={18} weight="duotone" />
            Ajuda e conceitos
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="mini-progress">
            <div className="mini-progress-top">
              <span>Trilha inicial</span>
              <strong>12%</strong>
            </div>
            <div className="progress-bar"><span style={{ width: "12%" }} /></div>
            <small>Comece pelo diagnóstico da sua renda.</small>
          </div>
          <div className="profile-row">
            <div className="avatar">{accountName.slice(0, 2).toUpperCase() || "ID"}</div>
            <div><strong>{accountName || "Sua conta"}</strong><span>Aluno</span></div>
            <button type="button" className="icon-button" aria-label="Abrir opções do perfil">•••</button>
          </div>
        </div>
      </aside>

      <section className="content-area">
        <header className="topbar">
          <div className="topbar-leading"><button aria-expanded={mobileNavOpen} aria-label="Abrir menu" className="mobile-menu-button" onClick={() => setMobileNavOpen((current) => !current)} type="button">{mobileNavOpen ? <X size={20} /> : <List size={20} />}</button><div className="breadcrumb"><span>Workspace</span><ArrowRight size={14} /><strong>{viewLabels[activeView]}</strong></div></div>
          <div className="topbar-actions">
            <button className="top-action" onClick={() => navigate("concepts")} type="button"><Question size={18} /> Ajuda</button>
            <SessionActions />
          </div>
        </header>

        {activeView === "overview" ? <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow"><Lightning size={15} weight="fill" /> Laboratório de decisões</p>
              <h1>Entenda o espaço<br /><em>que sua renda cria.</em></h1>
              <p className="intro-copy">Uma leitura simples do seu fluxo mensal para transformar intenção em um próximo passo possível.</p>
            </div>
            <div className="welcome-illustration" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="illustration-spark spark-one">+</div>
              <div className="illustration-spark spark-two">✦</div>
              <div className="illustration-card">
                <TrendUp size={26} weight="duotone" />
                <span>mais clareza</span>
              </div>
            </div>
          </section>

          <section className="workspace-card simulator-card" aria-labelledby="simulator-title">
            <div className="card-topline">
              <div>
                <div className="section-kicker"><span className="kicker-dot" /> Simulador 01 / 03</div>
                <h2 id="simulator-title">Do fluxo ao aporte</h2>
                <p>Preencha as etapas para enxergar sua capacidade mensal. Os valores ficam apenas nesta tela por enquanto.</p>
              </div>
              <div className="education-note"><Info size={16} weight="fill" /><span>Simulação educacional</span></div>
            </div>

            <div className="stepper" role="tablist" aria-label="Etapas do simulador">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === activeStep;
                const isComplete = completedSteps.includes(step.id);
                return (
                  <button
                    aria-selected={isActive}
                    className={`step-button ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
                    key={step.id}
                   aria-controls={`step-panel-${step.id}`}
                   id={`step-tab-${step.id}`}
                   onClick={() => setActiveStep(step.id)}
                   onKeyDown={(event) => handleStepKeyDown(event, index)}
                   role="tab"
                   tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    <span className="step-number">{isComplete ? <Check size={14} weight="bold" /> : index + 1}</span>
                    <Icon size={17} weight={isActive ? "fill" : "regular"} />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="simulator-grid">
              <div className="inputs-column">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    aria-labelledby={`step-tab-${activeStep}`}
                    className="step-panel"
                    exit={{ opacity: 0, x: reducedMotion ? 0 : -10 }}
                    initial={{ opacity: 0, x: reducedMotion ? 0 : 10 }}
                    key={activeStep}
                    id={`step-panel-${activeStep}`}
                    role="tabpanel"
                    transition={{ duration: reducedMotion ? 0 : 0.18 }}
                  >
                    {activeStep === "income" ? (
                      <>
                        <div className="step-title"><span>01</span><div><h3>Quanto entra?</h3><p>Comece pelo que chega todos os meses.</p></div></div>
                        <InputField label="Renda principal líquida" value={inputs.monthlyIncome} onChange={(value) => updateInput("monthlyIncome", value)} hint="Depois dos descontos." />
                        <InputField label="Outras rendas médias" value={inputs.additionalIncome} onChange={(value) => updateInput("additionalIncome", value)} hint="Freelas, comissões ou aluguéis." />
                        <div className="tip-box"><Sparkle size={17} weight="fill" /><p>Use uma média conservadora se sua renda variar. O objetivo é criar um cenário que você consiga sustentar.</p></div>
                      </>
                    ) : null}
                    {activeStep === "expenses" ? (
                      <>
                        <div className="step-title"><span>02</span><div><h3>Quanto sai?</h3><p>Separe o essencial do que pode variar.</p></div></div>
                        <InputField label="Despesas fixas essenciais" value={inputs.fixedExpenses} onChange={(value) => updateInput("fixedExpenses", value)} hint="Moradia, contas e compromissos recorrentes." />
                        <InputField label="Despesas variáveis" value={inputs.variableExpenses} onChange={(value) => updateInput("variableExpenses", value)} hint="Alimentação, lazer e gastos que oscilam." />
                        <InputField label="Parcelas e dívidas" value={inputs.debtPayments} onChange={(value) => updateInput("debtPayments", value)} hint="Informe o pagamento mensal atual." />
                      </>
                    ) : null}
                    {activeStep === "protection" ? (
                      <>
                        <div className="step-title"><span>03</span><div><h3>Como está sua proteção?</h3><p>Uma reserva compra tempo para decidir com calma.</p></div></div>
                        <InputField label="Reserva já acumulada" value={inputs.currentReserve} onChange={(value) => updateInput("currentReserve", value)} hint="Informe apenas o que tem liquidez para emergências." />
                        <div className="input-field"><label htmlFor="reserve-months"><span>Meta de reserva</span></label><div className="range-value"><strong>{inputs.reserveMonths} meses</strong><span>de despesas essenciais</span></div><input aria-label="Meta de reserva em meses" className="range-input" id="reserve-months" type="range" min="1" max="12" step="1" value={inputs.reserveMonths} onChange={(event) => updateInput("reserveMonths", Number(event.target.value))} /></div>
                        <div className="tip-box warm"><ShieldCheck size={17} weight="fill" /><p>A reserva é um exercício de proteção, não uma recomendação de produto. A necessidade varia conforme cada realidade.</p></div>
                      </>
                    ) : null}
                    {activeStep === "contribution" ? (
                      <>
                        <div className="step-title"><span>04</span><div><h3>Qual é seu alvo?</h3><p>Compare a meta que você imagina com o espaço real do mês.</p></div></div>
                        <InputField label="Meta mensal de aporte" value={inputs.monthlyGoal} onChange={(value) => updateInput("monthlyGoal", value)} hint="Uma meta pode ser ajustada. Clareza vem antes de cobrança." />
                        <div className="comparison-row"><div><span>Capacidade calculada</span><strong>{formatCurrency(summary.contributionCapacity)}</strong></div><ArrowRight size={18} /><div><span>Sua meta</span><strong>{formatCurrency(inputs.monthlyGoal)}</strong></div></div>
                        <div className="tip-box"><Target size={17} weight="fill" /><p>{summary.goalGap > 0 ? `Hoje existe uma diferença de ${formatCurrency(summary.goalGap)} entre a capacidade calculada e sua meta.` : "Sua meta está dentro da capacidade calculada neste cenário."}</p></div>
                      </>
                    ) : null}
                    {activeStep === "scenarios" ? (
                      <>
                        <div className="step-title"><span>05</span><div><h3>Teste possibilidades</h3><p>Veja o efeito de pequenas mudanças no fluxo, sem prever retornos.</p></div></div>
                        <div className="scenario-list">
                          {scenarios.map((scenario) => <div className="scenario-row" key={scenario.id}><div className={`scenario-icon ${scenario.id}`}><TrendUp size={17} weight="bold" /></div><div><strong>{scenario.label}</strong><span>{formatCurrency(scenario.contributionCapacity)} de capacidade mensal</span></div><b className={scenario.change > 0 ? "positive" : "neutral-text"}>{scenario.id === "current" ? "base" : scenario.change > 0 ? `+${formatCurrency(scenario.change)}` : formatCurrency(scenario.change)}</b></div>)}
                        </div>
                        <div className="tip-box"><SlidersHorizontal size={17} weight="fill" /><p>Cenários mostram relações matemáticas. Eles não são previsão de renda nem recomendação de investimento.</p></div>
                      </>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
                <div className="step-actions"><button className="button-secondary" disabled={activeIndex === 0} onClick={() => moveStep(-1)} type="button">Voltar</button><button className="button-primary" onClick={() => activeIndex === steps.length - 1 ? setShowReview(true) : moveStep(1)} type="button">{activeIndex === steps.length - 1 ? "Revisar resultado" : "Continuar"}<ArrowRight size={17} weight="bold" /></button></div>
                {showReview ? <div className="review-message" role="status"><Check size={16} weight="bold" /><div><strong>Leitura pronta</strong><span>Você percorreu as cinco etapas. Revise os valores ao lado antes de transformar qualquer intenção em hábito.</span></div></div> : null}
              </div>

              <aside className="result-column" aria-label="Resultado atual">
                <div className="result-heading"><div><span>Leitura do seu mês</span><strong>{formatCurrency(summary.monthlyBalance)}</strong></div><div className={`balance-badge ${summary.monthlyBalance >= 0 ? "positive" : "negative"}`}>{summary.monthlyBalance >= 0 ? "saldo positivo" : "saldo apertado"}</div></div>
                 <div className="result-chart"><div className="chart-label"><span>Capacidade acumulada x meta</span><small>12 meses</small></div><div className="chart-wrap"><ResponsiveContainer height={170} width="100%"><AreaChart data={projection} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}><defs><linearGradient id="capacityFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3e8278" stopOpacity={0.3} /><stop offset="100%" stopColor="#3e8278" stopOpacity={0.02} /></linearGradient><linearGradient id="goalFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#d9775f" stopOpacity={0.16} /><stop offset="100%" stopColor="#d9775f" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#dfe7e2" strokeDasharray="3 3" vertical={false} /><XAxis axisLine={false} dataKey="label" tick={{ fill: "#667872", fontSize: 11 }} tickLine={false} /><YAxis axisLine={false} tick={{ fill: "#667872", fontSize: 11 }} tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${Math.round(value)}`} tickLine={false} /><Tooltip contentStyle={{ border: "1px solid #dfe7e2", borderRadius: 8, boxShadow: "0 8px 20px rgba(32, 54, 49, 0.08)" }} formatter={(value, name) => [formatCurrency(Number(value)), name === "capacityAccumulated" ? "Capacidade" : "Meta"]} labelFormatter={(label) => `Em ${label}`} /><Area dataKey="goalAccumulated" fill="url(#goalFill)" name="goalAccumulated" stroke="#d9775f" strokeDasharray="5 5" strokeWidth={2} type="monotone" /><Area dataKey="capacityAccumulated" fill="url(#capacityFill)" name="capacityAccumulated" stroke="#3e8278" strokeWidth={2.5} type="monotone" /></AreaChart></ResponsiveContainer></div><div className="legend"><span><i className="legend-dot teal" /> capacidade</span><span><i className="legend-dot coral" /> sua meta</span></div></div>
                <div className="result-metrics"><div><span>Taxa de poupança</span><strong>{formatPercent(summary.savingsRate)}</strong><small>do total que entra</small></div><div><span>Reserva atual</span><strong>{summary.reserveMonthsCovered.toFixed(1)} <small>meses</small></strong><small>{summary.monthsToReserve === 0 ? "meta preenchida" : `${summary.monthsToReserve ?? "--"} meses para a meta`}</small></div></div>
                <div className="reserve-summary"><ProgressRing value={summary.reserveProgress} /><div><span>Proteção financeira</span><strong>{formatCurrency(summary.currentReserve)} <small>de {formatCurrency(summary.reserveTarget)}</small></strong><p>{summary.reserveProgress >= 100 ? "Sua meta de reserva foi atingida neste cenário." : "A reserva é o próximo degrau antes de assumir mais oscilação."}</p></div></div>
                <div className="result-footnote"><Info size={15} /><span>Este resultado organiza os dados informados por você. Não é recomendação individual de investimento.</span></div>
              </aside>
            </div>
          </section>

          <section className="below-grid">
            <article className="workspace-card next-step-card"><div className="card-icon lavender"><GraduationCap size={22} weight="duotone" /></div><div><div className="section-kicker">Próximo passo</div><h3>O que muda quando você entende o fluxo?</h3><p>Uma aula curta sobre renda líquida, despesas essenciais e a diferença entre querer aportar e poder aportar.</p><button className="text-button" onClick={() => navigate("lesson")} type="button">Abrir aula <ArrowRight size={16} /></button></div><div className="lesson-duration"><PlayCircle size={15} /> 08 min</div></article>
            <article className="workspace-card locked-card"><div className="lock-top"><div className="card-icon sand"><LockKey size={21} weight="duotone" /></div><span>Em breve</span></div><h3>Laboratório de análise</h3><p>Compare métodos como Graham, Bazin e Greenblatt em estudos históricos datados.</p><div className="locked-footer"><span><LockKey size={14} /> desbloqueie após os fundamentos</span><button type="button" aria-label="Saiba mais sobre o laboratório"><Question size={17} /></button></div></article>
          </section>

          <footer className="page-footer"><span>Conteúdo educacional • dados informados nesta sessão não são armazenados</span><span>Versão de protótipo 0.1 <span className="footer-dot" /> <button onClick={() => setShowRiskNotice(true)} type="button">Aviso de risco</button></span></footer>
        </div> : <LearningView inputs={inputs} onNavigate={navigate} summary={summary} view={activeView} />}
      </section>
      {showRiskNotice ? <div className="modal-backdrop" role="presentation"><section aria-labelledby="risk-title" aria-modal="true" className="risk-modal" role="dialog"><div className="risk-modal-heading"><div className="card-icon sand"><ShieldCheck size={21} weight="duotone" /></div><button aria-label="Fechar aviso de risco" className="modal-close" onClick={() => setShowRiskNotice(false)} type="button"><X size={19} /></button></div><h2 id="risk-title">Aviso educacional</h2><p>Este protótipo tem finalidade exclusivamente educacional. Os cálculos usam os valores informados e não constituem recomendação, oferta ou solicitação de compra ou venda de ativos.</p><p>Investimentos envolvem riscos, inclusive de perda do capital. Simulações não representam promessa de retorno.</p><button className="button-primary" onClick={() => setShowRiskNotice(false)} type="button">Entendi</button></section></div> : null}
    </main>
  );
}
