# Implementation notes

- Preserve `service` and `bible` as real card/editor/storage categories.
- Extend the existing draw filter to accept either one category or a readonly
  category list; this keeps history, recycling, pacing, and empty-pool behavior
  in the canonical draw path.
- Build the topic dialog explicitly in its desired order:
  `О себе`, `Случай из жизни`, `О духовном`, `Показать или придумать`.
- Construct the spiritual filter from the two independent host preferences.
  Hide the combined option only when both are disabled.
- Keep the editor-facing `categoryNames` map unchanged; only the in-game dialog
  composes a presentation-level option.
- Unit coverage proves both sides of the category union. Browser coverage proves
  the combined label, enabled-subset behavior, hidden state, and absence of the
  two old dialog buttons.
- Fresh desktop and mobile screenshots show four balanced choices without
  horizontal overflow.
