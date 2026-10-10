# BiDi Bridge — readable bilingual AI conversations

Readable mixed-direction text for Persian, Arabic, Hebrew and Urdu alongside English, commands, paths and links. Our long-term focus is helping improve bilingual conversations in **Claude Desktop and Codex**, and making those improvements reusable by other Markdown and chat interfaces.

**Experimental 0.1.0.** A Markdown renderer, a `markdown-it` plugin, and a fixture lab. This is an independently developed project; it is not affiliated with Anthropic or OpenAI and has not been integrated into their products.

## Why this exists

A Persian explanation with `npm install`, an Arabic sentence with a URL, or a Hebrew paragraph with a file path can become difficult to read when the application gives everything the same direction. Unicode and HTML already provide the underlying mechanisms. This project focuses on applying those mechanisms consistently and testing the boundaries.

## Origins

The maintainer's earlier [MarkdownViewer](https://github.com/ArHndotAgz/MarkdownViewer) was first committed on **2026-05-26** and explored local Markdown previews including Persian/English direction. That experience motivated this broader, independent project. **BiDi Bridge began on 2026-10-10**; it does not inherit the earlier project's age, usage or impact. The new core was written independently with AI assistance and needs continuing human and native-reader review.

## Target products and current delivery

| Surface | Goal | Current status |
| --- | --- | --- |
| Claude Desktop | Readable bilingual chat, code and punctuation | Research target; no installed adapter or vendor integration |
| Codex Desktop / panels | The same consistent direction boundaries | Public issue research; no installed adapter or vendor integration |
| Markdown/browser webviews | A reusable, inspectable reference renderer | Experimental library, local demo and CLI implemented |
| Terminals and text editing | Investigate shaping, caret and selection separately | Not implemented |

## Run locally

Requires Node.js 20 or later.

```sh
npm ci
npm run check
npm run demo
```

Open http://127.0.0.1:4173. Choose a fixture, edit the Markdown, and compare the unconfigured renderer with BiDi Bridge. The built demo requires no API key or network requests. Images are represented as placeholders to prevent remote tracking requests. Clicking a link navigates outside the demo.

Render a local document without starting a server:

```sh
node src/cli.js document.md > preview.html
```

Open `preview.html` in a browser. This experimental CLI has no Windows context-menu installer.

## Use as a library

The package is not yet published to npm. Import from this checkout:

```js
import { renderMarkdown } from './src/index.js';
const html = renderMarkdown('`dotnet test` را اجرا کن.');
// Insert into a container with class="bidi-content" and load src/style.css.
```

Or install the plugin into an existing `markdown-it` instance:

```js
import MarkdownIt from 'markdown-it';
import { bidiMarkdown } from './src/index.js';
const md = new MarkdownIt({ html: false }).use(bidiMarkdown);
```

Install after other plugins that replace code renderer rules. `bidiMarkdown` adds direction boundaries; it is **not an HTML sanitizer**. Integrators are responsible for their Markdown configuration, other plugins, highlighting callbacks and untrusted HTML. The convenience `createRenderer`/`renderMarkdown` disables raw HTML, uses markdown-it's URL checks, and replaces images with placeholders.

## Direction policy

- Paragraphs, headings, list items and table cells use `dir="auto"`.
- Inline code gets a `<bdi dir="ltr">` boundary; code blocks get an LTR container.
- Links are isolated with `dir="auto"`; labels can themselves be RTL.
- Text is kept in logical order. No reverse-string operation, character substitution, or invisible direction marks are added. Persian ZWNJ is preserved.
- `renderMarkdown(text, { direction: 'rtl' })` explicitly overrides prose direction. Existing token-level `dir` values from other plugins are respected.
- `inspectBidiControls(text)` reports existing invisible bidi controls with UTF-16 offsets. It does not remove or neutralize them.

## Limitations worth testing

`dir="auto"` chooses the first strong character, not the language or author's intent. A Persian sentence beginning with an unmarked English name may need an explicit RTL override. Ambiguous punctuation and unmarked multiword English phrases still need semantic markup or host UI controls. Numbers alone are not a reliable direction signal.

Table column order is left in source order; cells resolve independently. The textarea demo does not solve editing/caret issues. There is no terminal shaping, selection engine, automatic live-app patching or streaming adapter in this release. Copy correctness and visual order need native-reader review across browsers; structural unit tests alone cannot certify them.

## Evidence and contribution

- [Public issue research and related work](docs/research.md)
- [Scope and roadmap](docs/roadmap.md)
- [Contribution guide](CONTRIBUTING.md)
- [Fixture cases](fixtures/cases.json)

The initial objective is a small, reusable improvement and reproducible evidence for upstream maintainers. Adoption and impact must be measured after release, not inferred from the size of the affected language communities.

## License

MIT. See [LICENSE](LICENSE). Dependency licenses remain their respective owners'.
