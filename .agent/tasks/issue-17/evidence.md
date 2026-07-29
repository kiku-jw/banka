# Evidence

Status before publication: implementation is locally verified; AC7 remains
unproven until the exact committed revision deploys to GitHub Pages.

## Acceptance criteria

- **AC1 — PASS.** `src/storage.ts` keeps the fresh/migration fallback at 20.
  `npm run check` passed 48 unit tests, including version-one and version-two
  migration assertions at 20. The browser music test also observed an initial
  slider value of 20 and active audio volume of 0.2.
- **AC2 — PASS.** The desktop and mobile browser music scenario moved the
  slider to 43 while settings remained open, observed the percentage text,
  active audio volume 0.43, stored value 43, and the same value after reload.
- **AC3 — PASS.** The browser music scenario observed the slider becoming
  disabled and playback pausing immediately when music was unchecked, then
  becoming enabled and fading to 0.43 immediately when rechecked.
- **AC4 — PASS.** The dedicated immediate-settings browser scenario changed
  timer, sound, and motion; inspected localStorage before leaving settings;
  observed the motion class immediately; and confirmed all values after reload.
  Existing browser coverage also proves immediate Bible/ministry filtering and
  sound-effect behavior.
- **AC5 — PASS.** The settings DOM contains no Save button. Desktop and mobile
  screenshots show the settings panel ending after the animation toggle, with
  Back still visible.
- **AC6 — PASS.** The diff uses the existing form, localStorage persistence,
  native range/change events, and native audio element. No package, storage
  schema, runtime service, or autoplay entry point changed.
- **AC7 — UNKNOWN.** Local verification passed, but GitHub Pages deployment and
  production readback require a committed and pushed revision.

## Local verification

- `npm run check` — PASS: 8 test files, 48 tests; strict TypeScript and Vite
  production build passed.
- Targeted desktop Playwright run — PASS: 4 settings/audio scenarios.
- `npm run test:e2e` — PASS: 57 passed, 1 expected mobile-only skip.
- `git diff --check` — PASS.
- `npm audit --audit-level=high --omit=dev` — PASS: 0 vulnerabilities.
- Visual inspection — PASS:
  `raw/settings-desktop.jpg` and `raw/settings-mobile.jpg` show 20%, the
  immediate-apply explanation, no settings Save button, and no overflow.
