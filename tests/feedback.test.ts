import { describe, expect, it } from "vitest";

import {
  clearCardFeedback,
  feedbackMailto,
  loadCardFeedback,
  removeCardFeedback,
  saveCardFeedback,
  upsertCardFeedback,
} from "../src/feedback";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

describe("question feedback", () => {
  it("stores, updates, removes, and clears local feedback", () => {
    const storage = new MemoryStorage();
    const first = { cardId: "card-1", cardText: "Первый вопрос?", comment: "" };
    const updated = { ...first, comment: "Слишком узко" };
    saveCardFeedback(upsertCardFeedback([], first), storage);
    expect(loadCardFeedback(storage)).toEqual([first]);
    saveCardFeedback(upsertCardFeedback(loadCardFeedback(storage), updated), storage);
    expect(loadCardFeedback(storage)).toEqual([updated]);
    saveCardFeedback(removeCardFeedback(loadCardFeedback(storage), first.cardId), storage);
    expect(loadCardFeedback(storage)).toEqual([]);
    clearCardFeedback(storage);
    expect(storage.length).toBe(0);
  });

  it("fails closed on malformed feedback", () => {
    const storage = new MemoryStorage();
    storage.setItem("banka:card-feedback:v1", JSON.stringify([{ cardId: 12 }]));
    expect(loadCardFeedback(storage)).toEqual([]);
  });

  it("prepares a reviewable support email without sending it", () => {
    const link = feedbackMailto([
      { cardId: "spark-personal-1", cardText: "Какой вопрос?", comment: "Непонятно" },
    ]);
    expect(link).toMatch(/^mailto:support@kikuai\.dev\?/u);
    expect(decodeURIComponent(link)).toContain("spark-personal-1");
    expect(decodeURIComponent(link)).toContain("Непонятно");
  });
});
