# Evidence

Temporary task artifact for `kiku-jw/banka#19`.

## Acceptance results

- AC1 — PASS: `raw/question-audit.md` records a decision for all 15
  `stage x category` groups: 360 prompts reviewed, 91 rewritten, 269 accepted.
- AC2 — PASS: content tests reject the known presupposition forms and lock the
  revised Esther prompt. The complete human audit applies the same rule to the
  full deck.
- AC3 — PASS: unit and browser tests prove that the first turn uses the
  20-card curated `spark` pool, respects enabled topics and seen IDs, and falls
  back to the full enabled deck after that pool is exhausted.
- AC4 — PASS: the existing later-turn pacing implementation remains in place;
  no public card field or numeric depth ladder was added.
- AC5 — PASS: storage and browser tests prove a fresh default of `0`, preserved
  saved preferences and migrations, and no automatic fallback on expiry.
- AC6 — PASS: `npm run check` passed 53/53 tests plus TypeScript/Vite build;
  `npm run test:e2e` passed 61 scenarios on desktop and mobile with one
  intentionally inapplicable viewport case skipped.
- AC7 — PASS: headed desktop/mobile smoke covered fresh welcome copy, setup,
  opening draw (`spark-personal-8`), next turn, timer-off presentation,
  disabled Bible/service topics (`spark-stories-4`), fallback topic chooser,
  and 390px overflow (`scrollWidth = clientWidth = 390`).
- AC8 — PASS: follow-up commit
  `da9cea3bd546d09f1fdc7a4d1fa8201687fac1fa` was published from `main`.
  GitHub Pages run `30690781930` completed its test, browser, and deploy gates;
  the live page returned HTTP 200 and its card asset contains the replacement
  question but not the superseded wording.

## Fresh commands

```text
npm run check
  8 test files passed; 53 tests passed; TypeScript and Vite build passed

PLAYWRIGHT_PORT=4189 npm run test:e2e
  61 passed; 1 skipped; desktop and mobile

git diff --check
  clean

GitHub Pages run 30690781930
  build success; browser-flow gate success; deploy success

curl https://kiku-jw.github.io/banka/
  HTTP 200; deployed card asset contains the replacement question

```

## Manual smoke artifacts

- Desktop revealed card: `.playwright-cli/page-2026-08-01T07-29-02-782Z.png`
- Mobile timer-off turn: `.playwright-cli/page-2026-08-01T07-30-07-544Z.png`
- Mobile disabled-topic chooser:
  `.playwright-cli/page-2026-08-01T07-30-31-989Z.png`

## 2026-08-16 live-play follow-up

### Acceptance results

- F1 — PASS: cards 19, 25, 32, 68, 91, 115, 124, 130, 173, 177, 252,
  294, 357, and 358 were replaced in place with concrete questions about
  money, conflict, trust, boundaries, judgment, and character.
- F2 — PASS: reviewed leading cards 53, 70, 76, 81, 195, 292, 303, and 317
  were rewritten without prescribing an answer, spiritual conclusion, or
  invented Bible problem.
- F3 — PASS: content tests preserve 360 unique prompts, stable IDs, 24 cards
  per `stage x category` group, neutral address, and the existing skip path.
- F4 — PASS: selection avoids the current player's previous category and the
  active modes from that player's previous two turns when alternatives exist;
  explicit themes and constrained pools retain a safe fallback.
- F5 — PASS: the implementation reuses `recentCardIds`; no schema migration,
  runtime dependency, account, network request, analytics, or answer storage
  was added. Unit and desktop/mobile browser tests cover the pacing behavior
  and same-turn redraw history.
- F6 — PASS: `npm run check` passed 57/57 tests plus TypeScript/Vite build;
  `npm run test:e2e -- --workers=2` passed 65 scenarios on desktop and mobile
  with one fixed-viewport case intentionally skipped. Responsive screenshots
  were inspected without overflow. Pages run `31909263547` passed build,
  browser, and deploy gates. Live readback returned HTTP 200 for the page and
  both JavaScript assets, found all 22 replacements, and found none of the 22
  superseded prompts.

### Fresh commands

```text
npm run check
  8 test files passed; 57 tests passed; TypeScript and Vite build passed

npm run test:e2e -- --workers=2
  65 passed; 1 intentionally skipped; desktop and mobile

git diff --check origin/main...2f7dcb342b605463f722219bb86b7253c48f2cf1
  clean

npm audit --omit=dev
  0 vulnerabilities

GitHub Pages run 31909263547
  build success; browser-flow gate success; deploy success

https://kiku-jw.github.io/banka/
  HTTP 200; 22 replacements present; 22 superseded prompts absent
```

### Review receipt and residuals

- A self-contained adversarial review found and fixed two additional leading
  prompts plus a missing redraw-history regression before the final run. No
  blocking finding remains.
- The current Vite-only development tree reports one high `nanoid` advisory
  and one moderate `postcss` advisory. Production audit is clean, the deployed
  app has no runtime dependency path, and this follow-up does not process
  untrusted build input. Dependency refresh remains outside this editorial
  change.
