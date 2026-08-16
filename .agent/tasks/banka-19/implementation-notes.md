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

## 2026-08-16 playful-delivery pass

### Editorial decision

- Keep the themes and stable slots; only the delivery changes.
- Use a concrete social situation, a choice between plausible reactions, a
  prediction about another player, or a one-line role-play.
- Avoid `обсудите`, abstract boundaries, generic coping questions, and wording
  that resembles ministry training.
- Keep the two candid later-stage cards about restored trust and a difficult
  Bible account. Their pressure is intentional, they appear after the opening
  stage, and the player can always skip.

### Scope decision

- Reword only cards 32, 53, 70, 173, 177, 292, 294, and 303.
- Do not add tone metadata or another pacing system for a bounded editorial
  correction. Existing stage, category, mode, and personal-format pacing stay
  unchanged.

### Adversarial editorial review

- Claim reviewed: all eight prompts should feel like friendly challenges while
  keeping every offered reaction plausible and preserving the original deck
  contract.
- Valid finding: card 32 initially offered an unexplained refusal as the
  conspicuously worse option. It now offers three defensible money choices.
- Valid finding: card 53 initially opened with an unnatural imperative. It now
  frames the unfamiliar ministry setting as a concrete hypothetical.
- No blocking finding remains after reviewing the final text in its surrounding
  stage and mode. The longest new prompt is 161 characters, below the existing
  responsive long-card case. Residual quality risk is subjective live-play
  chemistry, which the skip path and Issue reopen route preserve.

## 2026-08-16 host-read wording pass

### Host delivery contract

- The host reads the card verbatim to the room for the current player.
- The current player should understand the response or action without the host
  assigning roles or paraphrasing the prompt.
- A `group` or `perform` slot may still use a direct personal question when a
  forced partner mechanic would make the spoken delivery less natural.
- Another player is named only when the interaction adds something to the card;
  any required roles stay explicit and fit in one short instruction.

### Editorial decisions

- Reword only cards 4, 10, 18, 32, 45, 50, 53, 54, 70, 128, 130, 131, 137,
  147, 173, 182, 225, 292, 294, 303, 342, 354, 359, and 360.
- Replace facilitator language, abstract phrasing, and specific-memory demands
  with one-breath questions, quick choices, or simple actions.
- Replace card 173's entire situation rather than repair it. The new question
  asks which kind of person is hardest to speak with in ministry.
- Keep cards 292, 294, and 303 as direct questions to the current player; their
  previous partner-selection mechanics created unclear pronouns without adding
  useful play.
- Card 10 uses neutral `Что ты замечаешь сначала...` instead of the initially
  approved `...первым...`; the content test correctly identified the latter as
  gendered address.

### Scope decision

- Keep every existing ID, stage, category, mode, timer, selection rule, and
  skip path. This pass changes content strings and their exact regression
  fixtures only.

### Adversarial editorial review

- Claim reviewed: all 24 changed cards must work when read verbatim by the host
  while preserving neutral address and the existing deck contract.
- Valid finding: the approved card 10 draft used gendered `первым`. The final
  `сначала` is neutral and sounds more natural than the intermediate `раньше`.
- Valid finding: card 303 put its context before the question word. Moving
  `чем тебе труднее пожертвовать` to the front made the spoken question easier
  to follow without changing its choices.
- The final cards were inspected with their stable IDs and modes. The three
  direct ministry questions retain `group` pacing metadata, but no mode label
  is shown on the live card and no partner is assigned automatically, so the
  current player receives an unambiguous direct question.
- No blocking finding remains. Live-play chemistry is still subjective; the
  existing skip and feedback paths remain the practical safety valve.
