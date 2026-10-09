const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const post = async (w, data) => { w.res = await w.api.post('/posts', { data }); w.body = await w.res.text(); w.attach(`status=${w.res.status()} body=${w.body.slice(0, 300)}`); };
When('I POST a post with a title of {int} characters', async function (n) { await post(this, { title: 'A'.repeat(n), body: 'b', userId: 1 }); });
When('I POST a post with special characters in the title', async function () { await post(this, { title: '\u0000<script>alert(1)</script>\'"; DROP TABLE posts;-- \u{1F4A5}\uFFFF', body: '%00%0d%0a', userId: 1 }); });
When('I POST a post without a userId', async function () { await post(this, { title: 'no user', body: 'b' }); });
Then('the response is not a 5xx server error', async function () { assert.ok(this.res.status() < 500, `Server failure: ${this.res.status()}`); });
Then('I record whether the API validated the input', async function () {
  const s = this.res.status();
  this.attach(s >= 400 ? `API rejected invalid input with ${s}` : `FINDING: API accepted invalid input with ${s} (JSONPlaceholder is a fake API and does not validate)`);
});
