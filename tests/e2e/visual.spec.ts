import { expect, test } from "@playwright/test";

test("captures the welcome composition", async ({ page }, testInfo) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Что сегодня попадётся?" })).toBeVisible();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBe(viewportWidth);
  await page.waitForTimeout(900);
  await page.screenshot({ path: testInfo.outputPath("welcome.png"), fullPage: true });
});

test("captures a revealed game card", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Собрать компанию" }).click();
  const names = ["Аня", "Борис", "Вера", "Глеб", "Даша", "Егор"];
  await page.getByLabel("Имена по порядку ходов").fill(names.join("\n"));
  await page.getByRole("button", { name: "Начать игру" }).click();
  await expect(page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true })).toBeVisible();
  await page.waitForTimeout(550);
  await page.screenshot({ path: testInfo.outputPath("jar-cover.png"), fullPage: true });
  await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
  await expect(page.locator(".question-card")).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("button", { name: "ДАЛЬШЕ", exact: true })).toBeInViewport();
    await expect(page.getByText("Если вопрос не подходит", { exact: true })).toBeInViewport();
  }
  await page.waitForTimeout(750);
  await page.screenshot({ path: testInfo.outputPath("game.png"), fullPage: true });
  await page.getByText("Если вопрос не подходит", { exact: true }).click();
  await page.getByRole("button", { name: /Закончить вечер/ }).click();
  await expect(page.getByRole("heading", { name: "Последняя записка" })).toBeVisible();
  await page.waitForTimeout(550);
  await page.screenshot({ path: testInfo.outputPath("finish.png"), fullPage: true });
});

test("captures an optional idea image without making it part of the prompt", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("teply-krug:v1", JSON.stringify({
      version: 3,
      preferences: {
        timerSeconds: 75,
        soundEnabled: false,
        musicEnabled: false,
        musicVolume: 50,
        motionEnabled: false,
        savedNames: ["Аня", "Борис"],
        seenCardIds: ["spark-personal-3"],
        disabledBuiltInCardIds: [],
      },
      session: {
        players: [
          { id: "player-1", name: "Аня" },
          { id: "player-2", name: "Борис" },
        ],
        currentPlayerIndex: 0,
        round: 1,
        currentCardId: "spark-personal-3",
        partnerPlayerId: null,
        mode: "open",
        turnsCompleted: 0,
        targetTurns: null,
        recentCardIds: ["spark-personal-3"],
      },
      customCards: [],
    }));
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
  const ideaImage = page.locator(".question-idea-image");
  await expect(ideaImage).toBeVisible();
  await expect(ideaImage).toHaveAttribute("alt", "");
  await expect(
    page.locator(".question-card").getByText(
      "Какую вещь из детства тебе было бы приятно снова подержать в руках?",
      { exact: true },
    ),
  ).toBeVisible();
  await expect.poll(
    () => ideaImage.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("idea-image.png"), fullPage: true });
});

test("captures the music settings without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Настройки" }).click();
  await expect(page.getByRole("heading", { name: "Настройте темп" })).toBeVisible();
  await expect(page.getByLabel("Фоновая музыка")).toBeChecked();
  await expect(page.getByLabel("Громкость музыки")).toHaveValue("50");
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBe(viewportWidth);
  await page.screenshot({ path: testInfo.outputPath("music-settings.png"), fullPage: true });
});

test("captures question feedback and the finish handoff", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.getByRole("button", { name: "Собрать компанию" }).click();
  await page.getByLabel("Имена по порядку ходов").fill("Аня\nБорис");
  await page.getByRole("button", { name: "Начать игру" }).click();
  await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
  await page.getByRole("button", { name: "Отметить вопрос" }).click();
  await expect(page.getByRole("heading", { name: "Что здесь не так?" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("feedback-dialog.png"), fullPage: true });
  await page.getByLabel(/Комментарий/).fill("Слишком узкий вопрос");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await page.getByText("Если вопрос не подходит", { exact: true }).click();
  await page.getByRole("button", { name: /Закончить вечер/ }).click();
  await expect(page.getByRole("link", { name: "Отправить замечания" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("feedback-finish.png"), fullPage: true });
});

test("captures the 1440 by 900 presentation viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One Chromium project is enough for this fixed viewport.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Что сегодня попадётся?" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
  await page.waitForTimeout(900);
  await page.screenshot({ path: testInfo.outputPath("welcome-1440.png"), fullPage: true });
});
