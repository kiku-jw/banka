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
