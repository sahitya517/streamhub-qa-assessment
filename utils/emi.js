// Independent EMI computation used as the test oracle (standard reducing-balance formula).
function computeEmi(principal, annualRatePct, years) {
  const r = annualRatePct / 12 / 100, n = years * 12;
  const f = Math.pow(1 + r, n);
  const emi = (principal * r * f) / (f - 1);
  return { emi, totalPayment: emi * n, totalInterest: emi * n - principal };
}
const digits = (s) => Number(String(s).replace(/[^0-9.]/g, ''));
module.exports = { computeEmi, digits };
