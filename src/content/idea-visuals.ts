export type IdeaVisualId =
  | "childhood-objects"
  | "bible-places"
  | "future-home"
  | "future-hobbies"
  | "friends-menu"
  | "travel-options";

export interface IdeaVisual {
  id: IdeaVisualId;
  src: string;
  position: string;
}

const ideaVisuals: Record<IdeaVisualId, IdeaVisual> = {
  "childhood-objects": {
    id: "childhood-objects",
    src: "./media/ideas/childhood-objects.webp",
    position: "66% 52%",
  },
  "bible-places": {
    id: "bible-places",
    src: "./media/ideas/bible-places.webp",
    position: "66% 48%",
  },
  "future-home": {
    id: "future-home",
    src: "./media/ideas/future-home.webp",
    position: "66% 48%",
  },
  "future-hobbies": {
    id: "future-hobbies",
    src: "./media/ideas/future-hobbies.webp",
    position: "66% 48%",
  },
  "friends-menu": {
    id: "friends-menu",
    src: "./media/ideas/friends-menu.webp",
    position: "64% 48%",
  },
  "travel-options": {
    id: "travel-options",
    src: "./media/ideas/travel-options.webp",
    position: "68% 50%",
  },
};

const visualByCardId = new Map<string, IdeaVisualId>([
  ["spark-personal-3", "childhood-objects"],
  ["together-personal-21", "childhood-objects"],
  ["spark-bible-6", "bible-places"],
  ["spark-bible-20", "future-home"],
  ["spark-bible-8", "future-hobbies"],
  ["together-personal-8", "friends-menu"],
  ["together-personal-17", "friends-menu"],
  ["spark-personal-9", "travel-options"],
  ["spark-stories-14", "travel-options"],
]);

export const ideaVisualCardIds = [...visualByCardId.keys()];

export function ideaVisualForCard(cardId: string): IdeaVisual | null {
  const visualId = visualByCardId.get(cardId);
  return visualId === undefined ? null : ideaVisuals[visualId];
}

export function ideaVisualForTurn(cardId: string, recentCardIds: string[]): IdeaVisual | null {
  const visual = ideaVisualForCard(cardId);
  if (visual === null) {
    return null;
  }
  const currentIsLast = recentCardIds.at(-1) === cardId;
  const previousCardId = currentIsLast ? recentCardIds.at(-2) : recentCardIds.at(-1);
  if (previousCardId !== undefined && ideaVisualForCard(previousCardId) !== null) {
    return null;
  }
  return visual;
}
