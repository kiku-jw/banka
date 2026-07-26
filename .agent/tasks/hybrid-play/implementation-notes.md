# Implementation notes

## Decisions

- Use one universal game flow instead of asking the host where the group is.
- Prefer “вместе или по видеосвязи” only in setup/marketing copy. Individual
  cards should normally avoid explaining the play environment at all.
- Keep ministry-channel wording when the channel itself is the subject.
- Replace technical-failure activities with ordinary physical actions rather
  than adding repeated “если вы играете онлайн” branches.

## Delivered changes

- Reframed the welcome copy and public documentation around one-room and video
  play.
- Rewrote every built-in prompt that required Zoom, a camera frame, a
  microphone, an internet failure, a screenshot, or a virtual background.
- Added regression gates for environment-specific prompts and public copy.
- Kept the existing game flow, 360-card balance, local-only state, feedback,
  undo, animation, sound, and music behavior unchanged.

## Adversarial review

No findings. The diff satisfies the frozen contract without introducing a
separate mode or weakening the existing deck invariants. The remaining risk is
editorial: automated gates can detect explicit environment assumptions, but
natural spoken wording still benefits from reports collected during real play.
