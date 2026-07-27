# Deck feedback pass 11

Canonical issue: https://github.com/kiku-jw/teply-krug/issues/11

## Original task

In the ranked review list, questions 19, 41, 42, 44, 46, 47, 50, 52, 63,
66, and 67 are normal. Every other question from 1 through 67 is strange,
boring, or faceless. Questions from 68 onward are normal.

## Goal

Replace the 56 rejected prompts with concrete, natural Russian questions and
activities that feel like a real game among friends.

## Acceptance criteria

- **AC1: Exact scope.** Replace all 56 rejected prompts and only those prompts.
  Preserve the 11 approved prompts from review numbers 1–67 and every prompt
  ranked 68–360.
- **AC2: Concrete wording.** Every replacement has an immediate subject,
  choice, story, scene, or action. Avoid abstract discussion, meta-commentary
  about the game, and generic training questions.
- **AC3: Easy participation.** Prompts do not depend on unusually precise
  memory, long ministry experience, acting skill, a third participant, or
  equipment beyond the host screen.
- **AC4: Universal setting.** Every replacement works both in one room and
  over video.
- **AC5: Editorial invariants.** All replacements are gender-neutral,
  conversational, respectful, and free of artificial restrictions.
- **AC6: Deck invariants.** The deck remains 360 unique cards with the existing
  stage/category balance.
- **AC7: Release proof.** Unit/content tests, TypeScript, build, desktop/mobile
  E2E, audit, Pages deploy, and live readback pass.

## Frozen interpretation of the feedback

- Concrete imagination is welcome: a biblical family at dinner, a museum
  object, a first snowfall, and an easy visual action can be fun.
- The problem is not fantasy or playfulness by itself. The problem is a vague,
  synthetic, over-designed, or discussion-guide-like formulation.
- Strong personal themes may be direct: childhood, work, how someone learned
  the truth, love for Jehovah, gratitude, brotherhood, hobbies, and hopes for
  the new world.
- Questions ranked 68–360 in the review list are outside this pass even when a
  future editorial pass could improve them.

## Constraints

- Keep the application static, host-controlled, and local-only.
- Do not add dependencies or change game mechanics.
- Keep product copy Russian and technical artifacts English.

## Verification plan

1. Add a regression fixture containing the 56 rejected exact texts.
2. Replace those texts within their existing stage/category slots.
3. Confirm all 11 approved texts remain present and unchanged.
4. Run the complete local and browser suites.
5. Review the changed prompts aloud, publish, and verify production.
