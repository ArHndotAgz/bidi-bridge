# Problem evidence and related work

Research date: 2026-10-10. Reports are user-submitted observations, not proof that a current release of every named product has the same defect. The fixtures in this repository are newly authored, minimal examples; no private chats were imported.

| Primary source | Observation | Relevance |
| --- | --- | --- |
| [openai/codex #14578](https://github.com/openai/codex/issues/14578) | Reports mixed Persian/Arabic, English words and punctuation in Codex Desktop. | Paragraph direction and code isolation regression cases. |
| [openai/codex #31903](https://github.com/openai/codex/issues/31903) | Hebrew report covering technical text and Markdown. | Avoid treating RTL as only Arabic-script text. |
| [anthropics/claude-code #29926](https://github.com/anthropics/claude-code/issues/29926) | Reports a Persian webview regression between extension versions; labeled duplicate. | Separate webview behavior from terminal rendering. |
| [W3C inline bidi examples](https://www.w3.org/International/articles/inline-bidi-markup/bidi_examples.en) | Explains isolation, `dir`, `auto` and first-strong limitations. | Use semantic HTML boundaries instead of string reversal. |
| [Unicode UAX #9](https://www.unicode.org/reports/tr9/) | Defines the Unicode Bidirectional Algorithm. | Delegate visual ordering to browser engines; do not invent a regex substitute. |

## Existing solutions

- [mmnaderi/chatgpt-rtl](https://github.com/mmnaderi/chatgpt-rtl) (the old `codex-rtl` URL redirects here) provides app-specific RTL/layout patching.
- [pawnsmaster/codex-rtl-toolkit](https://github.com/pawnsmaster/codex-rtl-toolkit) targets Codex through ChatGPT Desktop on Windows.
- MarkdownViewer's own archived version already offered per-block automatic direction in a Windows Markdown preview workflow.

These projects show that this problem has prior work. BiDi Bridge does not claim to be the first RTL fix. Its proposed contribution is an app-independent Markdown adapter plus inspectable test fixtures, without modifying installed application bundles. Current novelty is modest; adoption, cross-engine tests and upstream cooperation are future work.

## What a useful upstream contribution would contain

1. A confirmed reproduction against a named current release.
2. A minimal Markdown input and expected logical order.
3. A narrowly scoped renderer patch where source access permits it.
4. Tests for both RTL and LTR content, code, links, numbers and nested structures.
5. A clear statement of unresolved selection, copying, editing and terminal behavior.

No issue comment, upstream PR or maintainer endorsement is claimed by this document.
