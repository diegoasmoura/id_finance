"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  ChartLineUp,
  CheckCircle,
  CircleNotch,
  Compass,
  FileText,
  GraduationCap,
  Info,
  LockKey,
  MagnifyingGlass,
  PlayCircle,
  ShieldCheck,
  Sparkle,
  Target,
  TrendUp,
  Wallet,
} from "@phosphor-icons/react";
import type { FinancialInputs, FinancialSummary } from "@/lib/finance/simulator";

export type WorkspaceView = "overview" | "journey" | "tracks" | "simulators" | "income" | "concepts" | "lesson";

type LearningViewProps = {
  view: Exclude<WorkspaceView, "overview">;
  summary: FinancialSummary;
  inputs: FinancialInputs;
  onNavigate: (view: WorkspaceView) => void;
};

const tracks = [
  { category: "Fundamentos", level: "Nível 0", title: "Regras do jogo", description: "CVM, riscos, instituições e fontes para aprender a verificar informações.", duration: "1 semana", tone: "teal", status: "Comece aqui", icon: ShieldCheck },
  { category: "Fundamentos", level: "Nível 1", title: "Gestão da renda", description: "Organize o fluxo, proteja sua base e encontre um aporte sustentável.", duration: "4 semanas", tone: "coral", status: "Em andamento", icon: Wallet },
  { category: "Produtos", level: "Nível 1", title: "Renda fixa e Tesouro", description: "Selic, CDI, IPCA, liquidez, crédito e marcação a mercado.", duration: "3 semanas", tone: "lavender", status: "Próxima", icon: ChartLineUp },
  { category: "Produtos", level: "Nível 2", title: "Ações", description: "Aprenda a ler empresas, indicadores e métodos sem depender de palpites.", duration: "6 semanas", tone: "sand", status: "Disponível", icon: TrendUp },
  { category: "Produtos", level: "Nível 2", title: "FIIs, Fiagro e ETFs", description: "Entenda estruturas, índices, relatórios, riscos e liquidez.", duration: "5 semanas", tone: "teal", status: "Disponível", icon: Compass },
  { category: "Análise", level: "Nível 3", title: "Análise histórica", description: "Compare Graham, Bazin, Greenblatt e outros métodos com dados datados.", duration: "4 semanas", tone: "coral", status: "Em breve", icon: MagnifyingGlass },
];

const concepts = [
  { term: "Selic", category: "Macro", definition: "Taxa básica de juros da economia brasileira, definida pelo Copom.", source: "Banco Central" },
  { term: "IPCA", category: "Inflação", definition: "Índice oficial de inflação usado para acompanhar a variação de preços ao consumidor.", source: "IBGE" },
  { term: "CVM", category: "Instituições", definition: "Autarquia que disciplina, fiscaliza e desenvolve o mercado de valores mobiliários.", source: "CVM" },
  { term: "Liquidez", category: "Risco", definition: "Facilidade e velocidade com que um investimento pode ser convertido em dinheiro.", source: "Conceito didático" },
  { term: "Volatilidade", category: "Risco", definition: "Medida de oscilação dos preços em determinado período. Não é sinônimo de perda.", source: "Conceito didático" },
  { term: "Retorno total", category: "Análise", definition: "Resultado que considera variação de preço e rendimentos recebidos no período.", source: "Conceito didático" },
];

const checkpointOptions = [
  "Existe uma capacidade matemática de R$ 800 neste cenário, mas isso não é uma promessa nem uma obrigação.",
  "A pessoa deve investir exatamente R$ 800 em um ativo de maior retorno.",
  "O saldo mensal é suficiente para garantir uma renda futura.",
];

