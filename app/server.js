const http = require('http'), fs = require('fs'), path = require('path');
function start(port) {
  const server = http.createServer((req, res) => {
    const file = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    if (!file.startsWith(path.join(__dirname, 'public'))) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (e, d) => e ? (res.writeHead(404), res.end('Not found')) : (res.writeHead(200, { 'Content-Type': 'text/html' }), res.end(d)));
  });
  return new Promise(r => server.listen(port, () => r(server)));
}
module.exports = { start };
if (require.main === module) start(process.env.PORT || 3000).then(() => console.log('LoanLens running on http://localhost:' + (process.env.PORT || 3000)));
