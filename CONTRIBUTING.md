# Contributing

Start with a minimal mixed-script example that fails in a real interface. Include the app/browser and version, expected reading order, actual behavior, and a screenshot if possible. Remove private chat text, names, tokens and paths before sharing.

Add a fixture to `fixtures/cases.json` with language, source, expected direction and a specific human-review check. Fixtures should be original examples, not copied private conversations. We welcome Persian, Arabic, Hebrew and Urdu native readers and speakers of other RTL languages.

Run `npm ci` and `npm run check`. Review the case in the demo with auto, RTL and LTR settings. Keep code and URLs in logical source order. Do not fix display by reversing strings or injecting invisible controls into executable code.

For changes to direction policy, explain tradeoffs and include a regression test. A PR should solve a coherent problem; do not split trivial edits to manufacture contribution counts. AI-assisted changes are welcome when the contributor reviews the result, supplies evidence, and accepts maintenance responsibility.

Native-reader review is still needed for the initial synthetic fixtures. A passing test does not establish that every punctuation choice is linguistically correct.