const quizQuestions = [
  {
    id: "balance",
    prompt: "Como encontrar o saldo mensal em um primeiro diagnóstico?",
    options: [
      "Renda líquida menos despesas totais.",
      "Renda bruta multiplicada pela inflação.",
      "Reserva atual dividida pelo número de meses.",
    ],
    answer: 0,
    explanation: "O saldo mensal é uma fotografia do fluxo: tudo o que entra menos tudo o que sai no período.",
  },
  {
    id: "variable-income",
    prompt: "Ao lidar com uma renda que varia, qual premissa é mais prudente para começar?",
    options: [
      "Usar o melhor mês do último ano.",
      "Usar uma média conservadora e revisar com frequência.",
      "Ignorar a renda variável até ela ficar estável.",
    ],
    answer: 1,
    explanation: "Uma média conservadora reduz o risco de assumir um compromisso que depende de um mês fora do padrão.",
  },
  {
    id: "neutrality",
    prompt: "O que o resultado do simulador representa?",
    options: [
      "Uma indicação personalizada de qual ativo comprar.",
      "Uma previsão de rentabilidade para os próximos anos.",
      "Uma relação matemática entre as premissas informadas.",
    ],
    answer: 2,
    explanation: "O simulador organiza relações matemáticas. Decisões de investimento exigem contexto, conhecimento e avaliação profissional quando aplicável.",
  },
];

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="view-intro">
      <div>
        <p className="eyebrow"><Sparkle size={15} weight="fill" /> {eyebrow}</p>
        <h1>{title}</h1>
        <p className="intro-copy">{description}</p>
      </div>
      <div className="view-intro-mark" aria-hidden="true"><Sparkle size={22} weight="duotone" /></div>
    </section>
  );
}

function JourneyView({ onNavigate }: Pick<LearningViewProps, "onNavigate">) {
  return (
    <div className="page-content view-page">
      <PageIntro eyebrow="Mapa de aprendizagem" title="Minha jornada" description="Escolha um caminho que faça sentido para o seu momento. O diagnóstico é opcional e serve apenas para orientar seus estudos." />
      <section className="journey-grid">
        <article className="workspace-card journey-main-card">
          <div className="journey-card-heading"><div className="card-icon lavender"><Compass size={22} weight="duotone" /></div><div><div className="section-kicker">Caminho sugerido</div><h2>Comece pela base</h2></div><span className="status-pill teal">12% completo</span></div>
          <p>Organize a renda, compreenda os riscos e só então avance para comparar produtos e métodos de análise.</p>
          <div className="journey-line"><span className="journey-node done"><CheckCircle size={15} weight="fill" /></span><div><strong>Regras do jogo</strong><small>Fontes, riscos e limites da plataforma</small></div><span className="journey-state">feito</span></div>
          <div className="journey-line"><span className="journey-node current"><CircleNotch size={15} weight="bold" /></span><div><strong>Gestão da renda</strong><small>Do fluxo mensal ao aporte possível</small></div><span className="journey-state current-text">agora</span></div>
          <div className="journey-line muted"><span className="journey-node"><LockKey size={14} /></span><div><strong>Renda fixa e Tesouro</strong><small>Desbloqueia após a base</small></div><span className="journey-state">depois</span></div>
          <button className="button-primary journey-button" onClick={() => onNavigate("overview")} type="button">Continuar simulador <ArrowRight size={17} weight="bold" /></button>
        </article>
        <aside className="workspace-card diagnostic-card"><div className="card-icon sand"><Target size={22} weight="duotone" /></div><div className="section-kicker">Opcional</div><h3>Descubra por onde começar</h3><p>Responda algumas perguntas sobre conhecimento e objetivos. Isso não é suitability e não indica ativos.</p><button className="button-secondary" type="button">Fazer diagnóstico <ArrowRight size={16} /></button></aside>
      </section>
    </div>
  );
}

