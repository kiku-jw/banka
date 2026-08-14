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
