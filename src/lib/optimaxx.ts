export const terms = {
  minimumMonthly: 2000,
  inflation: 0.04,
  udi: 8.81,
  umaAnnual2025: 41273.52,
};

export type Quote = {
  name: string;
  email: string;
  phone?: string;
  age: number;
  monthly: number;
  years: number;
  rate: number;
  income: number;
  isr: number;
};

export function projectOptimaxx(quote: Quote) {
  const rate = (1 + quote.rate) ** (1 / 12) - 1;
  const bonusRate = (1 + Math.min(0.09, terms.inflation + 0.05)) ** (1 / 12) - 1;
  const annual = quote.monthly * 12;
  const bracket = annual >= 90000 ? 3 : annual >= 60000 ? 2 : annual >= 36000 ? 1 : 0;
  const percentages = quote.years < 15 ? [0, .15, .25, .35] : quote.years < 20 ? [.30, .40, .50, .60] : [.55, .65, .75, 1];
  const bonusPct = percentages[bracket];
  let initial = 0;
  let committed = 0;
  let bonus = 0;
  let totalPaid = 0;
  let reinvested = 0;

  return Array.from({ length: quote.years }, (_, index) => {
    const year = index + 1;
    const age = quote.age + year;
    const adjustment = (1 + terms.inflation) ** index;
    const payment = quote.monthly * adjustment;
    for (let m = 1; m <= 12; m++) {
      const month = index * 12 + m;
      initial *= .999;
      committed *= .999;
      bonus *= .999;
      if (month > 18) {
        const charge = 15 * terms.udi * adjustment;
        initial = Math.max(0, initial - Math.max(0, charge - committed));
        committed = Math.max(0, committed - charge);
      }
      initial *= 1 + rate;
      committed *= 1 + rate;
      bonus *= 1 + bonusRate;
      if (month <= 18) initial += payment;
      else committed += payment;
      if (year === 1) bonus += payment * bonusPct;
      if (month % 3 === 0) {
        initial *= .991;
        bonus *= .991;
      }
    }
    const annualPayment = payment * 12;
    totalPaid += annualPayment;
    const eligible = Math.min(annualPayment, 5 * terms.umaAnnual2025 * adjustment, quote.income * adjustment * .10);
    reinvested = reinvested * (1 + quote.rate) + eligible * quote.isr;
    const vested = year === quote.years;
    const fund = initial + committed + (vested ? bonus : 0);
    const available = vested ? fund : committed;
    const afterWithdrawalFee = vested ? available : available * .99;
    return { year, age, annualPayment, totalPaid, fund, available, net: afterWithdrawalFee * (age < 65 ? .8 : 1), reinvested };
  });
}
