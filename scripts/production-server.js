const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const buildRoot = path.resolve(__dirname, '..', 'build');
const prefix = '/matteoshafer.github.io';
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || host}`);
  if (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`)) {
    response.writeHead(404).end('Not found');
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\/+/, '');
  const candidate = path.resolve(buildRoot, relative || 'index.html');
  const safeCandidate = candidate.startsWith(`${buildRoot}${path.sep}`) || candidate === buildRoot;
  const requestedFile = safeCandidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    ? candidate
    : path.join(buildRoot, 'index.html');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', types[path.extname(requestedFile)] || 'application/octet-stream');
  fs.createReadStream(requestedFile).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Production build available at http://${host}:${port}${prefix}/`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
