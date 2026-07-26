# Background music

Canonical issue: https://github.com/kiku-jw/teply-krug/issues/8

## Original task

Add the four supplied `Paper Jar Whispers` MP3 tracks as background music.
Music starts when a game starts, plays the tracks in a random order, and can be
turned off or adjusted in volume.

## Goal

Give an active Zoom game a warm musical bed without covering conversation,
adding a visible music player, or coupling music to the existing paper/glass
sound effects.

## Acceptance criteria

- **AC1: Four local tracks.** All four supplied MP3 files are accepted into the
  static site under neutral repository filenames. They are transcoded to a
  consistent background loudness and practical bitrate, total no more than
  14 MB, and no source path outside the repository is referenced at runtime.
- **AC2: Random cycle without repeats.** A new game starts from a shuffled
  four-track queue. Every track plays once before the queue reshuffles. The
  first track of a new cycle cannot equal the final track of the previous
  cycle.
- **AC3: Browser-safe lifecycle.** Playback begins only from the host's explicit
  `Начать игру` or `Продолжить` click, satisfying browser autoplay rules. Music
  continues through questions, checkpoints, and in-game settings, stops on the
  final/welcome screens, and never blocks the game if `play()` is rejected.
- **AC4: Separate host controls.** Settings contain a background-music switch
  and an accessible 0-100 volume slider with a visible percentage. Music
  changes are independent from the existing effects switch. Saving applies the
  setting immediately when a session is active.
- **AC5: Durable local preferences.** New installations default to music on at
  28%. Existing version-one and version-two local data migrate without losing
  players, current session, question history, custom cards, or existing
  settings. Music preference changes survive reload.
- **AC6: Small native implementation.** Use native `HTMLAudioElement`, a native
  range input, a small pure shuffle helper, and current storage/render patterns.
  Add no dependency, account, analytics, answer storage, audio service,
  equalizer, playlist UI, or runtime request outside the static Pages origin.
- **AC7: Responsive and accessible.** Settings remain readable without
  horizontal overflow at 390 x 844 and desktop widths. The slider has an
  explicit label and output; disabling music disables the slider visually and
  semantically.
- **AC8: Proof and release.** Unit tests cover shuffle invariants and storage
  migration. Browser tests cover start, random queue progression, volume,
  disable, persistence, resume, stop, and independence from effects.
  `npm run check`, `npm run test:e2e`, media/loudness inspection,
  `git diff --check`, fresh skeptical verification, GitHub Pages deployment,
  and live asset readback all pass.

## Assumptions

- All four files are intentionally supplied for publication and may be used
  together.
- Track choice is intentionally hidden; the host controls only music on/off and
  volume.
- Volume is stored as an integer percentage and converted to the browser's
  0-1 audio volume at playback.

## Constraints

- Preserve the static host-controlled architecture and existing Pages URL.
- Preserve independent sound-effect and motion preferences.
- Do not use TypeScript assertions.
- Do not autoplay from page load or a background timer.
- Do not preload all four tracks.

## Non-goals

- Crossfading, beat matching, ducking, an equalizer, waveform display, track
  names, skip controls, downloads, uploads, or OS media-session integration.
- Playing music on the welcome, setup, or final reflection screens.
- Storing playback position across reloads.

## Verification plan

1. Inspect source duration, bitrate, loudness, and clipping; create four
   normalized static MP3 files and remeasure them.
2. Unit-test a pure Fisher-Yates shuffle and no-repeat cycle boundary.
3. Add schema migration tests for version-one and version-two storage.
4. Stub `HTMLMediaElement.play` in browser tests and inspect source order,
   volume, paused state, settings semantics, and local persistence.
5. Run the full local suite and inspect desktop/mobile settings screenshots.
6. Fetch, require a safe fast-forward, publish the exact verified revision,
   wait for Pages, and read back the live bundle plus all four MP3 headers.

## Stop conditions

- Any supplied audio file is corrupt, clipped beyond safe normalization, or
  cannot be reduced under the aggregate media budget without obvious damage.
- Existing saved sessions cannot be migrated without reset.
- The final branch is no longer a safe fast-forward or unrelated user changes
  overlap the same files.