- GitHub Actions emits a non-blocking Node 20 deprecation annotation for the
  current Pages helper actions while forcing them to Node 24. The run passed.

## 2026-08-16 playful-delivery pass

### Acceptance results

- P1 — PASS: cards 32, 53, 70, 173, 177, 292, 294, and 303 now use concrete
  money, flexibility, conversation, prediction, and role-play situations
  instead of abstract interview or discussion wording.
- P2 — PASS: the final choices remain socially plausible without advertising
  one correct or more spiritual response. The adversarial pass replaced one
  conspicuously worse money option before verification.
- P3 — PASS: content tests preserve 360 unique cards, stable IDs, stage and
  category balance, neutral address, readable length, and text-only delivery.
  No stage, category, mode, schema, dependency, UI, or skip behavior changed.
- P4 — PASS: the exact content fixture locks all eight final texts at their
  existing IDs and rejects all eight intermediate drafts.
- P5 — PASS: a skeptical review checked the cards in their surrounding stage
  and mode. It fixed the loaded option at card 32 and an unnatural opening at
  card 53. No blocking finding remains; the longest new prompt is 161
  characters, below the existing responsive long-card case.
- P6 — PASS: `npm run check` passed 58/58 tests plus TypeScript/Vite build;
  `npm run test:e2e -- --workers=2` passed 65 desktop/mobile scenarios with one
  fixed-viewport case intentionally skipped. Pages run `31932908523` passed
  build, browser, and deploy gates. Live readback returned HTTP 200 for the page
  and both JavaScript assets, found all eight final prompts, and found none of
  the eight intermediate drafts.

### Fresh commands

```text
npm run check
  8 test files passed; 58 tests passed; TypeScript and Vite build passed

npm run test:e2e -- --workers=2
  65 passed; 1 intentionally skipped; desktop and mobile

git diff --check
  clean

npm audit --omit=dev
  0 vulnerabilities

GitHub Pages run 31932908523
  build success; browser-flow gate success; deploy success

https://kiku-jw.github.io/banka/
  HTTP 200; 8 final prompts present; 8 intermediate drafts absent
```

### Residual

- Whether the pressure and humor land naturally remains a live-play judgment.
  Players retain the visible skip path, and Issue #19 remains the route for
  reporting exact card numbers after the next real evening.

## 2026-08-16 host-read wording pass

### Acceptance results

- H1 — PASS: cards 4, 10, 18, 32, 45, 50, 53, 54, 70, 128, 130, 131, 137,
  147, 173, 182, 225, 292, 294, 303, 342, 354, 359, and 360 were rewritten in
  place with the final reviewed wording.
- H2 — PASS: every changed card is a complete host-readable question or action.
  No changed card requires the host to invent context or resolve a pronoun.
- H3 — PASS: cards 292, 294, and 303 now address the current player directly;
  cards 225, 342, and 359 explicitly name the people who act. No forced partner
  mechanic remains where it adds no play value.
- H4 — PASS: the changed cards use ordinary spoken Russian, short choices, and
  simple actions without a required memory or advertised correct answer.
- H5 — PASS: content tests preserve exactly 360 unique prompts, stable IDs, 24
  cards per stage/category group, neutral address, readable length, and the
  existing skip and pacing behavior. No stage, category, mode, runtime code,
  dependency, storage, or UI changed.
- H6 — PASS: the exact 24-card fixture rejects the preceding wording and three
  superseded final drafts. `npm run check` passed 59 tests plus TypeScript/Vite
  build; `npm run test:e2e -- --workers=2` passed 65 desktop/mobile scenarios
  with one fixed-viewport case intentionally skipped. Pages run `31962815453`
  passed build, browser, and deploy gates. Live readback returned HTTP 200 for
  both entry pages, scanned all three referenced JavaScript assets, found all
  24 final prompts, and found none of 27 rejected or superseded prompts.

### Fresh commands

```text
npm run check
  8 test files passed; 59 tests passed; TypeScript and Vite build passed

npm run test:e2e -- --workers=2
  65 passed; 1 intentionally skipped; desktop and mobile

git diff --check
  clean

npm audit --omit=dev
  0 vulnerabilities

GitHub Pages run 31962815453
  build success; browser-flow gate success; deploy success

https://kiku-jw.github.io/banka/
https://kiku-jw.github.io/banka/review.html
  HTTP 200; 3 referenced JavaScript assets scanned; 24 final prompts present;
  27 rejected or superseded prompts absent
```

### Review receipt and residual

- The adversarial pass found two actionable wording issues: gendered `первым`
  in card 10 and unnatural question order in card 303. Both were corrected
  before the final local and Pages gates; no blocking finding remains.
- The remaining risk is subjective live-play rhythm. The visible skip and local
  feedback paths remain available, and Issue #19 can be reopened with exact
  card numbers after another real session.
