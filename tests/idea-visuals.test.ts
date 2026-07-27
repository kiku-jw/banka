import { describe, expect, it } from "vitest";

import { builtInCards } from "../src/content/cards";
import {
  ideaVisualCardIds,
  ideaVisualForCard,
  ideaVisualForTurn,
} from "../src/content/idea-visuals";

describe("optional answer-idea visuals", () => {
  it("keeps the pilot rare, curated, and separate from card content", () => {
    expect(ideaVisualCardIds).toHaveLength(9);
    expect(new Set(ideaVisualCardIds).size).toBe(9);

    for (const cardId of ideaVisualCardIds) {
      const card = builtInCards.find((candidate) => candidate.id === cardId);
      expect(card).toBeDefined();
      expect(card?.mode).not.toBe("perform");
      expect(card?.text).not.toMatch(/картинк|изображен|посмотр|выбер.*из/iu);
      const visual = ideaVisualForCard(cardId);
      expect(visual).not.toBeNull();
      if (visual !== null) {
        expect(visual.src).toMatch(/^\.\/media\/ideas\/[a-z-]+\.webp$/u);
      }
    }
  });

  it("does not illustrate sensitive personal spiritual-story prompts", () => {
    const illustratedText = builtInCards
      .filter((card) => ideaVisualCardIds.includes(card.id))
      .map((card) => card.text)
      .join("\n");

    expect(illustratedText).not.toMatch(
      /истина появилась|полюбить Иегову|благодар|любовь братства|любишь наше братство/iu,
    );
  });

  it("suppresses an illustration after another illustrated card", () => {
    expect(
      ideaVisualForTurn(
        "spark-personal-3",
        ["spark-personal-9", "spark-personal-3"],
      ),
    ).toBeNull();
    expect(
      ideaVisualForTurn(
        "spark-personal-3",
        ["spark-stories-1", "spark-personal-3"],
      ),
    ).not.toBeNull();
  });

  it("leaves custom and ordinary built-in cards text-only", () => {
    expect(ideaVisualForCard("custom-1")).toBeNull();
    expect(ideaVisualForCard("spark-personal-1")).toBeNull();
  });
});
