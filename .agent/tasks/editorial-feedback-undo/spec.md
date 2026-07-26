# Universal deck, turn undo, and card feedback

Canonical issue: https://github.com/kiku-jw/teply-krug/issues/9

## Original task

Remove Ukraine-specific assumptions and all illustrated question cards. Rewrite
the reported and similar prompts so they are shorter, clearer, broader, and
easier for people with different memories and ministry experience. Add a simple
question about past jobs, one-step turn undo, and per-card feedback that can be
sent to `support@kikuai.dev` at the end. Default new-install music volume to 50
percent.

## Goal

Make a mixed-experience Zoom group feel that almost any note can be understood
quickly and answered without proving a strong memory, travel history, pioneering
experience, or Ukrainian background. Let the host recover from an accidental
Next press and collect concrete editorial feedback without adding a server.

## Acceptance criteria

- **AC1: Universal context.** Built-in prompts and the editorial guide contain
  no Ukraine-only country, city, food, transport, hospitality, or language
  assumption. Questions about another language remain language-neutral.
- **AC2: No illustrated cards.** Card visuals, visual-only prompt wording,
  hidden visual cadence, visual rendering, visual styles, visual tests, and the
  twelve WebP card assets are removed. The jar artwork and reveal animation
  remain.
- **AC3: Plain editorial pass.** All 360 prompts pass gates for short spoken
  Russian, explicit context where needed, broad answerability, gender
  neutrality, two-person Zoom compatibility, and freedom from abstract or
  model-like phrasing. The fourteen reported prompts and close variants are
  rewritten.
- **AC4: Low memory and experience burden.** Prompts do not begin with a demand
  to remember a specific incident. Ministry prompts allow an opinion,
  preference, imagined response, or ordinary experience; none assumes
  pioneering, serving in another place, public witnessing, talking to a child,
  or having a memorable field-service story.
- **AC5: Deck invariants.** The deck remains exactly 360 unique cards, 24 for
  each stage/category pair. The first card remains Bible-based. A simple
  question about jobs a participant has done is present.
- **AC6: One-step turn undo.** After Next, a visible Back control restores the
  previous player, question, round, completed-turn count, partner, recent-card
  list, seen-card history, reveal state, and timer. It works from the next game
  screen and a round checkpoint, is limited to one step, and does not create a
  second history system.
- **AC7: Per-card local feedback.** Every displayed built-in or custom card has
  a clear `Отметить вопрос` control. A native accessible dialog accepts an
  optional comment up to 500 characters, supports update/removal, and stores at
  most 30 validated items locally without storing answers.
- **AC8: Email handoff.** If feedback exists, the finish screen shows its count
  and a button that opens a prefilled `mailto:support@kikuai.dev` draft. The
  subject and body include card IDs, current text, and comments. Nothing is
  sent automatically and failure to open a mail client never blocks the game.
- **AC9: Data lifecycle.** Feedback survives reload, malformed feedback fails
  closed, and `Удалить данные` removes it. No account, server, analytics,
  network API, or new dependency is added.
- **AC10: Music default.** New storage and old schemas without a music setting
  default to 50 percent. Any valid explicitly saved volume is preserved.
- **AC11: Responsive release proof.** Game, feedback dialog, checkpoint undo,
  and finish feedback remain usable at 390 x 844 and desktop widths. Unit,
  storage, copy/content, E2E, build, audit, diff, skeptical review, Pages
  deployment, and live readback all pass.

## Constraints

- Keep the static, host-controlled architecture.
- Use native browser APIs and existing rendering/storage patterns.
- Do not use TypeScript assertions.
- Do not save participant answers or automatically transmit feedback.
- Keep product copy in Russian and technical artifacts in English.

## Non-goals

- A hosted feedback API, inbox, authentication, spam handling, attachments,
  screenshots, automatic email sending, or device-independent synchronization.
- Multi-level undo, undo across page reload, or undo for every settings/editor
  action.
- Replacing the jar animation, music, or question categories.

## Lazy-senior check

- Lower rung: delete the visual subsystem; use native `<dialog>`, `mailto:`,
  existing localStorage validation, and one in-memory turn snapshot.
- GitHub prior art: skipped because browser primitives and current repo
  patterns fully cover this bounded static workflow.
- New code is justified only for validated feedback persistence and restoring
  one accidental turn advance.

## Verification plan

1. Add content gates before rewriting the deck, then make all 360 pass.
2. Delete the visual path and prove no card or runtime reference remains.
3. Unit-test one-step snapshot restore and bounded feedback parsing/email body.
4. E2E-test game/checkpoint undo, mark/edit/remove/reload, mailto creation,
   deletion of all local data, and existing game flows.
5. Inspect desktop/mobile screenshots and run the full release suite.
6. Publish a safe fast-forward revision and verify Pages plus a live browser.
