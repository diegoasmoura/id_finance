import { describe, expect, it } from "vitest";
import { buildProjection, buildScenarios, calculateSummary } from "./simulator";

const inputs = {
  monthlyIncome: 5000,
  additionalIncome: 500,
  fixedExpenses: 2200,
  variableExpenses: 800,
  debtPayments: 400,
  currentReserve: 5000,
  reserveMonths: 6,
  monthlyGoal: 1000,
};

describe("calculateSummary", () => {
  it("calculates the monthly balance, savings rate and contribution capacity", () => {
    const summary = calculateSummary(inputs);

    expect(summary.totalIncome).toBe(5500);
    expect(summary.totalExpenses).toBe(3400);
    expect(summary.monthlyBalance).toBe(2100);
    expect(summary.contributionCapacity).toBe(2100);
    expect(summary.savingsRate).toBeCloseTo(38.18, 2);
  });

  it("calculates reserve target and time to complete it", () => {
    const summary = calculateSummary(inputs);

    expect(summary.essentialExpenses).toBe(2600);
    expect(summary.reserveTarget).toBe(15600);
    expect(summary.reserveMonthsCovered).toBeCloseTo(1.92, 2);
    expect(summary.monthsToReserve).toBe(6);
  });

  it("does not return negative capacity for a negative balance", () => {
    const summary = calculateSummary({
      ...inputs,
      monthlyIncome: 2000,
      additionalIncome: 0,
    });

    expect(summary.monthlyBalance).toBe(-1400);
    expect(summary.contributionCapacity).toBe(0);
    expect(summary.savingsRate).toBeCloseTo(-70, 2);
    expect(summary.goalGap).toBe(1000);
    expect(summary.monthsToReserve).toBeNull();
  });

  it("handles an empty budget without NaN or Infinity", () => {
    const summary = calculateSummary({
      monthlyIncome: 0,
      additionalIncome: 0,
      fixedExpenses: 0,
      variableExpenses: 0,
      debtPayments: 0,
      currentReserve: 0,
      reserveMonths: 6,
      monthlyGoal: 0,
    });

    expect(summary).toEqual(expect.objectContaining({
      savingsRate: 0,
      reserveProgress: 0,
      monthsToReserve: 0,
    }));
  });
});

describe("buildProjection", () => {
  it("returns an initial point and one point per month", () => {
    const projection = buildProjection(inputs, 3);

    expect(projection).toHaveLength(4);
    expect(projection[0]).toEqual({
      month: 0,
      label: "Hoje",
      capacityAccumulated: 0,
      goalAccumulated: 0,
    });
    expect(projection[3].capacityAccumulated).toBeGreaterThan(projection[3].goalAccumulated);
  });
});

describe("buildScenarios", () => {
  it("compares current, income and expense scenarios", () => {
    const scenarios = buildScenarios(inputs);

    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].change).toBe(0);
    expect(scenarios[1].contributionCapacity).toBeGreaterThan(scenarios[0].contributionCapacity);
    expect(scenarios[2].contributionCapacity).toBeGreaterThan(scenarios[0].contributionCapacity);
  });
});
