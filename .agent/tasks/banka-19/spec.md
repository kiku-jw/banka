# banka#19 acceptance spec

Class: temporary task artifact. Canonical task state lives in GitHub Issue
`kiku-jw/banka#19`. Delete or cold-store this bundle after final PASS.

## Goal

Make the built-in deck invite honest, natural interest in one another without
prescribing a personal experience, spiritual effect, or expected lesson.

## Acceptance criteria

- AC1: Every one of the 15 `stage x category` groups (24 prompts each, 360
  total) receives a human editorial decision recorded in
  `raw/question-audit.md`; every prompt not listed for rewrite is explicitly
  accepted under the rules below.
- AC2: No built-in prompt asserts an unverified personal experience, causal
  spiritual effect, or predetermined lesson as fact. Conditional wording must
  offer a natural answer path when the experience did not occur.
- AC3: A curated hidden opening-safe pool controls the first turn. It must use
  only low-pressure `spark` prompts, respect topic switches and hidden cards,
  avoid repeats, and recover safely when the curated pool is unavailable.
- AC4: Later turns keep the existing varied pacing across category, demanding
  mode, deep tone, and repeated opening words. No visible or numeric depth
  ladder is introduced.
- AC5: A new browser starts with the soft timer disabled. Existing valid saved
  timer preferences and migrations continue to persist. Timer expiry does not
  open or promote fallback actions.
- AC6: Tests lock the editorial rules, opening selection, storage behavior, and
  important browser paths. `npm run check` and `npm run test:e2e` pass.
- AC7: A manual desktop and mobile smoke verifies setup, opening draw, next
  turn, disabled-topic fallback, timer-off presentation, and no overflow.
- AC8: The verified change is published through the existing main-branch
  GitHub Pages pipeline and evidence is synchronized to Issue #19.

## Editorial rules

Reject or rewrite a prompt when it:

1. assumes a particular event or experience happened to the player;
2. asserts that a Bible account, ministry event, prayer, clarification, or
   person caused a specific spiritual effect for the player;
3. embeds the expected lesson instead of inviting an honest observation;
4. makes a specific memory the price of entry without an explicit, natural
   alternative;
5. pressures disclosure through grand legacy, transformation, trauma, or
   superlative framing;
6. requires special ministry or spiritual-history experience without a
   fallback.

Safe prompts may ask about a current preference, ordinary coping method,
opinion, observation, imagination, or optional memory. A player must be able to
answer lightly and honestly without inventing evidence.

## Constraints

- Product language remains natural Russian; code and technical docs remain
  English.
- Keep the application static, local-only, host-controlled, and dependency
  free at runtime.
- Preserve exactly 360 unique built-in prompts and 24 prompts per
  `stage x category` group.
- Preserve compatibility with two people, larger groups, in-person play, and
  video calls.
- Do not add accounts, analytics, networking, answer storage, automatic timer
  fallback UI, more hint media, a numeric depth scale, or a framework.

## Assumptions

- Existing stages, categories, and modes are sufficient for broad pacing.
- `openingSafe` can be represented by a curated ID set rather than a new public
  card field.
- Rewriting a prompt in place may keep its stable ID.

## Verification plan

1. Record group-by-group human editorial decisions.
2. Add content tests for rejected assumption patterns and approved rewrites.
3. Add unit tests for curated opening selection and fallback behavior.
4. Add storage and E2E assertions for timer-off defaults.
5. Run unit tests, TypeScript build, full Playwright desktop/mobile suite, and
   manual browser smoke.
