# Combined spiritual topic

Canonical issue: https://github.com/kiku-jw/banka/issues/18

## Original task

Combine the separate in-game topic choices for ministry and the Bible into one
clear choice for spiritual questions.

## Acceptance criteria

- **AC1:** The in-game topic dialog shows one naturally worded button,
  `О духовном`, instead of separate `Служение` and `Библия` buttons.
- **AC2:** Selecting `О духовном` draws from the union of currently enabled
  `service` and `bible` cards.
- **AC3:** If only one of the two spiritual categories is enabled in host
  settings, `О духовном` draws only from that enabled category.
- **AC4:** If both spiritual categories are disabled, the `О духовном` option
  is absent.
- **AC5:** The main settings retain separate Bible and ministry switches, and
  the deck editor retains the existing underlying category names and values.
- **AC6:** Existing draw pacing, seen-card history, empty-topic recovery,
  storage shape, and local-only architecture remain intact.
- **AC7:** `npm run check`, `npm run test:e2e`, responsive visual inspection,
  fresh verification, GitHub Pages deployment, and live production readback
  pass.

## Constraints

- Keep the existing `Category` union and stored-data schema.
- Do not merge or rewrite the underlying card categories.
- Keep visible product copy in natural Russian.
- Add no dependency, account, service, analytics, or answer storage.
- Use existing typed DOM patterns without TypeScript assertions.

## Non-goals

- Merging the two switches in the main settings.
- Renaming categories inside the deck editor.
- Rebalancing or rewriting spiritual cards.
- Changing the initial Bible-first question.

## Assumptions

- The combined option is a presentation-layer simplification; the host still
  benefits from separately enabling or disabling Bible and ministry questions.
- `О духовном` is more conversational in this prompt than the noun-like label
  `Духовное`.

## Verification plan

1. Unit-test a multi-category draw filter with both spiritual categories.
2. Update browser scenarios for the combined button, enabled-subset behavior,
   and absence when both underlying settings are disabled.
3. Run the full unit/build and desktop/mobile Playwright suites.
4. Inspect fresh responsive screenshots of the topic dialog.
5. Run a fresh verifier pass, publish the exact verified revision, wait for
   Pages, and read back the live dialog and selection behavior.