function TracksView({ onNavigate }: Pick<LearningViewProps, "onNavigate">) {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const filters = ["Todas", "Fundamentos", "Produtos", "Análise"];
  const visibleTracks = useMemo(
    () => activeFilter === "Todas" ? tracks : tracks.filter((track) => track.category === activeFilter),
    [activeFilter],
  );

  return (
    <div className="page-content view-page">
      <PageIntro eyebrow="Biblioteca de estudos" title="Trilhas de estudo" description="Aprenda por caminhos curtos e conectados. Você escolhe o assunto; a plataforma mostra os fundamentos que ajudam a aproveitá-lo melhor." />
      <div className="catalog-toolbar">{filters.map((filter) => <button aria-pressed={activeFilter === filter} className={`catalog-filter ${activeFilter === filter ? "active" : ""}`} key={filter} onClick={() => setActiveFilter(filter)} type="button">{filter}</button>)}<span className="catalog-count">{visibleTracks.length} trilhas exibidas</span></div>
      <section className="track-grid">
        {visibleTracks.map((track) => { const Icon = track.icon; return <article className="workspace-card track-card" key={track.title}><div className="track-card-top"><div className={`card-icon ${track.tone}`}><Icon size={21} weight="duotone" /></div><span className={`status-pill ${track.tone}`}>{track.status}</span></div><span className="track-level">{track.level}</span><h2>{track.title}</h2><p>{track.description}</p><div className="track-footer"><span>{track.duration}</span>{track.status === "Em andamento" ? <button className="text-button" onClick={() => onNavigate("overview")} type="button">Continuar <ArrowRight size={15} /></button> : <button className="text-button" onClick={() => onNavigate("journey")} type="button">Ver trilha <ArrowRight size={15} /></button>}</div></article>; })}
      </section>
      <div className="source-note"><Info size={16} /><span>Os conteúdos sobre regras, impostos e produtos terão fonte, data de revisão e finalidade didática visíveis em cada aula.</span></div>
    </div>
  );
}

function SimulatorsView({ onNavigate }: Pick<LearningViewProps, "onNavigate">) {
  const simulatorCards = [
    { title: "Orçamento e aporte", description: "Entenda quanto entra, quanto sai e quais cenários cabem no seu mês.", status: "Aberto", icon: Wallet, tone: "teal", action: () => onNavigate("overview") },
    { title: "Juros compostos", description: "Visualize o efeito de prazo e aportes em um cenário matemático.", status: "Próximo", icon: ChartLineUp, tone: "lavender" },
    { title: "Reserva de emergência", description: "Calcule meses de proteção a partir das despesas essenciais.", status: "Próximo", icon: ShieldCheck, tone: "coral" },
    { title: "Cenários de inflação", description: "Compare poder de compra em diferentes hipóteses de inflação.", status: "Em breve", icon: TrendUp, tone: "sand" },
  ];
  return <div className="page-content view-page"><PageIntro eyebrow="Laboratórios práticos" title="Simuladores" description="Interaja com premissas e observe relações. Nenhum simulador prevê retorno ou recomenda produto." /><section className="simulator-catalog">{simulatorCards.map((simulator) => { const Icon = simulator.icon; return <article className="workspace-card simulator-tile" key={simulator.title}><div className="track-card-top"><div className={`card-icon ${simulator.tone}`}><Icon size={22} weight="duotone" /></div><span className={`status-pill ${simulator.tone}`}>{simulator.status}</span></div><h2>{simulator.title}</h2><p>{simulator.description}</p><button className={simulator.status === "Aberto" ? "button-primary" : "button-secondary"} onClick={simulator.action} type="button">{simulator.status === "Aberto" ? "Abrir laboratório" : "Conhecer objetivo"} <ArrowRight size={16} /></button></article>; })}</section><div className="method-note"><BookOpenText size={19} /><div><strong>Como usamos a matemática</strong><p>O resultado mostra a consequência das premissas informadas, não uma resposta pronta para a sua carteira.</p></div></div></div>;
}

