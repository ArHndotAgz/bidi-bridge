#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { renderMarkdown } from './index.js';
const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === '--help') {
  console.log('Usage: bidi-md input.md > output.html\nRender a local Markdown file as standalone HTML. Source is never modified.');
  process.exit(args[0] === '--help' ? 0 : 1);
}
try {
  const source = readFileSync(args[0], 'utf8');
  const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8');
  process.stdout.write(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BiDi Markdown preview</title><style>body{max-width:900px;margin:40px auto;padding:20px;font:18px/1.8 system-ui}code{font-family:monospace}pre{padding:16px;background:#f2f4f3}${css}</style><main class="bidi-content">${renderMarkdown(source)}</main></html>`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
