const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const assert = require('assert');
const EmiPage = require('../pages/EmiPage');
const { computeEmi, digits } = require('../utils/emi');

Given('I open the LoanLens dashboard', async function () { this.emiPage = new EmiPage(this.page); await this.emiPage.open(); });

Then('the dashboard shows an EMI, total interest and total payment', async function () {
  for (const l of [this.emiPage.emi, this.emiPage.totalInterest, this.emiPage.totalPayment]) {
    await expect(l).toBeVisible(); expect(digits(await l.innerText())).toBeGreaterThan(0);
  }
});
Then('the pie chart and bar chart are visible', async function () {
  await expect(this.emiPage.pie).toBeVisible(); await expect(this.emiPage.bars.first()).toBeVisible();
});
When('I calculate a loan of {int} at {float} percent for {int} years', async function (a, r, y) {
  this.input = { a, r, y }; await this.emiPage.calculate(a, r, y);
});
Then('the displayed EMI matches the independently computed EMI', async function () {
  const { a, r, y } = this.input, exp = computeEmi(a, r, y);
  const actual = digits(await this.emiPage.emi.innerText());
  assert.ok(Math.abs(actual - exp.emi) <= 1, `EMI expected ~${Math.round(exp.emi)} but app showed ${actual}`);
});
Then('the displayed total interest and total payment match the computed values', async function () {
  const { a, r, y } = this.input, exp = computeEmi(a, r, y);
  assert.ok(Math.abs(digits(await this.emiPage.totalInterest.innerText()) - exp.totalInterest) <= 2);
  assert.ok(Math.abs(digits(await this.emiPage.totalPayment.innerText()) - exp.totalPayment) <= 2);
});
Then('the pie chart is visible with principal and interest greater than zero', async function () {
  await expect(this.emiPage.pie).toBeVisible();
  const [p, i] = await this.emiPage.sliceValues();
  assert.ok(p > 0 && i > 0, `Pie values must be > 0, got principal=${p}, interest=${i}`);
  assert.strictEqual(p, this.input.a, 'Pie principal slice should equal loan amount');
});
Then('the bar chart shows {int} bars with non-zero heights', async function (n) {
  await expect(this.emiPage.bars).toHaveCount(n);
  for (const b of await this.emiPage.bars.all()) {
    const box = await b.boundingBox(); assert.ok(box && box.height > 0, 'bar has zero height');
  }
});
When('I filter the report to the first {int} years', async function (n) { await this.emiPage.range.selectOption(String(n)); });
Then('the yearly table has {int} rows', async function (n) { await expect(this.emiPage.rows).toHaveCount(n); });
When('I hover over the first bar', async function () { await this.emiPage.bars.first().hover(); });
Then('the tooltip shows year, principal and interest values greater than zero', async function () {
  await expect(this.emiPage.tooltip).toBeVisible();
  const m = (await this.emiPage.tooltip.innerText()).match(/Year (\d+): Principal \S*?([\d,]+), Interest \S*?([\d,]+)/);
  assert.ok(m, 'tooltip text format unexpected');
  assert.strictEqual(Number(m[1]), 1);
  assert.ok(digits(m[2]) > 0 && digits(m[3]) > 0);
});
Then('an error message is shown', async function () { await expect(this.emiPage.error).toContainText('valid positive values'); });
