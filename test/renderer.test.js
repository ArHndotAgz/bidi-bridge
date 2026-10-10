import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import MarkdownIt from 'markdown-it';
import { bidiMarkdown, renderMarkdown, inspectBidiControls } from '../src/index.js';

const doc = source => new JSDOM(renderMarkdown(source)).window.document;
const fixtures = JSON.parse(readFileSync(new URL('../fixtures/cases.json', import.meta.url)));

test('all fixtures render without injecting direction control characters', () => {
  for (const fixture of fixtures) {
    assert.doesNotThrow(() => renderMarkdown(fixture.markdown));
    assert.deepEqual(inspectBidiControls(renderMarkdown(fixture.markdown)), []);
  }
});
test('paragraphs and headings have semantic auto direction', () => {
  const d = doc('# سلام\n\nEnglish\n\nمرحبا');
  for (const el of d.querySelectorAll('h1,p')) assert.equal(el.getAttribute('dir'), 'auto');
});
test('inline code is isolated LTR without changing literal text', () => {
  const d = doc('`dotnet test --filter "name=سلام"` را اجرا کن.');
  assert.equal(d.querySelector('bdi').getAttribute('dir'), 'ltr');
  assert.equal(d.querySelector('code').textContent, 'dotnet test --filter "name=سلام"');
});
test('fenced and indented code preserve source and have LTR boundary', () => {
  for (const input of ['```js\nconst x = "سلام";\n```', '    const x = "سلام";']) {
    const d = doc(input);
    assert.equal(d.querySelector('pre').parentElement.getAttribute('dir'), 'ltr');
    assert.equal(d.querySelector('code').textContent, 'const x = "سلام";\n');
  }
});
test('links are independently directed and keep target unchanged', () => {
  const d = doc('https://example.com/a?q=1&x=2 راهنما');
  assert.equal(d.querySelector('a').getAttribute('dir'), 'auto');
  assert.equal(d.querySelector('a').getAttribute('href'), 'https://example.com/a?q=1&x=2');
});
test('tight lists and tables receive per-item and per-cell direction', () => {
  const d = doc('- سلام\n- English\n\n| نام | Name |\n|---|---|\n| علی | Ali |');
  for (const el of d.querySelectorAll('li,th,td')) assert.equal(el.getAttribute('dir'), 'auto');
});
test('explicit direction fixes first-strong ambiguity', () => {
  const d = new JSDOM(renderMarkdown('OpenAI برای همه', { direction: 'rtl' })).window.document;
  assert.equal(d.querySelector('p').dir, 'rtl');
  assert.throws(() => renderMarkdown('x', { direction: 'invalid' }), TypeError);
});
test('default renderer blocks raw HTML and dangerous link schemes', () => {
  const d = doc('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[x](javascript:alert(1))');
  assert.equal(d.querySelector('script,img,a'), null);
});
test('preview does not load remote or local images', () => {
  const d = doc('![tracking](https://example.com/pixel.png)\n\n![local](file:///secret.png)');
  assert.equal(d.querySelector('img'), null);
  assert.match(d.body.textContent, /tracking/);
});
test('existing plugin directions are respected', () => {
  const md = new MarkdownIt();
  md.core.ruler.push('override', state => {
    for (const token of state.tokens) if (token.type === 'paragraph_open') token.attrSet('dir', 'rtl');
  });
  md.use(bidiMarkdown);
  assert.match(md.render('English'), /<p dir="rtl">/);
});
test('plain text remains logically ordered and ZWNJ is retained', () => {
  const text = 'می\u200cخواهم API نسخهٔ 2.1 را تست کنم.';
  assert.equal(doc(text).querySelector('p').textContent, text);
});
test('pre-existing invisible controls are reported, not removed', () => {
  const source = '😀a\u202eb\u2069';
  assert.deepEqual(inspectBidiControls(source), [
    { offset: 3, name: 'RLO', codePoint: 'U+202E' },
    { offset: 5, name: 'PDI', codePoint: 'U+2069' }
  ]);
  assert.equal(doc(source).querySelector('p').textContent, source);
});
