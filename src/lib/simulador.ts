export type RiskProfile = {
  id: 'conservador' | 'balanceado' | 'dinamico';
  name: string;
  rate: number;
  description: string;
  color: string;
};

export const RISK_PROFILES: RiskProfile[] = [
  {
    id: 'conservador',
    name: 'Conservador',
    rate: 0.06,
    description: 'Riesgo controlado, crecimiento estable',
    color: 'emerald',
  },
  {
    id: 'balanceado',
    name: 'Balanceado',
    rate: 0.08,
    description: 'Riesgo moderado, mayor potencial',
    color: 'sky',
  },
  {
    id: 'dinamico',
    name: 'Dinámico',
    rate: 0.10,
    description: 'Mayor riesgo, mayor rendimiento',
    color: 'amber',
  },
];

export type ProjectionYear = {
  year: number;
  age: number;
  contribution: number;
  totalContributed: number;
  interest: number;
  balance: number;
};

export function calculateProjection(
  currentAge: number,
  monthlyContribution: number,
  years: number,
  annualRate: number,
): ProjectionYear[] {
  const monthlyRate = annualRate / 12;
  const projection: ProjectionYear[] = [];
  let balance = 0;
  let totalContributed = 0;

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      yearInterest += balance * monthlyRate;
    }
    totalContributed += monthlyContribution * 12;
    projection.push({
      year: y,
      age: currentAge + y,
      contribution: monthlyContribution * 12,
      totalContributed,
      interest: Math.max(0, yearInterest),
      balance: Math.round(balance),
    });
  }

  return projection;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}
