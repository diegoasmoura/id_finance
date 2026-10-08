export type FinancialInputs = {
  monthlyIncome: number;
  additionalIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  debtPayments: number;
  currentReserve: number;
  reserveMonths: number;
  monthlyGoal: number;
};

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  monthlyBalance: number;
  savingsRate: number;
  contributionCapacity: number;
  essentialExpenses: number;
  currentReserve: number;
  reserveTarget: number;
  reserveProgress: number;
  reserveMonthsCovered: number;
  monthsToReserve: number | null;
  goalGap: number;
  monthlyGoalProgress: number;
};

export type ProjectionPoint = {
  month: number;
  label: string;
  capacityAccumulated: number;
  goalAccumulated: number;
};

export type Scenario = {
  id: "current" | "income-up" | "expenses-down";
  label: string;
  monthlyBalance: number;
  contributionCapacity: number;
  savingsRate: number;
  change: number;
};

const MONTHS_TO_PROJECT = 12;

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function calculateSummary(inputs: FinancialInputs): FinancialSummary {
  const monthlyIncome = nonNegative(inputs.monthlyIncome);
  const additionalIncome = nonNegative(inputs.additionalIncome);
  const fixedExpenses = nonNegative(inputs.fixedExpenses);
  const variableExpenses = nonNegative(inputs.variableExpenses);
  const debtPayments = nonNegative(inputs.debtPayments);
  const currentReserve = nonNegative(inputs.currentReserve);
  const reserveMonths = nonNegative(inputs.reserveMonths);
  const monthlyGoal = nonNegative(inputs.monthlyGoal);

  const totalIncome = monthlyIncome + additionalIncome;
  const totalExpenses = fixedExpenses + variableExpenses + debtPayments;
  const monthlyBalance = totalIncome - totalExpenses;
  const contributionCapacity = Math.max(0, monthlyBalance);
  const savingsRate = totalIncome > 0 ? Math.min(100, (monthlyBalance / totalIncome) * 100) : 0;
  const essentialExpenses = fixedExpenses + debtPayments;
  const reserveTarget = essentialExpenses * reserveMonths;
  const reserveProgress = reserveTarget > 0 ? percentage((currentReserve / reserveTarget) * 100) : 0;
  const reserveMonthsCovered = essentialExpenses > 0 ? currentReserve / essentialExpenses : 0;
  const reserveGap = Math.max(0, reserveTarget - currentReserve);
  const monthsToReserve = contributionCapacity > 0 && reserveGap > 0
    ? Math.ceil(reserveGap / contributionCapacity)
    : reserveGap === 0
      ? 0
      : null;
  const goalGap = Math.max(0, monthlyGoal - contributionCapacity);
  const monthlyGoalProgress = monthlyGoal > 0
    ? percentage((contributionCapacity / monthlyGoal) * 100)
    : 0;

  return {
    totalIncome,
    totalExpenses,
    monthlyBalance,
    savingsRate,
    contributionCapacity,
    essentialExpenses,
    currentReserve,
    reserveTarget,
    reserveProgress,
    reserveMonthsCovered,
    monthsToReserve,
    goalGap,
    monthlyGoalProgress,
  };
}

export function buildProjection(
  inputs: FinancialInputs,
  months = MONTHS_TO_PROJECT,
): ProjectionPoint[] {
  const summary = calculateSummary(inputs);
  const contribution = summary.contributionCapacity;
  const goal = nonNegative(inputs.monthlyGoal);
  const points: ProjectionPoint[] = [];

  for (let month = 0; month <= months; month += 1) {
    points.push({
      month,
      label: month === 0 ? "Hoje" : `${month}m`,
      capacityAccumulated: Math.round(contribution * month),
      goalAccumulated: Math.round(goal * month),
    });
  }

  return points;
}

export function buildScenarios(inputs: FinancialInputs): Scenario[] {
  const base = calculateSummary(inputs);
  const incomeUp = calculateSummary({
    ...inputs,
    monthlyIncome: nonNegative(inputs.monthlyIncome) * 1.1,
  });
  const expensesDown = calculateSummary({
    ...inputs,
    variableExpenses: nonNegative(inputs.variableExpenses) * 0.9,
  });

  return [
    {
      id: "current",
      label: "Cenário atual",
      monthlyBalance: base.monthlyBalance,
      contributionCapacity: base.contributionCapacity,
      savingsRate: base.savingsRate,
      change: 0,
    },
    {
      id: "income-up",
      label: "+10% na renda principal",
      monthlyBalance: incomeUp.monthlyBalance,
      contributionCapacity: incomeUp.contributionCapacity,
      savingsRate: incomeUp.savingsRate,
      change: incomeUp.contributionCapacity - base.contributionCapacity,
    },
    {
      id: "expenses-down",
      label: "-10% nas despesas variáveis",
      monthlyBalance: expensesDown.monthlyBalance,
      contributionCapacity: expensesDown.contributionCapacity,
      savingsRate: expensesDown.savingsRate,
      change: expensesDown.contributionCapacity - base.contributionCapacity,
    },
  ];
}
