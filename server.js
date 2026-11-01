// Servidor local simples: node server.js  →  abre o jogo no navegador
// Usa a porta 8080 ou a próxima livre. "node server.js --no-open" não abre o navegador.
const http = require('http'), fs = require('fs'), path = require('path'), { exec } = require('child_process');
const root = __dirname;
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.json':'application/manifest+json', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpg':'image/jpeg' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

let port = Number(process.env.PORT) || 8080;
server.on('error', e => {
  if (e.code === 'EADDRINUSE' && port < 8100) { port++; server.listen(port); }
  else { console.error(e.message); process.exit(1); }
});
server.on('listening', () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  Futuro Administrador rodando em ${url}\n  (feche esta janela para encerrar)\n`);
  if (!process.argv.includes('--no-open')) {
    const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    exec(cmd);
  }
});
server.listen(port);
