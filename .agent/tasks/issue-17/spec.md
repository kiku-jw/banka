# Immediate settings

Canonical issue: https://github.com/kiku-jw/banka/issues/17

## Original task

Set background music to 20% by default. Apply music volume changes immediately,
without requiring a Save action. Remove the settings Save button and persist
every setting as soon as it changes.

## Acceptance criteria

- **AC1:** A new browser profile keeps the existing 20% background-music
  default, while previously stored valid user volume preferences remain intact.
- **AC2:** Moving the enabled music-volume slider updates its percentage,
  persists the integer value locally, and updates the active audio element
  before the host leaves settings.
- **AC3:** Enabling or disabling music applies immediately: the slider state,
  local preference, and active playback state stay synchronized.
- **AC4:** Timer, sound effects, motion, Bible questions, and ministry questions
  persist immediately when their controls change.
- **AC5:** Settings have no Save button. Back remains the explicit navigation
  control, and no settings change depends on form submission.
- **AC6:** The implementation remains static, local-only, dependency-free, and
  preserves browser-autoplay-safe music startup.
- **AC7:** `npm run check`, `npm run test:e2e`, fresh verification, GitHub Pages
  deployment, and live production readback pass.

## Constraints

- Preserve the `teply-krug:v1` storage key and version-four stored-data shape.
- Do not overwrite a valid stored music volume merely because the default is
  20%.
- Keep visible product copy in natural Russian.
- Add no dependency, account, network service, analytics, or answer storage.
- Use existing TypeScript and DOM patterns without type assertions.

## Non-goals

- Adding volume control for sound effects.
- Adding track selection, playback controls, crossfading, or an audio mixer.
- Changing the feedback dialog or custom-card editor Save actions.
- Resetting existing users' valid stored preferences.

## Assumptions

- "20% by default" means a fresh or migrated preference with no valid music
  volume; it does not mean forcibly replacing an intentional stored volume.
- Immediate persistence should not display a toast for every slider movement.

## Verification plan

1. Extend browser coverage to prove the absence of the settings Save button and
   immediate persistence for every settings control.
2. Prove active audio volume changes while the settings page is still open,
   including music disable and re-enable behavior.
3. Keep unit migration/default coverage at 20% and run the full unit/build and
   Playwright suites.
4. Inspect the diff, run a fresh verifier pass, publish the verified revision,
   wait for Pages, and read back the production UI and bundle behavior.
