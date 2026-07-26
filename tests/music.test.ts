import { describe, expect, it } from "vitest";

import { shuffledMusicQueue } from "../src/music";

describe("background music queue", () => {
  const tracks = ["one.mp3", "two.mp3", "three.mp3", "four.mp3"];

  it("includes every track exactly once", () => {
    const queue = shuffledMusicQueue(tracks, null, () => 0.4);

    expect(queue).toHaveLength(tracks.length);
    expect(new Set(queue)).toEqual(new Set(tracks));
  });

  it("uses the supplied random source to shuffle tracks", () => {
    const values = [0, 0.5, 0.25];
    let index = 0;
    const queue = shuffledMusicQueue(tracks, null, () => {
      const value = values[index];
      index += 1;
      return value ?? 0;
    });

    expect(queue).toEqual(["three.mp3", "four.mp3", "two.mp3", "one.mp3"]);
  });

  it("does not repeat the previous track at a cycle boundary", () => {
    const queue = shuffledMusicQueue(tracks, "four.mp3", () => 0.99);

    expect(queue[0]).not.toBe("four.mp3");
    expect(new Set(queue)).toEqual(new Set(tracks));
  });

  it("handles an empty track list", () => {
    expect(shuffledMusicQueue([], "one.mp3")).toEqual([]);
  });
});
