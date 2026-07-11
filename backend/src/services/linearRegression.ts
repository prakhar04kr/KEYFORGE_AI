export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
}

export interface Prediction {
  currentAvg: number;
  predictedNext: number;
  predicted7Day: number;
  predicted30Day: number;
  trend: "improving" | "stable" | "declining";
  sessionsCount: number;
  slope: number;
  intercept: number;
  r2: number;
  historicalData: Array<{ session: number; actual: number; predicted: number }>;
}

export interface GoalPrediction {
  targetValue: number;
  currentAvg: number;
  estimatedDays: number;
  estimatedSessions: number;
  trend: "improving" | "stable" | "declining";
  achievable: boolean;
}

export interface LanguagePrediction {
  language: string;
  currentAvg: number;
  predictedNext: number;
  predicted30Day: number;
  trend: "improving" | "stable" | "declining";
  sessionsCount: number;
}

function leastSquares(points: Array<[number, number]>): RegressionResult {
  const n = points.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };
  if (n === 1) return { slope: 0, intercept: points[0][1], r2: 1 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (const [x, y] of points) {
    const predicted = slope * x + intercept;
    ssTot += (y - yMean) ** 2;
    ssRes += (y - predicted) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  return { slope, intercept, r2 };
}

function classifyTrend(slope: number): "improving" | "stable" | "declining" {
  if (slope > 0.3) return "improving";
  if (slope < -0.3) return "declining";
  return "stable";
}

function clamp(value: number, min = 0, max = 300): number {
  return Math.max(min, Math.min(max, value));
}

export function trainModel(values: number[]): RegressionResult {
  const points: Array<[number, number]> = values.map((v, i) => [i + 1, v]);
  return leastSquares(points);
}

export function predictWPM(wpmHistory: number[]): Prediction {
  if (wpmHistory.length === 0) {
    return {
      currentAvg: 0, predictedNext: 0, predicted7Day: 0, predicted30Day: 0,
      trend: "stable", sessionsCount: 0, slope: 0, intercept: 0, r2: 0,
      historicalData: [],
    };
  }

  const n = wpmHistory.length;
  const currentAvg = wpmHistory.reduce((a, b) => a + b, 0) / n;
  const points: Array<[number, number]> = wpmHistory.map((v, i) => [i + 1, v]);
  const { slope, intercept, r2 } = leastSquares(points);

  const sessionsPerDay = 3;
  const predictedNext = clamp(slope * (n + 1) + intercept);
  const predicted7Day = clamp(slope * (n + 7 * sessionsPerDay) + intercept);
  const predicted30Day = clamp(slope * (n + 30 * sessionsPerDay) + intercept);

  const historicalData = points.map(([x, actual]) => ({
    session: x,
    actual: Math.round(actual),
    predicted: Math.round(clamp(slope * x + intercept)),
  }));

  return {
    currentAvg: Math.round(currentAvg * 10) / 10,
    predictedNext: Math.round(predictedNext),
    predicted7Day: Math.round(predicted7Day),
    predicted30Day: Math.round(predicted30Day),
    trend: classifyTrend(slope),
    sessionsCount: n,
    slope: Math.round(slope * 1000) / 1000,
    intercept: Math.round(intercept * 10) / 10,
    r2: Math.round(r2 * 1000) / 1000,
    historicalData,
  };
}

export function predictAccuracy(accuracyHistory: number[]): Prediction {
  if (accuracyHistory.length === 0) {
    return {
      currentAvg: 0, predictedNext: 0, predicted7Day: 0, predicted30Day: 0,
      trend: "stable", sessionsCount: 0, slope: 0, intercept: 0, r2: 0,
      historicalData: [],
    };
  }

  const n = accuracyHistory.length;
  const currentAvg = accuracyHistory.reduce((a, b) => a + b, 0) / n;
  const points: Array<[number, number]> = accuracyHistory.map((v, i) => [i + 1, v]);
  const { slope, intercept, r2 } = leastSquares(points);

  const sessionsPerDay = 3;
  const predictedNext = clamp(slope * (n + 1) + intercept, 0, 100);
  const predicted7Day = clamp(slope * (n + 7 * sessionsPerDay) + intercept, 0, 100);
  const predicted30Day = clamp(slope * (n + 30 * sessionsPerDay) + intercept, 0, 100);

  const historicalData = points.map(([x, actual]) => ({
    session: x,
    actual: Math.round(actual),
    predicted: Math.round(clamp(slope * x + intercept, 0, 100)),
  }));

  return {
    currentAvg: Math.round(currentAvg * 10) / 10,
    predictedNext: Math.round(predictedNext * 10) / 10,
    predicted7Day: Math.round(predicted7Day * 10) / 10,
    predicted30Day: Math.round(predicted30Day * 10) / 10,
    trend: classifyTrend(slope),
    sessionsCount: n,
    slope: Math.round(slope * 1000) / 1000,
    intercept: Math.round(intercept * 10) / 10,
    r2: Math.round(r2 * 1000) / 1000,
    historicalData,
  };
}

export function estimateTargetDate(wpmHistory: number[], targetWpm: number): GoalPrediction {
  const n = wpmHistory.length;
  const currentAvg = n > 0 ? wpmHistory.reduce((a, b) => a + b, 0) / n : 0;
  const { slope, intercept } = trainModel(wpmHistory);
  const trend = classifyTrend(slope);

  if (slope <= 0) {
    return {
      targetValue: targetWpm, currentAvg: Math.round(currentAvg * 10) / 10,
      estimatedDays: -1, estimatedSessions: -1, trend, achievable: false,
    };
  }

  if (currentAvg >= targetWpm) {
    return {
      targetValue: targetWpm, currentAvg: Math.round(currentAvg * 10) / 10,
      estimatedDays: 0, estimatedSessions: 0, trend, achievable: true,
    };
  }

  const sessionsNeeded = Math.max(0, (targetWpm - intercept) / slope - n);
  const sessionsPerDay = 3;
  const daysNeeded = Math.ceil(sessionsNeeded / sessionsPerDay);

  return {
    targetValue: targetWpm,
    currentAvg: Math.round(currentAvg * 10) / 10,
    estimatedDays: daysNeeded,
    estimatedSessions: Math.ceil(sessionsNeeded),
    trend,
    achievable: daysNeeded <= 365,
  };
}

export function calculateTrend(values: number[]): "improving" | "stable" | "declining" {
  const { slope } = trainModel(values);
  return classifyTrend(slope);
}

export function getLanguagePredictions(
  tests: Array<{ language: string; wpm: number }>
): LanguagePrediction[] {
  const byLanguage: Record<string, number[]> = {};
  for (const t of tests) {
    if (!byLanguage[t.language]) byLanguage[t.language] = [];
    byLanguage[t.language].push(t.wpm);
  }

  return Object.entries(byLanguage)
    .filter(([, wpms]) => wpms.length >= 2)
    .map(([language, wpms]) => {
      const pred = predictWPM(wpms);
      return {
        language,
        currentAvg: pred.currentAvg,
        predictedNext: pred.predictedNext,
        predicted30Day: pred.predicted30Day,
        trend: pred.trend,
        sessionsCount: wpms.length,
      };
    })
    .sort((a, b) => b.sessionsCount - a.sessionsCount);
}
