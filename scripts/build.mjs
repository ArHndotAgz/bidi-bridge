import { build } from 'esbuild';
import { mkdir, copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
const result = await build({ entryPoints: ['demo/app.js'], bundle: true, format: 'esm', outfile: 'dist/app.js', minify: true, metafile: true });
const packageRoots = new Set(Object.keys(result.metafile.inputs).map(path => path.match(/^(node_modules\/(?:@[^/]+\/)?[^/]+)\//)?.[1]).filter(Boolean));
let notices = 'BiDi Bridge\n\n' + await readFile('LICENSE', 'utf8');
for (const root of [...packageRoots].sort()) {
  const license = (await readdir(root)).find(name => /^license(?:[.-]|$)/i.test(name));
  if (!license) throw new Error(`Missing dependency license: ${root}`);
  notices += `\n\n--- ${root} ---\n\n` + await readFile(`${root}/${license}`, 'utf8');
}
await writeFile('dist/notices.txt', notices);
await copyFile('demo/index.html', 'dist/index.html');
await copyFile('demo/style.css', 'dist/style.css');
await copyFile('src/style.css', 'dist/bidi.css');
console.log('Built self-contained demo in dist/. No API keys or network calls required.');
