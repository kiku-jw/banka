# Background music implementation notes

## Approach

- Use one native `HTMLAudioElement`; no player UI and no dependency.
- Build a Fisher-Yates queue of the four local tracks.
- Play every track once per cycle and keep the next cycle from starting with
  the track that just ended.
- Start playback from the host's explicit Start or Continue click.
- Keep playback active through game, checkpoint, editor, and settings screens.
- Stop and clear playback on welcome, setup, and finish screens.
- Keep background music independent from Web Audio sound effects.

## Assets

The four supplied MP3 files were transcoded to stereo 44.1 kHz MP3 at 128
kbps, normalized toward -16 LUFS with a -1.5 dB true-peak target, stripped of
embedded artwork, and stored under `public/media/music/`.

The resulting bundle is 13,732,005 bytes:

- `paper-jar-whispers-1.mp3`: 2,872,727 bytes
- `paper-jar-whispers-2.mp3`: 3,721,602 bytes
- `paper-jar-whispers-3.mp3`: 3,776,355 bytes
- `paper-jar-whispers-4.mp3`: 3,361,321 bytes

Final EBU R128 measurements:

- Track 1: -16.2 LUFS, -1.1 dBFS true peak
- Track 2: -16.0 LUFS, -1.5 dBFS true peak
- Track 3: -16.4 LUFS, -1.7 dBFS true peak
- Track 4: -16.4 LUFS, -1.3 dBFS true peak

## Persistence

Local data moves from schema version 2 to version 3. Existing version 1 and
version 2 state is migrated in place. Missing music preferences default to
enabled at 28 percent volume.

## Lazy-senior receipt

- Lower rung chosen: native audio element, native range input, small typed
  shuffle helper, and the existing local-storage/rendering patterns.
- Repository-local implementation was more direct than adopting prior art or
  a new package.
- The added reusable logic is limited to queue shuffling, playback lifecycle,
  and schema migration; no broader audio abstraction was introduced.
