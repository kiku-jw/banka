import { describe, expect, it } from "vitest";

import dvoeSource from "../dvoe/index.html?raw";
import indexSource from "../index.html?raw";
import couplesSource from "../src/couples.ts?raw";
import {
  COUPLE_THEMES,
  coupleQuestions,
} from "../src/content/couples";

describe("couples question deck", () => {
  it("contains 90 stable and unique questions", () => {
    expect(coupleQuestions).toHaveLength(90);
    expect(new Set(coupleQuestions.map((question) => question.id)).size).toBe(90);
    expect(new Set(coupleQuestions.map((question) => question.text)).size).toBe(90);
  });

  it("balances each theme across the three hidden depths", () => {
    for (const theme of COUPLE_THEMES) {
      const questions = coupleQuestions.filter((question) => question.theme === theme);
      expect(questions).toHaveLength(15);
      expect(questions.filter((question) => question.depth === "warm")).toHaveLength(5);
      expect(questions.filter((question) => question.depth === "closer")).toHaveLength(5);
      expect(questions.filter((question) => question.depth === "deep")).toHaveLength(5);
    }
  });

  it("asks open questions instead of evaluating a partner", () => {
    const checklistOpening = /^(?:Умеет ли|Есть ли|Нет ли|Не |Способна ли|Готова ли|Следит ли|Любит ли|Ценят ли|Часто ли|Редко ли|Высокие ли|Видна ли|Ставит ли|Стремится ли|Охотно ли|Быстро ли)/iu;
    const hostedTask = /\b(?:ответьте|обсудите|выберите|позовите|разыграйте)\b/iu;
    const thirdPersonJudgment = /\b(?:он|она|его|её)\b/iu;

    for (const question of coupleQuestions) {
      expect(question.text).toBe(question.text.trim());
      expect(question.text.endsWith("?")).toBe(true);
      expect(question.text).not.toMatch(checklistOpening);
      expect(question.text).not.toMatch(hostedTask);
      expect(question.text).not.toMatch(thirdPersonJudgment);
      expect(question.text).not.toMatch(/[—–]/u);
    }
  });
});

describe("couples privacy and discovery boundary", () => {
  it("keeps the direct page out of indexing and public navigation", () => {
    expect(dvoeSource).toContain('name="robots" content="noindex, nofollow, noarchive"');
    expect(dvoeSource).toContain('name="googlebot" content="noindex, nofollow, noarchive"');
    expect(indexSource).not.toMatch(/dvoe/iu);
  });

  it("uses isolated local progress without response capture or networking", () => {
    expect(couplesSource).toContain('const STORAGE_KEY = "banka:couples:v1"');
    expect(couplesSource).not.toContain("teply-krug:v1");
    expect(couplesSource).not.toMatch(/answer(?:Text|Value|Input)/u);
    expect(couplesSource).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon/u);
    expect(couplesSource).toContain("Ответы остаются между вами.");
  });
});
