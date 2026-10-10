import MarkdownIt from 'markdown-it';
import { renderMarkdown, inspectBidiControls } from '../src/index.js';
import fixtures from '../fixtures/cases.json';
const $ = id => document.getElementById(id);
const baseline = new MarkdownIt({ html: false, linkify: true });
baseline.renderer.rules.image = (tokens, index) =>
  `<span>[Image: ${baseline.utils.escapeHtml(tokens[index].content)}]</span>`;
for (const item of fixtures) {
  const option = document.createElement('option');
  option.value = item.id; option.textContent = `${item.language.toUpperCase()} · ${item.title}`;
  $('fixture').append(option);
}
function render() {
  const source = $('source').value;
  const output = renderMarkdown(source, { direction: $('direction').value });
  $('before').innerHTML = baseline.render(source);
  $('after').innerHTML = output;
  $('html').textContent = output;
  const controls = inspectBidiControls(source);
  $('controls-warning').textContent = controls.length
    ? `Existing invisible direction controls: ${controls.map(c => `${c.name} at ${c.offset}`).join(', ')}. Preserved, not inserted by BiDi Bridge.` : '';
}
function select() {
  const item = fixtures.find(f => f.id === $('fixture').value);
  $('source').value = item.markdown;
  $('hint').textContent = item.check;
  render();
}
$('fixture').addEventListener('change', select);
$('direction').addEventListener('change', render);
$('source').addEventListener('input', render);
select();
