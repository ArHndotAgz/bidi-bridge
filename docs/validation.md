# Validation record — 2026-10-10

Local environment: Windows, Node.js 24.15.0, npm 11.12.1.

- `npm run check`: 12 tests passed; browser bundle built successfully.
- `npm install`: 0 vulnerabilities reported by npm at installation time. This is not a security audit.
- Real browser smoke check: the Codex in-app browser rendered all 14 fixtures. Computed styles were inspected through browser automation.

| Fixture | Observed prose/item direction | Code boundaries |
| --- | --- | --- |
| fa-code | RTL | LTR |
| ar-link | RTL | none |
| he-code | RTL | LTR |
| ur-code | RTL | LTR |
| code-first | RTL | LTR |
| link-first | RTL | none |
| english | LTR | LTR |
| numbers | RTL | none |
| list | RTL / LTR / RTL | LTR |
| table | Cell markup covered by unit tests | LTR |
| fenced | RTL | LTR |
| quote | RTL; nested items RTL / LTR | LTR |
| ambiguous | LTR in auto; RTL after explicit override | none |
| html | LTR, displayed as text | none |

The initial Persian before/after case was also visually inspected. This confirms direction boundaries in this browser, not universal typography correctness. Firefox/WebKit, native-reader validation, clipboard round trips, accessibility and streaming behavior remain unverified. Do not describe the fixtures as a complete Unicode conformance suite.
