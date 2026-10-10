import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['demo/app.js'], bundle: true, format: 'esm', outfile: 'dist/app.js', minify: true });
await copyFile('demo/index.html', 'dist/index.html');
await copyFile('demo/style.css', 'dist/style.css');
await copyFile('src/style.css', 'dist/bidi.css');
console.log('Built self-contained demo in dist/. No API keys or network calls required.');
