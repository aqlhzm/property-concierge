/**
 * Standard amortising loan maths. Planning estimates only — not a bank quotation.
 */
export function monthlyInstalment(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export type LoanEstimate = {
  price: number;
  loanAmount: number;
  downPayment: number;
  monthly: number;
  totalRepayment: number;
  totalInterest: number;
  months: number;
};

export function estimateLoan(price: number, marginPct: number, annualRatePct: number, years: number): LoanEstimate {
  const safePrice = Math.max(0, price);
  const margin = Math.min(100, Math.max(0, marginPct));
  const loanAmount = (safePrice * margin) / 100;
  const months = Math.round(years * 12);
  const monthly = monthlyInstalment(loanAmount, annualRatePct, years);
  const totalRepayment = monthly * months;
  return {
    price: safePrice,
    loanAmount,
    downPayment: safePrice - loanAmount,
    monthly,
    totalRepayment,
    totalInterest: Math.max(0, totalRepayment - loanAmount),
    months,
  };
}

/** Rough income a buyer would need so the instalment stays within a debt-service ratio. Indicative only. */
export function incomeForInstalment(monthly: number, dsrPct: number) {
  if (dsrPct <= 0) return 0;
  return monthly / (dsrPct / 100);
}
