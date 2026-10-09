// INTENTIONALLY BROKEN locators for the AI self-healing exercise (see SELF_HEALING.md).
class LegacyEmiPage {
  constructor(page) {
    this.page = page;
    this.amount = page.locator('#loanAmt');                       // BROKEN 1: id does not exist (real: label "Loan Amount")
    this.rate = page.locator('//section[2]/label[2]/input');       // BROKEN 2: positional XPath, wrong index
    this.calcBtn = page.locator('button.btn-calc-old');            // BROKEN 3: stale CSS class (real: role=button name=Calculate)
    this.totalInterest = page.getByText('Total Intrest');          // BROKEN 4: typo in text (real: "Total Interest")
  }
  async open() { await this.page.goto('/'); }
}
module.exports = LegacyEmiPage;
