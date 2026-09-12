import { expect, test } from "@playwright/test";

import { coupleQuestions } from "../../src/content/couples";

async function startCouplesGame(page: import("@playwright/test").Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./dvoe/");
  await page.getByLabel("Первое имя").fill("Аня");
  await page.getByLabel("Второе имя").fill("Миша");
  await page.getByRole("button", { name: "Начать разговор" }).click();
  await expect(page.locator(".couple-question-card")).toBeVisible();
}

async function currentQuestion(page: import("@playwright/test").Page): Promise<string> {
  return page.locator(".couple-question-card h1").innerText();
}

test("the direct couples route is unlisted and explains the shared-answer flow", async ({ page }) => {
  await page.goto("./dvoe/");
  await expect(page).toHaveTitle("Секретная банка для двоих");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  await expect(page.getByRole("heading", { name: "Разговор, в котором слышно обоих" })).toBeVisible();
  await expect(page.getByText("Оба отвечают", { exact: true })).toBeVisible();
  await expect(page.getByText("Ответы нигде не вводятся и не сохраняются.", { exact: true })).toBeVisible();

  await page.goto("./");
  await expect(page.locator('a[href*="dvoe"]')).toHaveCount(0);
});

test("both names are required and distinguishable", async ({ page }) => {
  await page.goto("./dvoe/");
  await page.getByLabel("Первое имя").fill("Аня");
  await page.getByRole("button", { name: "Начать разговор" }).click();
  await expect(page.getByText("Введите оба имени.", { exact: true })).toBeVisible();

  await page.getByLabel("Второе имя").fill("Аня");
  await page.getByRole("button", { name: "Начать разговор" }).click();
  await expect(page.getByText(/короткое уточнение/iu)).toBeVisible();
});

test("answering alternates who starts and persists the current question", async ({ page }) => {
  await page.goto("./dvoe/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByLabel("Первое имя").fill("Аня");
  await page.getByLabel("Второе имя").fill("Миша");
  await page.getByRole("button", { name: "Начать разговор" }).click();
  await expect(page.locator(".couple-question-card")).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const firstQuestion = await currentQuestion(page);
  await expect(page.locator(".speaker-chip").first()).toContainText("Аня");
  await expect(page.getByRole("button", { name: "Ответили оба" })).toBeVisible();
  await expect(page.locator("textarea, input[name*='answer']")).toHaveCount(0);

  await page.getByRole("button", { name: "Ответили оба" }).click();
  const secondQuestion = await currentQuestion(page);
  expect(secondQuestion).not.toBe(firstQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Миша");

  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem("banka:couples:v1");
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    return {
      keys: Object.keys(parsed).sort(),
      answeredCount: Reflect.get(parsed, "answeredCount"),
      currentQuestionId: Reflect.get(parsed, "currentQuestionId"),
      serialized: raw,
    };
  });
  expect(stored).not.toBeNull();
  expect(stored?.keys).toEqual(["answeredCount", "currentQuestionId", "names", "seenQuestionIds", "version"]);
  expect(stored?.answeredCount).toBe(1);
  expect(stored?.serialized).not.toMatch(/response|answerText|answerValue/iu);

  await page.reload();
  await expect(page.locator(".couple-question-card h1")).toHaveText(secondQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Миша");
});

test("skipping changes the card without changing who starts", async ({ page }) => {
  await startCouplesGame(page);
  const firstQuestion = await currentQuestion(page);
  await page.getByRole("button", { name: "Другой вопрос" }).click();
  expect(await currentQuestion(page)).not.toBe(firstQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Аня");

  const answeredCount = await page.evaluate(() => {
    const raw = localStorage.getItem("banka:couples:v1");
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? Reflect.get(parsed, "answeredCount")
      : null;
  });
  expect(answeredCount).toBe(0);
});

test("left and right swipes match the two visible actions", async ({ page }) => {
  await startCouplesGame(page);
  const card = page.locator(".couple-question-card");
  const firstQuestion = await currentQuestion(page);
  const firstBox = await card.boundingBox();
  expect(firstBox).not.toBeNull();
  if (firstBox === null) {
    return;
  }
  await page.mouse.move(firstBox.x + firstBox.width * 0.7, firstBox.y + firstBox.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(firstBox.x + firstBox.width * 0.25, firstBox.y + firstBox.height * 0.5, { steps: 6 });
  await page.mouse.up();
  expect(await currentQuestion(page)).not.toBe(firstQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Аня");

  const secondQuestion = await currentQuestion(page);
  const secondBox = await card.boundingBox();
  expect(secondBox).not.toBeNull();
  if (secondBox === null) {
    return;
  }
  await page.mouse.move(secondBox.x + secondBox.width * 0.3, secondBox.y + secondBox.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(secondBox.x + secondBox.width * 0.75, secondBox.y + secondBox.height * 0.5, { steps: 6 });
  await page.mouse.up();
  expect(await currentQuestion(page)).not.toBe(secondQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Миша");
});

test("arrow keys provide the same controls on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Hardware keyboards are covered by the desktop project.");
  await startCouplesGame(page);
  const firstQuestion = await currentQuestion(page);
  await page.keyboard.press("ArrowLeft");
  expect(await currentQuestion(page)).not.toBe(firstQuestion);
  await expect(page.locator(".speaker-chip").first()).toContainText("Аня");

  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".speaker-chip").first()).toContainText("Миша");
});

test("finishing the deck hands the conversation back to the couple", async ({ page }) => {
  const ids = coupleQuestions.map((question) => question.id);
  await page.addInitScript((questionIds) => {
    localStorage.setItem("banka:couples:v1", JSON.stringify({
      version: 1,
      names: { first: "Аня", second: "Миша" },
      seenQuestionIds: questionIds,
      currentQuestionId: null,
      answeredCount: 64,
    }));
  }, ids);
  await page.goto("./dvoe/");
  await expect(page.getByRole("heading", { name: "Теперь карточка не нужна" })).toBeVisible();
  await expect(page.getByText("Что из сегодняшнего разговора тебе хочется продолжить?", { exact: true })).toBeVisible();
});

test("the couples page fits a 320px viewport without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await startCouplesGame(page);
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole("button", { name: "Другой вопрос" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ответили оба" })).toBeVisible();
});