function LessonView({ onNavigate }: Pick<LearningViewProps, "onNavigate">) {
  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const checkpointCorrect = checkpointAnswer === 0;
  const quizScore = quizQuestions.reduce((score, question) => score + (quizAnswers[question.id] === question.answer ? 1 : 0), 0);
  const passed = quizSubmitted && quizScore >= 2;

  function submitQuiz() {
    setQuizSubmitted(true);
    setLessonCompleted(false);
  }

  function resetQuiz() {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setLessonCompleted(false);
  }

  return (
    <div className="page-content view-page lesson-page">
      <div className="lesson-breadcrumb"><button className="text-button" onClick={() => onNavigate("tracks")} type="button"><ArrowRight className="back-arrow" size={15} /> Trilhas de estudo</button><span>/</span><span>Gestão da renda</span></div>
      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><PlayCircle size={15} weight="fill" /> Aula 01 / Gestão da renda</p>
          <h1>Renda líquida: o ponto de partida.</h1>
          <p className="intro-copy">Antes de falar sobre produtos, aprenda a enxergar o espaço real entre o que entra e o que sai.</p>
        </div>
        <div className="lesson-meta"><span><PlayCircle size={15} /> 08 min</span><span><Target size={15} /> 3 objetivos</span></div>
      </section>

      <div className="lesson-layout">
        <article className="workspace-card lesson-content">
          <div className="lesson-progress-row"><span>Seu progresso nesta aula</span><strong>{lessonCompleted ? "100%" : quizSubmitted ? "75%" : checkpointSubmitted ? "50%" : "25%"}</strong></div>
          <div className="progress-bar lesson-progress"><span style={{ width: lessonCompleted ? "100%" : quizSubmitted ? "75%" : checkpointSubmitted ? "50%" : "25%" }} /></div>

          <section className="lesson-objective"><div className="objective-icon"><Target size={20} weight="duotone" /></div><div><strong>Ao final desta aula, você será capaz de:</strong><ul><li>Separar renda líquida, despesas essenciais e despesas variáveis.</li><li>Calcular o saldo mensal de um cenário simples.</li><li>Diferenciar capacidade matemática de meta e recomendação.</li></ul></div></section>

          <section className="lesson-section"><span className="lesson-index">01</span><div><h2>Comece pelo fluxo, não pelo produto.</h2><p>Uma decisão financeira sustentável começa com uma pergunta simples: quanto realmente sobra depois de pagar o que mantém sua vida funcionando? A renda líquida é o valor disponível depois dos descontos. O saldo mensal é o que resta quando subtraímos as despesas do período.</p><div className="flow-visual" aria-label="Fluxo didático da renda ao saldo"><div><MoneyIcon /><strong>Renda líquida</strong><small>o que entra</small></div><ArrowRight size={18} /><div><WalletIcon /><strong>Despesas</strong><small>o que sai</small></div><ArrowRight size={18} /><div className="flow-result"><Sparkle size={19} weight="fill" /><strong>Saldo</strong><small>o espaço do mês</small></div></div><p className="lesson-callout"><Info size={16} /> Um saldo positivo não é uma garantia de retorno. É apenas o ponto de partida para organizar escolhas futuras.</p></div></section>

          <section className="lesson-section"><span className="lesson-index">02</span><div><h2>Capacidade não é obrigação.</h2><p>Se entram R$ 5.000 e saem R$ 4.200, existe um saldo matemático de R$ 800 naquele cenário. A pessoa pode transformar isso em uma meta, revisar as premissas ou priorizar proteção. O cálculo não escolhe por ela.</p><div className="example-grid"><div><span>Renda líquida</span><strong>R$ 5.000</strong></div><div><span>Despesas totais</span><strong>R$ 4.200</strong></div><div className="example-positive"><span>Saldo do cenário</span><strong>R$ 800</strong></div></div></div></section>

          <section className="checkpoint-block" aria-labelledby="checkpoint-title"><div className="checkpoint-heading"><div className="card-icon lavender"><Sparkle size={20} weight="duotone" /></div><div><span className="section-kicker">Checkpoint</span><h2 id="checkpoint-title">O que este cálculo permite concluir?</h2><p>Escolha a leitura mais cuidadosa para o exemplo acima.</p></div></div><div className="answer-options">{checkpointOptions.map((option, index) => <button aria-pressed={checkpointAnswer === index} className={`answer-option ${checkpointAnswer === index ? "selected" : ""} ${checkpointSubmitted && index === 0 ? "correct" : ""} ${checkpointSubmitted && checkpointAnswer === index && !checkpointCorrect ? "incorrect" : ""}`} key={option} onClick={() => { setCheckpointAnswer(index); setCheckpointSubmitted(false); }} type="button"><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{checkpointSubmitted && index === 0 ? <CheckCircle size={18} weight="fill" /> : null}</button>)}</div><button className="button-primary" disabled={checkpointAnswer === null} onClick={() => setCheckpointSubmitted(true)} type="button">Verificar checkpoint <CheckCircle size={16} weight="bold" /></button>{checkpointSubmitted ? <div aria-label="Feedback do checkpoint" className={`feedback-box ${checkpointCorrect ? "success" : "correction"}`} role="status">{checkpointCorrect ? <CheckCircle size={19} weight="fill" /> : <Info size={19} weight="fill" />}<div><strong>{checkpointCorrect ? "Boa leitura." : "Vamos ajustar a interpretação."}</strong><span>{checkpointCorrect ? "O simulador mostra uma relação entre entradas e saídas. O próximo passo depende das prioridades e do contexto da pessoa." : "Um saldo matemático não determina um ativo, uma meta obrigatória ou um retorno futuro."}</span></div></div> : null}</section>

          <section className="quiz-block" aria-labelledby="quiz-title"><div className="checkpoint-heading"><div className="card-icon teal"><BookOpenText size={20} weight="duotone" /></div><div><span className="section-kicker">Quiz formativo</span><h2 id="quiz-title">Teste sua compreensão.</h2><p>Você precisa de 2 acertos em 3 questões para concluir. É possível refazer.</p></div></div><div className="quiz-list">{quizQuestions.map((question, questionIndex) => <fieldset className="quiz-question" key={question.id}><legend><span>{questionIndex + 1}</span>{question.prompt}</legend><div className="quiz-options">{question.options.map((option, optionIndex) => <label className={`quiz-option ${quizAnswers[question.id] === optionIndex ? "selected" : ""} ${quizSubmitted && optionIndex === question.answer ? "correct" : ""} ${quizSubmitted && quizAnswers[question.id] === optionIndex && optionIndex !== question.answer ? "incorrect" : ""}`} key={option}><input checked={quizAnswers[question.id] === optionIndex} name={question.id} onChange={() => { setQuizAnswers((current) => ({ ...current, [question.id]: optionIndex })); setQuizSubmitted(false); }} type="radio" /><span>{option}</span>{quizSubmitted && optionIndex === question.answer ? <CheckCircle size={15} weight="fill" /> : null}</label>)}</div>{quizSubmitted ? <p className="question-explanation"><Info size={14} /> {question.explanation}</p> : null}</fieldset>)}</div><div className="quiz-actions"><button className="button-primary" disabled={Object.keys(quizAnswers).length !== quizQuestions.length} onClick={submitQuiz} type="button">{quizSubmitted ? "Atualizar resultado" : "Enviar respostas"} <ArrowRight size={16} /></button>{quizSubmitted && !passed ? <button className="button-secondary" onClick={resetQuiz} type="button">Refazer quiz</button> : null}</div>{quizSubmitted ? <div aria-label="Resultado do quiz" className={`quiz-result ${passed ? "passed" : "retry"}`} role="status"><strong>{quizScore} de {quizQuestions.length}</strong><span>{passed ? "Você demonstrou domínio suficiente para concluir esta aula." : "Revise as explicações e tente novamente."}</span></div> : null}</section>

          {passed && !lessonCompleted ? <button className="completion-banner" onClick={() => setLessonCompleted(true)} type="button"><span><CheckCircle size={21} weight="fill" /><strong>Pronto para concluir?</strong><small>Registrar esta aula como concluída nesta sessão.</small></span><ArrowRight size={18} /></button> : null}
          {lessonCompleted ? <div aria-label="Aula concluída" className="lesson-complete" role="status"><CheckCircle size={24} weight="fill" /><div><strong>Aula concluída.</strong><span>O próximo passo é praticar no simulador de orçamento.</span></div><button className="text-button" onClick={() => onNavigate("overview")} type="button">Abrir simulador <ArrowRight size={15} /></button></div> : null}
        </article>

        <aside className="lesson-aside"><article className="workspace-card lesson-side-card"><div className="section-kicker">Nesta aula</div><div className="side-list"><span><CheckCircle size={15} /> Renda líquida</span><span><CheckCircle size={15} /> Despesas essenciais</span><span><CheckCircle size={15} /> Capacidade de aporte</span></div></article><article className="workspace-card lesson-side-card source-card"><div className="card-icon sand"><FileText size={19} weight="duotone" /></div><div className="section-kicker">Fonte e revisão</div><h3>Conteúdo introdutório</h3><p>Conceitos revisados em 10/2026. Consulte as fontes oficiais e a realidade da sua situação antes de tomar decisões.</p><small>Referências: Banco Central do Brasil e Portal do Investidor CVM.</small></article><button className="back-to-tracks" onClick={() => onNavigate("tracks")} type="button"><ArrowRight className="back-arrow" size={15} /> Voltar para as trilhas</button></aside>
      </div>
    </div>
  );
}

