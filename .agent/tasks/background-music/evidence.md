# Evidence

Implementation revision
`a11a2d7bf04f32fcd1b4979f5ad74dc979fcf67b` is published on GitHub Pages.
All acceptance criteria have fresh local or live proof.

| Criterion | Status | Proof |
| --- | --- | --- |
| AC1 | PASS | Four local MP3 files under `public/media/music/` total 13,732,005 bytes. `ffprobe` confirms MP3, stereo, 44.1 kHz, 128 kbps. EBU R128 measurements range from -16.0 to -16.4 LUFS with true peaks from -1.1 to -1.7 dBFS. |
| AC2 | PASS | `tests/music.test.ts` proves full-cycle uniqueness, deterministic shuffling, empty input, and no immediate repeat across cycle boundaries. Desktop and mobile E2E advance the native audio element through a five-play sequence and confirm four unique first-cycle sources plus a different boundary source. |
| AC3 | PASS | Desktop and mobile E2E verify Start, Continue after reload, active playback, stop on finish, and rejected-play isolation. A separate real-browser test confirms Chromium leaves `paused === false` after the host action. |
| AC4 | PASS | Desktop and mobile E2E verify the separate music switch, 0-100 slider, visible percentage, disabled state, effects independence, immediate save behavior, and 43 percent restoration after disable/re-enable. |
| AC5 | PASS | `tests/storage.test.ts` verifies version 1 and version 2 migration to version 3 with music enabled at 28 percent while preserving prior state. Browser coverage verifies the host's changed music setting and volume survive reload. |
| AC6 | PASS | The implementation uses one native `HTMLAudioElement`, one native range input, and the pure `shuffledMusicQueue` helper. `package.json` and the lockfile are unchanged; `npm audit --audit-level=high` reports zero vulnerabilities. |
| AC7 | PASS | `tests/e2e/visual.spec.ts` verifies the settings at desktop and 390 x 844 widths with no horizontal overflow. Fresh screenshots were visually inspected; labels, switch states, slider, and percentage remain readable. |
| AC8 | PASS | On the integrated `origin/main` baseline, `npm run check` passed 34 tests plus TypeScript and production build; `npm run test:e2e` passed 44 browser tests with 2 platform-specific skips; both diff checks passed. Pages run `30206333995` deployed successfully. Live HTML references JS `index-DaSA-QcF.js`, the bundle contains all four music paths and both Russian control labels, and every MP3 returns HTTP 200 with its expected byte length. A live 390 x 844 Chromium run started track 1 at volume 0.28, found both independent switches enabled, found no overflow, and recorded zero console errors. |

## Review notes

- A skeptical post-test pass found one real issue before release: disabling the
  music switch removed the disabled range input from `FormData`, initially
  losing the selected value. The final implementation reads the range element
  directly and the browser regression test proves the corrected behavior.
- The final diff was reverified after fast-forwarding Nick's concurrent README
  and metadata commit `ba55d12`.
- The only remaining environmental warning is GitHub Actions' notice that two
  official Pages actions still target deprecated Node.js 20 metadata while the
  runner forces Node.js 24. The workflow completed successfully and this does
  not affect the game bundle.
