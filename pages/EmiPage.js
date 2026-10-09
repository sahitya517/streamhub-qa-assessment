const { expect } = require('@playwright/test');
// Locators: role / label / data-testid only (no positional CSS/XPath).
class EmiPage {
  constructor(page) {
    this.page = page;
    this.amount = page.getByLabel('Loan Amount');
    this.rate = page.getByLabel('Interest Rate');
    this.tenure = page.getByLabel('Tenure');
    this.calcBtn = page.getByRole('button', { name: 'Calculate' });
    this.emi = page.getByTestId('emi');
    this.totalInterest = page.getByTestId('total-interest');
    this.totalPayment = page.getByTestId('total-payment');
    this.error = page.getByRole('alert');
    this.pie = page.getByTestId('pie-chart');
    this.pieSlices = [page.getByTestId('pie-principal'), page.getByTestId('pie-interest')];
    this.bars = page.getByTestId('bar');
    this.tooltip = page.getByRole('tooltip');
    this.range = page.getByLabel('Show years');
    this.rows = page.getByTestId('row');
  }
  async open() { await this.page.goto('/'); await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible(); }
  async calculate(amount, rate, years) {
    await this.amount.fill(String(amount)); await this.rate.fill(String(rate)); await this.tenure.fill(String(years));
    await this.calcBtn.click();
  }
  async sliceValues() { return Promise.all(this.pieSlices.map(async s => Number(await s.getAttribute('data-value')))); }
}
module.exports = EmiPage;
