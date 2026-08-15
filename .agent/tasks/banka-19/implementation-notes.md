# Implementation notes

Temporary task artifact for `kiku-jw/banka#19`.

## Decisions

- Audited the deck by all 15 `stage x category` groups. Rewrote 90 prompts and
  accepted 270 unchanged; the group-level decisions live in
  `raw/question-audit.md`.
- Kept stable card IDs and the 24-card group balance so saved history, hidden
  cards, feedback, and visual mappings remain valid.
- Represented opening safety as a curated 20-ID content list rather than a
  public card field or numeric depth scale. The list contains four `spark`
  prompts from each category.
- Opening selection filters the already enabled deck, then falls back to the
  full enabled deck when no curated card is available or every curated card
  has already been seen. This avoids repeating an opening while other unseen
  questions remain.
- Changed only the new-browser timer default to `0`; existing stored values and
  migrations remain untouched.
- Added the existing full Playwright suite to the Pages workflow so a push
  cannot deploy after only unit and build checks.
- Raised the Playwright preview startup allowance from its 60-second default to
  120 seconds after a concurrent local workload delayed TypeScript startup
  before any browser test could run.
- The welcome history chip now shows `360 без повторов` for a fresh browser
  instead of the ambiguous `0 без повторов`. After play begins it reports the
  number already drawn.
- A player-review follow-up reduced the opening pool from 30 to 20 and replaced
  `Что хорошее в обычной жизни ты особенно ценишь?` with the more concrete
  `Какая мелочь может сделать твой день приятнее?`.

## Spec deviations

- None.

## Trade-offs and follow-ups

- Conditional wording is slightly longer, but it removes the social cost of
  rejecting a premise.
- The curated opening list is deliberately explicit and editorial. It requires
  review when an opening card changes, which is preferable to inferring safety
  from category or text heuristics.
- Additional hint images remain gated on live play evidence.

## 2026-08-15 live-play follow-up

### Lazy-senior receipt

- Lower rung: adapt the existing round-robin `recentCardIds` history and draw
  pacing rather than add player profiles, a scheduler, or a storage field.
- GitHub prior art: skipped because this is a repo-local selection regression
  with all required primitives already present.
- New code is limited to extracting two previous cards for the current player
  and applying category/active-format cooldowns with a safe fallback.

### Editorial decisions

- Keep all stable card IDs and replace the idea, not merely the wording.
- Use concrete scenarios around money, disagreement, trust, boundaries, and
  uncertainty instead of abstract self-analysis.
- Turn two rejected pantomimes into spoken role-play prompts while preserving
  their existing `perform` mode.
- Replace the eight reviewed leading prompts without prescribing spiritual
  evidence or a Bible character's lesson.

### Pacing decision

- Keep two complete player rounds in `recentCardIds`; the field remains the
  same validated string array, so no schema migration is needed.
- Derive the current player's history by stepping backward by player count.
- Prioritize personal pacing over global pacing: avoid the last personal
  category and any non-answer mode from the previous two personal turns when
  alternatives exist.
- A same-player replacement overwrites the current turn's recent-history slot
  so category changes and redraws do not corrupt the round-robin stride.
