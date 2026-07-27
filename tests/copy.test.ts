import { describe, expect, it } from "vitest";

import indexSource from "../index.html?raw";
import interfaceSource from "../src/main.ts?raw";
import readmeSource from "../README.md?raw";
import editorialGuideSource from "../docs/editorial-guide.md?raw";

describe("visible interface copy", () => {
  it("stays free of the known generated and gendered phrases", () => {
    expect(interfaceSource).not.toMatch(/[—–]/u);
    expect(interfaceSource).not.toMatch(/каждый[^.]{0,80}\bему\b/iu);
    expect(interfaceSource).not.toContain("Слушаем без спешки");
    expect(interfaceSource).not.toContain("Тёплый круг");
    expect(interfaceSource).not.toContain("для ${playerName}");
    expect(interfaceSource).not.toContain("с ${escapeHtml(partner.name)}");
  });

  it("presents one game for in-person and video groups", () => {
    expect(interfaceSource).toContain("в одной комнате или по видеосвязи");
    expect(interfaceSource).not.toMatch(/экран в Zoom/iu);
    expect(readmeSource).toMatch(/in person or over video/iu);
    expect(editorialGuideSource).toMatch(/in one room or over video/iu);
    expect(readmeSource).not.toMatch(/small Zoom groups|shared Zoom screen|Zoom-compatibility/iu);
    expect(editorialGuideSource).not.toMatch(/Zoom evening/iu);
    expect(indexSource).not.toMatch(/компании в Zoom/iu);
    expect(indexSource).toContain("для игры вместе или по видеосвязи");
  });

  it("states the content and privacy rules without hidden-depth marketing", () => {
    expect(interfaceSource).toContain("В игре есть вопросы о Библии, служении и личном духовном опыте.");
    expect(interfaceSource).toContain("Любой вопрос можно пропустить без объяснений.");
    expect(interfaceSource).toContain("Игра их не записывает, не анализирует и никому не отправляет.");
    expect(indexSource).toContain("вопросы о Библии, служении и личном духовном опыте");
    expect(interfaceSource).not.toMatch(/скрыт\w* глубин|невидим\w* этап/iu);
    expect(readmeSource).not.toMatch(/hidden depth|invisible stages|difficulty levels/iu);
  });
});
