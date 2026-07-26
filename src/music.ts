export function shuffledMusicQueue(
  tracks: readonly string[],
  previousTrack: string | null,
  random: () => number = Math.random,
): string[] {
  const queue = [...tracks];
  for (let index = queue.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    const swapIndex = Math.max(0, Math.min(index, randomIndex));
    const current = queue[index];
    const replacement = queue[swapIndex];
    if (current === undefined || replacement === undefined) {
      continue;
    }
    queue[index] = replacement;
    queue[swapIndex] = current;
  }

  const first = queue[0];
  if (previousTrack !== null && first === previousTrack && queue.length > 1) {
    const replacementIndex = queue.findIndex((track) => track !== previousTrack);
    const replacement = queue[replacementIndex];
    if (replacement !== undefined) {
      queue[0] = replacement;
      queue[replacementIndex] = first;
    }
  }
  return queue;
}
