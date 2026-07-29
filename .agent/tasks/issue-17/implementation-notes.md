# Implementation notes

- Preserve valid stored music volumes; the existing storage default and
  migration fallback are already 20%.
- Apply settings from the existing form controls on `change`; apply the range
  input on `input` so the audible level and local preference follow the thumb
  continuously.
- Cancel any in-progress music fade when the host moves the volume slider so a
  stale fade target cannot overwrite the newly selected volume.
- Keep the form for semantic grouping, but remove its submit action and Save
  button. Back remains navigation, not a commit step.
- Do not show repeated success toasts for autosave.
- Tell the host directly on the settings page that changes apply immediately.
- Remove the now-unused Save-button layout rule.
- Browser coverage verifies every settings family, live audio volume, music
  pause/resume, reload persistence, and the absence of the settings Save button.
