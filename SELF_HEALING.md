# AI Self-Healing Locators

## Deliberately broken locators (`pages/LegacyEmiPage.js`, run with `npm run test:selfheal`)
| # | Broken locator | Why it breaks | Healed (expected) |
|---|---|---|---|
| 1 | `#loanAmt` | id does not exist | `getByLabel('Loan Amount')` |
| 2 | `//section[2]/label[2]/input` | positional XPath, wrong index | `getByLabel('Interest Rate')` |
| 3 | `button.btn-calc-old` | stale CSS class | `getByRole('button', { name: 'Calculate' })` |
| 4 | `getByText('Total Intrest')` | typo in text | `getByTestId('total-interest')` |

## Approach
1. **Detection** - An `After` hook (or a Playwright reporter) catches `locator.* Timeout` errors. For each failure it records the locator string, the step, and the failing page's DOM snapshot (`page.accessibility.snapshot()` plus trimmed `page.content()`) and a screenshot.
2. **Prompt** - Send the LLM: the broken locator, the step intent (e.g. "fill loan amount"), the trimmed accessibility tree / DOM, and rules: *return JSON `{candidates:[{locator, confidence, reason}]}`; prefer getByRole > getByLabel > getByTestId > getByText; never positional CSS/XPath; the locator must match exactly one element.*
3. **Validation before applying** - For every candidate: (a) `await page.locator(candidate).count() === 1`; (b) element is visible/enabled and has a compatible role/tag for the action (input for `fill`, button for `click`); (c) re-run the step on a throw-away context and confirm the assertion still passes; (d) reject low confidence (<0.8) or candidates using positional selectors.
4. **Apply** - Never auto-merge to main. Write the fix as a patch / pull request to the page-object file with the validation log, and a human reviews it. Keep an audit log of heals so recurring heals reveal real UI regressions.
5. **Guardrails** - Heals must not mask real bugs: if the element's purpose (label/role) changed, flag as a failure instead of healing.

## POC sketch
```js
// heal.js (needs ANTHROPIC_API_KEY; model name configurable)
async function heal(page, broken, intent) {
  const tree = JSON.stringify(await page.accessibility.snapshot()).slice(0, 8000);
  const answer = await askLLM({ broken, intent, tree });          // returns candidates JSON
  for (const c of answer.candidates.sort((a, b) => b.confidence - a.confidence)) {
    const loc = eval(`page.${c.locator}`);                         // e.g. getByLabel('Loan Amount') (sandbox this in real use)
    if (c.confidence >= 0.8 && (await loc.count()) === 1 && (await loc.isVisible())) return c;
  }
  return null;                                                      // fail the test, don't guess
}
```
