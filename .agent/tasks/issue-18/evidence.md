# Evidence

Final status: PASS. Implementation revision
`aa022151afa6673de3f78b577ab9b210c0abc454` deployed successfully through
GitHub Pages run `30495934787` and passed a live browser readback.

## Acceptance criteria

- **AC1 — PASS.** The dialog renders `О себе`, `Случай из жизни`,
  `О духовном`, and `Показать или придумать`. Browser assertions prove that
  separate exact buttons named `Библия` and `Служение` are absent.
- **AC2 — PASS.** The game-model unit test passes `["service", "bible"]` into
  the canonical draw function and deterministically selects a service card at
  one random boundary and a Bible card at the other.
- **AC3 — PASS.** The browser settings scenario disables both spiritual pools,
  then enables only Bible questions. The combined option appears and returns a
  Bible card without re-enabling ministry.
- **AC4 — PASS.** With both underlying preferences disabled, the browser
  scenario proves that `О духовном` is absent.
- **AC5 — PASS.** `src/main.ts` retains two independent host switches and
  `categoryNames` remains unchanged for editor labels and stored card values.
- **AC6 — PASS.** The combined option passes a category list through the
  existing `drawCard` path. No storage, history, card data, dependency, service,
  or initial Bible-first behavior changed. The empty-topic recovery regression
  passes.
- **AC7 — PASS.** GitHub Pages run
  `https://github.com/kiku-jw/dostavay/actions/runs/30495934787` completed with
  successful build and deploy jobs for the exact implementation revision. A
  fresh Playwright CLI session opened `https://kiku-jw.github.io/dostavay/`,
  started a real game, and opened the live chooser. Its snapshot contained
  exactly the four intended topic buttons and no separate Bible/ministry
  buttons. Selecting `О духовном` updated production localStorage to
  `currentCardId: "spark-service-2"` while the seen history also contained a
  Bible card, confirming the combined live pool.

## Local verification

- `npm run check` — PASS: 8 test files, 49 tests; strict TypeScript and Vite
  production build passed.
- Targeted desktop Playwright run — PASS: 3 combined-topic/settings scenarios.
- `npm run test:e2e` — PASS: 59 passed, 1 expected mobile-only skip.
- `git diff --check` — PASS.
- `npm audit --audit-level=high --omit=dev` — PASS: 0 vulnerabilities.
- Visual inspection — PASS:
  `raw/spiritual-topic-desktop.jpg` and
  `raw/spiritual-topic-mobile.jpg` show four balanced choices, the natural
  combined label, and no overflow.
- GitHub Pages run `30495934787` — PASS: build and deploy jobs succeeded for
  `aa022151afa6673de3f78b577ab9b210c0abc454`.
- Live Playwright CLI smoke — PASS: production labels, old-button absence, and
  a service-category result selected through `О духовном` were read back.
