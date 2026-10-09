const fs = require('fs');
const { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { chromium, request } = require('@playwright/test');
const cfg = require('./config');
const { start } = require('../app/server');
let browser, server;
setDefaultTimeout(30000);
BeforeAll(async () => { server = await start(cfg.port); browser = await chromium.launch({ headless: cfg.headless }); });
AfterAll(async () => { await browser.close(); server.close(); });
Before({ tags: 'not @api' }, async function () {
  this.context = await browser.newContext({ baseURL: cfg.baseUrl });
  this.page = await this.context.newPage();
});
Before({ tags: '@api' }, async function () { this.api = await request.newContext({ baseURL: cfg.apiBaseUrl }); });
After(async function (scenario) {
  if (this.page) {
    fs.mkdirSync('screenshots', { recursive: true });
    const name = scenario.pickle.name.replace(/[^a-z0-9]+/gi, '_').slice(0, 60);
    const png = await this.page.screenshot({ path: `screenshots/${scenario.result.status}_${name}.png`, fullPage: true });
    await this.attach(png, 'image/png');
    await this.context.close();
  }
  if (this.api) await this.api.dispose();
});
