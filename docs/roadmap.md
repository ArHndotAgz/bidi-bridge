# Roadmap

## First milestone — reproducible foundation

- Independent project, with a provenance link to the earlier MarkdownViewer experiment.
- Markdown-it direction plugin and safe-default renderer.
- Local demo with 14 synthetic fixtures across Persian, Arabic, Hebrew, Urdu and English.
- Unit tests for semantic boundaries, source preservation and safe rendering defaults.
- Standalone HTML CLI.

## Next milestone — reliable evidence

- Native-reader review of punctuation, parentheses, dates, lists and table behavior.
- Repeatable Chromium, Firefox and WebKit direction/selection tests.
- Copy/paste round-trip checks, accessibility review and language metadata strategy.
- More fixtures for nested opposite-direction phrases, punctuation-only messages, combining marks and long paths.
- Integration with a local Markdown workflow and tests against known regressions.

## Later — integrations

- A React/rehype adapter with the same direction policy and fixtures.
- Streaming Markdown tests and explicit per-message direction UI.
- Upstream proposals where an open renderer can be changed.
- Claude Desktop and Codex-specific reproductions, distinguishing source contributions, supported extensions and experimental adapters. No binary patcher is included in this release.
- Terminal feasibility research as a separate component, accounting for shaping, cursor cells and selection.

## Outcomes to measure

Track reported failures reproduced/fixed, independently reviewed cases, downstream integrations, and real users. Downloads, stars and PR counts are not substitutes for correctness. Do not claim that every RTL issue can be solved once and for all by a CSS rule.
