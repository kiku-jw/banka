# Implementation notes

## Product decisions

- “Back” means one accidental press of `ДАЛЬШЕ`, not a general command history.
- Feedback is an editorial note about a card, never a participant answer.
- The browser opens a mail draft; the host still reviews and sends it.
- Removing pictures also removes prompts that depend on choosing an object from
  an image. The jar visuals remain part of the game's identity.

## Editorial rules

- Prefer a direct question over “remember/tell about a case when”.
- A ministry card should say “в служении” when the context is not obvious.
- Offer questions and imagined situations alongside experience questions.
- Avoid assuming travel, public witnessing, children at doors, long service
  history, a specific country, or a strong episodic memory.
- Prefer calls/messages over a narrow video-call-only event when the medium is
  not the point.

## Delivered

- Rewrote the reported prompts and close variants, removed country-specific
  assumptions, added the jobs question, and kept all 360 IDs and stage/category
  counts intact.
- Removed the visual metadata, cadence, renderer, CSS, tests, and all twelve
  question-card WebP files. Jar media remains.
- Added one in-memory turn snapshot with Back controls on the next turn and
  round checkpoint.
- Added validated local card feedback, edit/remove behavior, and a reviewable
  `mailto:support@kikuai.dev` handoff on the finish screen.
- Changed only the missing/new music-volume default to 50 percent; saved valid
  values are preserved.

## Verification

- `npm run check`: 7 files, 36 unit/content tests passed; TypeScript and Vite
  production build passed.
- `npm run test:e2e`: 45 passed on desktop/mobile Chromium, 1 expected desktop-
  only skip.
- Mobile and desktop screenshots cover the text card, feedback dialog, feedback
  finish panel, music settings, and presentation viewport.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: passed.

## Adversarial review

No actionable findings. The turn snapshot is detached from live session state,
feedback is escaped and validated at the localStorage boundary, Delete Data
clears both keys, and no network send occurs without the host opening and
sending the email draft. Residual risk: a mail client may impose its own limit
if the host accumulates the maximum 30 long comments; the data remains local
and editable if that happens.
