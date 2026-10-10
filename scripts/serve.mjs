import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([
  ['/', ['dist/index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['dist/index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['dist/app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['dist/style.css', 'text/css; charset=utf-8']],
  ['/bidi.css', ['dist/bidi.css', 'text/css; charset=utf-8']]
  ,['/notices.txt', ['dist/notices.txt', 'text/plain; charset=utf-8']]
]);
createServer(async (req, res) => {
  const entry = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!entry) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const data = await readFile(entry[0]);
    res.writeHead(200, { 'Content-Type': entry[1], 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  } catch { res.writeHead(500); res.end('Run npm run build first.'); }
}).listen(4173, '127.0.0.1', () => console.log('BiDi Bridge: http://127.0.0.1:4173'));
