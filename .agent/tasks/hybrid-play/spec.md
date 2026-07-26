# Hybrid in-person and video play

Canonical issue: https://github.com/kiku-jw/teply-krug/issues/10

## Original task

Make the game work naturally not only over Zoom but also when everyone is in
the same room. Adjust the format and questions.

## Goal

Keep one simple host-controlled game whose instructions and 360 prompts make
sense at a table, on a shared television, or over any video-call service.

## Acceptance criteria

- **AC1: One universal format.** No mode selector is added. One host device,
  circular turns, jar reveal, timer, music, feedback, and undo work unchanged.
- **AC2: Product copy.** Welcome, setup, README, and editorial guide explicitly
  support playing together in one room or over video without naming Zoom as the
  required platform.
- **AC3: Universal prompts.** Built-in prompts do not require Zoom, a camera
  frame, a shared screen, a virtual background, a microphone/internet failure,
  or a screenshot. Any technology prompt has a natural in-room equivalent or is
  replaced.
- **AC4: Ministry exception.** Phone, letter, and video ministry can remain
  when that channel is the subject of the question rather than the play setup.
- **AC5: Group compatibility.** Activities work for two people and larger
  groups, together or remote, without assuming everyone owns another device.
- **AC6: Deck invariants.** The deck remains 360 unique cards, 120 per stage,
  72 per category, and 24 per stage/category pair. Existing gender-neutral,
  editorial, and low-memory gates continue to pass.
- **AC7: Release proof.** Unit/content tests, TypeScript, production build,
  desktop/mobile E2E, visual screenshots, audit, diff check, Pages deploy, and
  live readback pass.

## Constraints

- Keep the application static, local, and host-controlled.
- Do not add dependencies, accounts, networking, analytics, participant
  devices, or answer storage.
- Product copy stays Russian; technical artifacts stay English.

## Non-goals

- Separate online/offline decks or setup modes.
- Real-time multiplayer or participant voting.
- Removing phone/video ministry questions merely because they mention a
  communication channel.

## Verification plan

1. Add content and product-copy gates for online-only assumptions.
2. Rewrite every matching prompt and current product description.
3. Re-run the full unit/build and browser suites.
4. Capture fresh mobile/desktop evidence and run a skeptical review.
5. Publish safely, verify Pages, and close the canonical Issue.
