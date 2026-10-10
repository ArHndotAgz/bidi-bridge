import MarkdownIt from 'markdown-it';

const BLOCK_RULES = ['paragraph_open', 'heading_open', 'list_item_open', 'th_open', 'td_open'];
const DIRECTIONS = new Set(['auto', 'rtl', 'ltr']);

/**
 * Add semantic direction boundaries without rewriting source text.
 * Browser engines perform Unicode bidi resolution, not this plugin.
 * Install after other plugins that replace the same renderer rules.
 */
export function bidiMarkdown(md, { direction = 'auto' } = {}) {
  if (!DIRECTIONS.has(direction)) throw new TypeError('direction must be auto, rtl, or ltr');
  const decorate = (name, dir) => {
    const previous = md.renderer.rules[name];
    md.renderer.rules[name] = (tokens, index, options, env, renderer) => {
      // Respect deliberate overrides added by a preceding plugin.
      if (tokens[index].attrGet('dir') === null) tokens[index].attrSet('dir', dir);
      return previous
        ? previous(tokens, index, options, env, renderer)
        : renderer.renderToken(tokens, index, options);
    };
  };
  for (const name of BLOCK_RULES) decorate(name, direction);
  decorate('link_open', 'auto');
  // markdown-it's code renderers do not serialize arbitrary token attributes.
  // A separate wrapper establishes a safe boundary around their output.
  for (const name of ['code_inline', 'code_block', 'fence']) {
    const previous = md.renderer.rules[name];
    md.renderer.rules[name] = (tokens, index, options, env, renderer) => {
      const html = previous(tokens, index, options, env, renderer);
      return name === 'code_inline'
        ? `<bdi dir="ltr" class="bidi-code">${html}</bdi>`
        : `<div dir="ltr" class="bidi-code-block">${html}</div>\n`;
    };
  }
}

/** Safe default for untrusted chat/Markdown input: raw HTML is disabled. */
export function createRenderer({ direction = 'auto' } = {}) {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false })
    .use(bidiMarkdown, { direction });
  // Chat previews must not fetch remote tracking images or local file URLs.
  md.renderer.rules.image = (tokens, index) =>
    `<span class="bidi-image-placeholder" dir="auto">[Image: ${md.utils.escapeHtml(tokens[index].content)}]</span>`;
  return md;
}

export function renderMarkdown(source, options = {}) {
  if (typeof source !== 'string') throw new TypeError('source must be a string');
  return createRenderer(options).render(source);
}

/** Report pre-existing invisible direction controls; never silently strip them.
 * Offsets are JavaScript UTF-16 offsets. This is diagnostic, not a sanitizer.
 */
export function inspectBidiControls(source) {
  const names = {
    '\u061c': 'ALM', '\u200e': 'LRM', '\u200f': 'RLM',
    '\u202a': 'LRE', '\u202b': 'RLE', '\u202c': 'PDF',
    '\u202d': 'LRO', '\u202e': 'RLO', '\u2066': 'LRI',
    '\u2067': 'RLI', '\u2068': 'FSI', '\u2069': 'PDI'
  };
  return Array.from(source.matchAll(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu), m => ({
    offset: m.index, name: names[m[0]], codePoint: `U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`
  }));
}
