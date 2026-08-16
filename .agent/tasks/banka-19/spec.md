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

## 2026-08-15 live-play follow-up

Source: Nick's real-session editorial feedback and the observed same-player
pantomime streak. GitHub Issue #19 remains canonical; this section mirrors its
reopened acceptance surface.

### Follow-up acceptance

- F1: Replace cards 19, 25, 32, 68, 91, 115, 124, 130, 173, 177, 252, 294,
  357, and 358 in place with candid, game-like questions about thinking,
  conflict, money, boundaries, and character.
- F2: Rewrite reviewed leading cards 53, 70, 76, 81, 195, 292, 303, and 317 so
  they do not prescribe an answer, spiritual conclusion, or invented Bible
  problem.
- F3: Preserve 360 unique prompts, stable IDs, group balance, neutral address,
  and the existing skip path.
- F4: Prefer cards outside the current player's previous category and outside
  the active modes seen on that player's previous two turns. Fall back safely
  when an explicit topic or constrained pool has no alternative.
- F5: Reuse existing session history without a schema migration or new
  dependency. Unit and browser tests must prove the personal pacing behavior.
- F6: Run `npm run check`, `npm run test:e2e`, `git diff --check`, responsive
  smoke, Pages deployment, and live readback before returning the Issue to
  complete.

## 2026-08-16 playful-delivery pass

Nick accepted the deeper themes but asked for a less formal, more playful
delivery. Cards 32, 53, 70, 173, 177, 292, 294, and 303 are the bounded second
editorial pass.

### Acceptance

- P1: Replace abstract moral prompts, interview questions, and organized
  discussion instructions with concrete mini-situations, meaningful choices,
  predictions, or spoken actions.
- P2: Keep every option socially plausible; the card must not advertise one
  correct or more spiritual answer.
- P3: Preserve stable IDs, stages, categories, modes, 360-card uniqueness,
  group balance, neutral address, and the existing skip path.
- P4: Exact content regressions reject the intermediate drafts and lock the
  final wording at the same IDs.
- P5: Review the cards in their surrounding stage and mode, including length
  and first-round pressure.
- P6: Publish only after local checks, full desktop/mobile browser coverage,
  Pages deployment, and live content readback pass.