function MoneyIcon() {
  return <span className="flow-icon money-flow"><Wallet size={18} weight="duotone" /></span>;
}

function WalletIcon() {
  return <span className="flow-icon expense-flow"><ShieldCheck size={18} weight="duotone" /></span>;
}

function IncomeView({ summary, inputs, onNavigate }: Pick<LearningViewProps, "summary" | "inputs" | "onNavigate">) {
  return <div className="page-content view-page"><PageIntro eyebrow="Dados da sua sessão" title="Minha renda" description="Um espaço neutro para organizar o fluxo mensal. Nesta versão os dados ficam somente no navegador e não são persistidos." /><section className="income-overview"><div className="income-hero workspace-card"><div className="card-icon teal"><Wallet size={22} weight="duotone" /></div><div className="section-kicker">Resumo atual</div><h2>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(summary.monthlyBalance)} <small>de saldo mensal</small></h2><p>Com base em {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(summary.totalIncome)} que entram e {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(summary.totalExpenses)} que saem.</p><button className="button-primary" onClick={() => onNavigate("overview")} type="button">Ajustar dados <ArrowRight size={16} /></button></div><div className="income-breakdown workspace-card"><div className="section-kicker">Leitura rápida</div><div className="income-line"><span>Renda principal</span><strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(inputs.monthlyIncome)}</strong></div><div className="income-line"><span>Outras rendas</span><strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(inputs.additionalIncome)}</strong></div><div className="income-line"><span>Reserva coberta</span><strong>{summary.reserveMonthsCovered.toFixed(1)} meses</strong></div><div className="income-line highlight"><span>Capacidade calculada</span><strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(summary.contributionCapacity)}</strong></div></div></section><section className="workspace-card privacy-panel"><ShieldCheck size={20} weight="duotone" /><div><strong>Privacidade por padrão</strong><p>Esta experiência não conecta banco ou corretora. A carteira de investimentos fica fora desta versão inicial.</p></div></section></div>;
}

