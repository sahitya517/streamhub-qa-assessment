const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LegacyEmiPage = require('../pages/LegacyEmiPage');
Given('I open the legacy LoanLens page', async function () { this.legacy = new LegacyEmiPage(this.page); await this.legacy.open(); });
When('I use the legacy locators to calculate a loan', async function () {
  await this.legacy.amount.fill('1000000', { timeout: 3000 });
  await this.legacy.rate.fill('9', { timeout: 3000 });
  await this.legacy.calcBtn.click({ timeout: 3000 });
});
Then('the legacy total interest label is visible', async function () { await expect(this.legacy.totalInterest).toBeVisible({ timeout: 3000 }); });
