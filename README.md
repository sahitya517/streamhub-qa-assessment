## Setup
```bash
npm install
npx playwright install chromium
```
Config lives in `.env` (`BASE_URL`, `API_BASE_URL`, `HEADLESS`); copy from `.env.example`. No URLs are hardcoded.

## Run
```bash
npm test                 # UI + API scenarios, starts the app automatically
npm run test:selfheal    # deliberately broken locators (expected to FAIL)
npm run sql              # runs SQL scenarios on SQLite, prints/saves output
npm start                # run the app manually at http://localhost:3000
```
Results: `reports/cucumber-report.html`, `reports/cucumber-report.json`, `screenshots/`, `sql/query_output.txt`.

## Structure
- `app/` web app (dashboard, calculator, pie chart, bar chart, filterable yearly report)
- `features/` Gherkin; `step-definitions/` glue; `pages/` Page Objects; `support/` hooks, world, config; `utils/emi.js` independent EMI oracle
- `sql/` schema, queries, runner, output
- `SELF_HEALING.md` AI self-healing design + 4 intentionally broken locators in `pages/LegacyEmiPage.js`

## Coverage
- **A2 UI:** dashboard loads; EMI/interest/total match independently computed values for 3 loan scenarios; pie slices > 0 and principal = loan amount; bar count = tenure and bar heights > 0; report filter; bar tooltip; invalid input error.
- **A3 API:** long title (100k chars), special/injection characters, missing `userId`. Asserts no 5xx. **Finding:** JSONPlaceholder is a fake API and returns 201 for all of these, so it does not validate input; the test records that rather than pretending it returns 4xx.
- **A4 SQL:** round-trip transfers via self-join with 10% and 24h window; streaks via gaps-and-islands (`ROW_NUMBER` difference). Streaks are consecutive matches *played by that player*. Postgres note in the file for interval syntax.