function ConceptsView() {
  const [query, setQuery] = useState("");
  const visibleConcepts = concepts.filter((concept) => `${concept.term} ${concept.category} ${concept.definition}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <div className="page-content view-page"><PageIntro eyebrow="Glossário vivo" title="Ajuda e conceitos" description="Uma biblioteca curta para consultar termos durante o estudo, com linguagem direta e contexto para não confundir conceitos." /><div className="concept-search"><MagnifyingGlass size={17} /><input aria-label="Buscar conceito" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar um conceito, índice ou instituição" value={query} /></div><section className="concept-grid">{visibleConcepts.length > 0 ? visibleConcepts.map((concept) => <article className="workspace-card concept-card" key={concept.term}><div className="concept-top"><span>{concept.category}</span><FileText size={16} /></div><h2>{concept.term}</h2><p>{concept.definition}</p><small>Fonte: {concept.source}</small></article>) : <div className="empty-state"><MagnifyingGlass size={22} /><strong>Nenhum conceito encontrado</strong><span>Tente buscar por outra palavra.</span></div>}</section><div className="source-note"><Info size={16} /><span>Conceitos são explicativos. Regras, alíquotas e condições de produtos precisam ser conferidas na fonte oficial e na data da aula.</span></div></div>;
}

export function LearningView({ view, summary, inputs, onNavigate }: LearningViewProps) {
  if (view === "journey") return <JourneyView onNavigate={onNavigate} />;
  if (view === "tracks") return <TracksView onNavigate={onNavigate} />;
  if (view === "simulators") return <SimulatorsView onNavigate={onNavigate} />;
  if (view === "income") return <IncomeView inputs={inputs} onNavigate={onNavigate} summary={summary} />;
  if (view === "lesson") return <LessonView onNavigate={onNavigate} />;
  return <ConceptsView />;
}
