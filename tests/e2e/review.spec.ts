import { expect, test } from "@playwright/test";

test("all questions can be reviewed, saved locally, and exported", async ({ page }, testInfo) => {
  await page.goto("./review.html");

  await expect(page.getByRole("heading", { name: "Отметь вопросы, которые звучат странно" })).toBeVisible();
  await expect(page.locator(".review-item")).toHaveCount(360);
  await expect(page.getByText("Ничего не отправляется автоматически.")).toBeVisible();

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBe(viewportWidth);

  await page.getByLabel("Отметить вопрос 1", { exact: true }).check();
  await page.getByLabel("Комментарий к вопросу 1", { exact: true }).fill("Слишком сложно вспомнить сходу");
  await expect(page.getByText("1 отмечен", { exact: true })).toHaveCount(2);

  await page.reload();
  await expect(page.getByLabel("Отметить вопрос 1", { exact: true })).toBeChecked();
  await expect(page.getByLabel("Комментарий к вопросу 1", { exact: true })).toHaveValue("Слишком сложно вспомнить сходу");

  await page.getByRole("button", { name: "Только отмеченные · 1" }).click();
  await expect(page.locator(".review-item")).toHaveCount(1);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Скачать .txt" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("dostavay-question-review.txt");
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();

  await page.screenshot({ path: testInfo.outputPath("question-review.png"), fullPage: true });
});

test("questions can be found by number or wording", async ({ page }) => {
  await page.goto("./review.html");

  const search = page.getByLabel("Поиск по номеру или тексту");
  await search.fill("ковчег");
  await expect(page.locator(".review-item")).not.toHaveCount(0);
  await expect(page.locator(".review-question p")).toContainText(["ковчег"]);

  await search.fill("147");
  await expect(page.locator(".review-item")).toHaveCount(1);
  await expect(page.locator(".review-number")).toHaveText("147");
});

test("a comment-only draft can still be cleared", async ({ page }) => {
  await page.goto("./review.html");

  const reset = page.getByRole("button", { name: "Сбросить" });
  await expect(reset).toBeDisabled();
  await page.getByLabel("Комментарий к вопросу 1", { exact: true }).fill("Проверить формулировку");
  await expect(reset).toBeEnabled();

  page.on("dialog", (dialog) => dialog.accept());
  await reset.click();
  await expect(page.getByLabel("Комментарий к вопросу 1", { exact: true })).toHaveValue("");
  await expect(reset).toBeDisabled();
});
