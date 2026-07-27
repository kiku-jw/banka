import { expect, test } from "@playwright/test";

async function startGame(
  page: import("@playwright/test").Page,
  count = 6,
  animated = false,
  mode: "quick" | "standard" | "open" = "standard",
): Promise<void> {
  if (!animated) {
    await page.emulateMedia({ reducedMotion: "reduce" });
  }
  await page.goto("./");
  await page.getByRole("button", { name: "Собрать компанию" }).click();
  const names = Array.from({ length: count }, (_, index) => `Игрок ${index + 1}`);
  await page.getByLabel("Имена по порядку ходов").fill(names.join(", "));
  await page.locator(`input[name="session-mode"][value="${mode}"]`).check();
  await page.getByRole("button", { name: "Начать игру" }).click();
  await expect(page.getByRole("heading", { name: "Игрок 1" })).toBeVisible();
}

async function reveal(page: import("@playwright/test").Page): Promise<void> {
  await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
  await expect(page.locator(".question-card")).toBeVisible();
}

async function openFallbacks(page: import("@playwright/test").Page): Promise<void> {
  const summary = page.getByText("Если вопрос не подходит", { exact: true });
  await summary.click();
  await expect(page.getByRole("button", { name: /Другой вопрос/ })).toBeVisible();
}

test("the jar uses an intro and three short repeat treatments", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value() {
        return Promise.resolve();
      },
    });
  });
  await startGame(page, 6, true);

  await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
  await expect(page.locator(".jar-reveal-intro")).toBeVisible();
  const intro = page.locator("#jar-reveal-video");
  await expect(intro).toHaveAttribute("src", /question-jar-intro\.mp4$/);
  await intro.evaluate((video) => video.dispatchEvent(new Event("ended")));

  const variants = ["shuffle", "pop", "unfold"];
  for (const variant of variants) {
    await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
    await page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true }).click();
    const quick = page.locator("#jar-reveal-video");
    await expect(quick).toHaveAttribute("src", /question-jar-quick\.mp4$/);
    await expect(page.locator(`.jar-reveal-${variant}`)).toBeVisible();
    if (variant === "unfold") {
      await expect(page.locator(".reveal-paper")).toBeVisible();
    }
    await quick.evaluate((video) => video.dispatchEvent(new Event("ended")));
  }
});

test("bulk names and two-person play work without tokens", async ({ page }) => {
  await startGame(page, 2, false, "open");
  await expect(page.getByText(/жетон/iu)).toHaveCount(0);
  await reveal(page);
  await openFallbacks(page);
  await page.getByRole("button", { name: /Ответить вместе/ }).click();
  await expect(page.getByText("Вдвоём: Игрок 1 и Игрок 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "ДАЛЬШЕ", exact: true })).toBeEnabled();
});

test("the first question is Bible-based and session state uses the new model", async ({ page }) => {
  await startGame(page);
  const state = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return null;
    }
    const stored: unknown = JSON.parse(raw);
    if (typeof stored !== "object" || stored === null) {
      return null;
    }
    const session = Reflect.get(stored, "session");
    return {
      version: Reflect.get(stored, "version"),
      card: typeof session === "object" && session !== null ? Reflect.get(session, "currentCardId") : null,
      mode: typeof session === "object" && session !== null ? Reflect.get(session, "mode") : null,
      stage: typeof session === "object" && session !== null ? Reflect.get(session, "stage") : "missing",
    };
  });
  expect(state).toEqual({
    version: 4,
    card: expect.stringContaining("spark-bible-"),
    mode: "standard",
    stage: undefined,
  });
});

test("the host can turn Bible and ministry questions off independently", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Настройки" }).click();
  await page.getByLabel("Библейские вопросы").uncheck();
  await page.getByRole("checkbox", { name: /^Служение/u }).uncheck();
  await page.getByRole("button", { name: "Сохранить" }).click();

  await page.getByRole("button", { name: "Собрать компанию" }).click();
  await page.getByLabel("Имена по порядку ходов").fill("Аня\nБорис");
  await page.getByRole("button", { name: "Начать игру" }).click();

  const disabledState = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    const stored: unknown = raw === null ? null : JSON.parse(raw);
    const preferences = typeof stored === "object" && stored !== null
      ? Reflect.get(stored, "preferences")
      : null;
    const session = typeof stored === "object" && stored !== null
      ? Reflect.get(stored, "session")
      : null;
    return {
      bibleQuestionsEnabled: typeof preferences === "object" && preferences !== null
        ? Reflect.get(preferences, "bibleQuestionsEnabled")
        : null,
      ministryQuestionsEnabled: typeof preferences === "object" && preferences !== null
        ? Reflect.get(preferences, "ministryQuestionsEnabled")
        : null,
      currentCardId: typeof session === "object" && session !== null
        ? Reflect.get(session, "currentCardId")
        : null,
    };
  });

  expect(disabledState.bibleQuestionsEnabled).toBe(false);
  expect(disabledState.ministryQuestionsEnabled).toBe(false);
  expect(disabledState.currentCardId).not.toContain("-bible-");
  expect(disabledState.currentCardId).not.toContain("-service-");

  await openFallbacks(page);
  await page.getByRole("button", { name: /Выбрать тему/ }).click();
  await expect(page.getByRole("button", { name: "Библия", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Служение", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Закрыть" }).click();

  await page.getByRole("button", { name: "Настройки" }).click();
  await page.getByLabel("Библейские вопросы").check();
  await page.getByRole("button", { name: "Сохранить" }).click();
  await openFallbacks(page);
  await page.getByRole("button", { name: /Выбрать тему/ }).click();
  await page.getByRole("button", { name: "Библия", exact: true }).click();

  const reenabledCardId = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    const stored: unknown = raw === null ? null : JSON.parse(raw);
    const session = typeof stored === "object" && stored !== null
      ? Reflect.get(stored, "session")
      : null;
    return typeof session === "object" && session !== null
      ? Reflect.get(session, "currentCardId")
      : null;
  });
  expect(reenabledCardId).toContain("-bible-");
});

test("one-step back restores the previous player and revealed question", async ({ page }) => {
  await startGame(page, 2, false, "open");
  await reveal(page);
  const question = await page.locator(".question-card p").textContent();
  await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Игрок 2" })).toBeVisible();
  await page.getByRole("button", { name: "← Назад", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Игрок 1" })).toBeVisible();
  await expect(page.locator(".question-card p")).toHaveText(question ?? "");
  await expect(page.getByRole("button", { name: "← Назад", exact: true })).toHaveCount(0);
});

test("a marked question can be commented on and included in a support email", async ({ page }) => {
  await startGame(page, 2, false, "open");
  await reveal(page);
  await page.getByRole("button", { name: "Отметить вопрос" }).click();
  await page.getByLabel(/Комментарий/).fill("Слишком узкий вопрос");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("button", { name: "Вопрос отмечен ✓" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await reveal(page);
  await expect(page.getByRole("button", { name: "Вопрос отмечен ✓" })).toBeVisible();
  await page.getByRole("button", { name: "Вопрос отмечен ✓" }).click();
  await page.getByLabel(/Комментарий/).fill("Понятнее, если сформулировать шире");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await openFallbacks(page);
  await page.getByRole("button", { name: /Закончить вечер/ }).click();
  const link = page.getByRole("link", { name: "Отправить замечания" });
  await expect(link).toHaveAttribute("href", /^mailto:support@kikuai\.dev\?/u);
  await expect(link).toHaveAttribute("href", /%D0%9F%D0%BE%D0%BD%D1%8F%D1%82%D0%BD%D0%B5%D0%B5/u);
});

test("checkpoint back restores the final turn of the round", async ({ page }) => {
  await startGame(page, 2, false, "open");
  await reveal(page);
  await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
  await reveal(page);
  const question = await page.locator(".question-card p").textContent();
  await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Все ответили" })).toBeVisible();
  await page.getByRole("button", { name: "← Вернуться к прошлому ходу" }).click();
  await expect(page.getByRole("heading", { name: "Игрок 2" })).toBeVisible();
  await expect(page.locator(".question-card p")).toHaveText(question ?? "");
});

test("a quick twelve-person session reaches a natural finish checkpoint", async ({ page }) => {
  await startGame(page, 12, false, "quick");
  for (let index = 0; index < 12; index += 1) {
    await reveal(page);
    await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "Можно завершать" })).toBeVisible();
  await expect(page.getByText(/Ещё один круг займёт примерно/)).toBeVisible();
  await page.getByRole("button", { name: "Ещё круг" }).click();
  await expect(page.getByRole("heading", { name: "Игрок 1" })).toBeVisible();
});

test("the compact fallback menu stays reusable after reload", async ({ page }) => {
  await startGame(page);
  await openFallbacks(page);
  await page.getByRole("button", { name: /Другой вопрос/ }).click();
  await expect(page.locator(".question-card")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await openFallbacks(page);
  await expect(page.getByRole("button", { name: /Другой вопрос/ })).toBeEnabled();
});

test("answering together and choosing a theme stay optional", async ({ page }) => {
  await startGame(page, 3);
  await reveal(page);
  await openFallbacks(page);
  await page.getByRole("button", { name: /Ответить вместе/ }).click();
  await page.getByRole("button", { name: "Игрок 2", exact: true }).click();
  await expect(page.getByText("Вдвоём: Игрок 1 и Игрок 2")).toBeVisible();

  await openFallbacks(page);
  await page.getByRole("button", { name: /Выбрать тему/ }).click();
  await page.getByRole("button", { name: "Библия", exact: true }).click();
  await expect(page.locator(".question-card")).toBeVisible();
  const currentCardId = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return "";
    }
    const stored: unknown = JSON.parse(raw);
    const session = typeof stored === "object" && stored !== null ? Reflect.get(stored, "session") : null;
    const id = typeof session === "object" && session !== null ? Reflect.get(session, "currentCardId") : null;
    return typeof id === "string" ? id : "";
  });
  expect(currentCardId).toContain("-bible-");
});

test("an unavailable host theme keeps the current question intact", async ({ page }) => {
  await startGame(page, 2);
  const initialCardId = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return "";
    }
    const stored: unknown = JSON.parse(raw);
    const session = typeof stored === "object" && stored !== null ? Reflect.get(stored, "session") : null;
    const id = typeof session === "object" && session !== null ? Reflect.get(session, "currentCardId") : null;
    return typeof id === "string" ? id : "";
  });
  await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return;
    }
    const stored: unknown = JSON.parse(raw);
    if (typeof stored !== "object" || stored === null) {
      return;
    }
    const preferences = Reflect.get(stored, "preferences");
    if (typeof preferences !== "object" || preferences === null) {
      return;
    }
    const creativeIds = ["spark", "closer", "together"].flatMap((stage) =>
      Array.from({ length: 24 }, (_, index) => `${stage}-creative-${index + 1}`),
    );
    Reflect.set(preferences, "disabledBuiltInCardIds", creativeIds);
    localStorage.setItem("teply-krug:v1", JSON.stringify(stored));
  });
  await page.reload();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await openFallbacks(page);
  await page.getByRole("button", { name: /Выбрать тему/ }).click();
  await page.getByRole("button", { name: "Показать или придумать" }).click();
  await expect(page.getByText("В этой теме пока нет доступных вопросов.")).toBeVisible();
  await expect(page.getByRole("button", { name: "ВЫТЯНУТЬ", exact: true })).toBeVisible();
  const remainingCardId = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return "";
    }
    const stored: unknown = JSON.parse(raw);
    const session = typeof stored === "object" && stored !== null ? Reflect.get(stored, "session") : null;
    const id = typeof session === "object" && session !== null ? Reflect.get(session, "currentCardId") : null;
    return typeof id === "string" ? id : "";
  });
  expect(remainingCardId).toBe(initialCardId);
});

test("soft timer reaches zero without advancing the turn", async ({ page }) => {
  await page.clock.install();
  await startGame(page);
  await reveal(page);
  await page.clock.runFor("00:01:16");
  await expect(page.locator("#timer-display")).toHaveText("0:00");
  await expect(page.getByRole("heading", { name: "Игрок 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ДАЛЬШЕ", exact: true })).toBeEnabled();
});

test("paper and glass cues follow the host sound setting", async ({ page }) => {
  await page.addInitScript(() => {
    const starts: number[] = [];
    Object.defineProperty(window, "__soundStarts", { value: starts });
    class QuietAudioContext {
      currentTime = 0;
      sampleRate = 8000;
      destination = {};

      createBuffer(_channels: number, length: number) {
        return { getChannelData: () => new Float32Array(length) };
      }

      createBufferSource() {
        return {
          buffer: null,
          connect() {},
          start() {
            starts.push(1);
          },
        };
      }

      createBiquadFilter() {
        return {
          type: "bandpass",
          frequency: { value: 0 },
          Q: { value: 0 },
          connect() {},
        };
      }

      createOscillator() {
        return {
          type: "sine",
          frequency: { setValueAtTime() {} },
          connect() {},
          start() {
            starts.push(1);
          },
          stop() {},
        };
      }

      createGain() {
        return {
          gain: {
            value: 0,
            setValueAtTime() {},
            exponentialRampToValueAtTime() {},
          },
          connect() {},
        };
      }

      close() {
        return Promise.resolve();
      }
    }
    Object.defineProperty(window, "AudioContext", { value: QuietAudioContext });
  });

  await startGame(page);
  await reveal(page);
  const enabledCount = await page.evaluate(() => {
    const values = Reflect.get(window, "__soundStarts");
    return Array.isArray(values) ? values.length : 0;
  });
  expect(enabledCount).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Настройки" }).click();
  await page.getByLabel("Звуковые эффекты").uncheck();
  await page.getByRole("button", { name: "Сохранить" }).click();
  await page.getByRole("button", { name: "ДАЛЬШЕ", exact: true }).click();
  const disabledCount = await page.evaluate(() => {
    const values = Reflect.get(window, "__soundStarts");
    return Array.isArray(values) ? values.length : 0;
  });
  expect(disabledCount).toBe(enabledCount);
});

test("background music uses a shuffled cycle and separate persistent controls", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
    const plays: string[] = [];
    const pauses: number[] = [];
    Object.defineProperty(window, "__musicPlays", { value: plays });
    Object.defineProperty(window, "__musicPauses", { value: pauses });
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value() {
        if (this instanceof HTMLAudioElement && this.id === "background-music") {
          plays.push(this.getAttribute("src") ?? "");
        }
        return Promise.resolve();
      },
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value() {
        if (this instanceof HTMLAudioElement && this.id === "background-music") {
          pauses.push(1);
        }
      },
    });
  });

  await startGame(page, 2);
  const audio = page.locator("#background-music");
  await expect(audio).toHaveAttribute("src", /paper-jar-whispers-\d\.mp3$/);
  await expect.poll(async () => audio.evaluate((element) =>
    element instanceof HTMLAudioElement ? element.volume : -1
  )).toBe(0.5);

  for (let index = 0; index < 4; index += 1) {
    await audio.evaluate((element) => element.dispatchEvent(new Event("ended")));
  }
  const cycle = await page.evaluate(() => {
    const values = Reflect.get(window, "__musicPlays");
    return Array.isArray(values) ? values.filter((value) => typeof value === "string") : [];
  });
  expect(new Set(cycle.slice(0, 4)).size).toBe(4);
  expect(cycle[4]).not.toBe(cycle[3]);

  await page.getByRole("button", { name: "Настройки" }).click();
  await expect(page.getByLabel("Фоновая музыка")).toBeChecked();
  const volume = page.getByLabel("Громкость музыки");
  await expect(volume).toHaveValue("50");
  await volume.fill("43");
  await expect(page.locator("#music-volume-value")).toHaveText("43%");
  await page.getByLabel("Фоновая музыка").uncheck();
  await expect(volume).toBeDisabled();
  await page.getByRole("button", { name: "Сохранить" }).click();

  const preferences = await page.evaluate(() => {
    const raw = localStorage.getItem("teply-krug:v1");
    if (raw === null) {
      return null;
    }
    const stored: unknown = JSON.parse(raw);
    if (typeof stored !== "object" || stored === null) {
      return null;
    }
    const value = Reflect.get(stored, "preferences");
    return typeof value === "object" && value !== null
      ? {
          musicEnabled: Reflect.get(value, "musicEnabled"),
          musicVolume: Reflect.get(value, "musicVolume"),
          soundEnabled: Reflect.get(value, "soundEnabled"),
        }
      : null;
  });
  expect(preferences).toEqual({
    musicEnabled: false,
    musicVolume: 43,
    soundEnabled: true,
  });
  const pauseCount = await page.evaluate(() => {
    const values = Reflect.get(window, "__musicPauses");
    return Array.isArray(values) ? values.length : 0;
  });
  expect(pauseCount).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Настройки" }).click();
  await expect(page.getByLabel("Громкость музыки")).toHaveValue("43");
  await page.getByLabel("Фоновая музыка").check();
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect.poll(async () => audio.evaluate((element) =>
    element instanceof HTMLAudioElement ? element.volume : -1
  )).toBe(0.43);
  await expect(audio).toHaveAttribute("src", /paper-jar-whispers-\d\.mp3$/);

  await page.reload();
  await expect(audio).not.toHaveAttribute("src", /paper-jar-whispers-\d\.mp3$/);
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(audio).toHaveAttribute("src", /paper-jar-whispers-\d\.mp3$/);
  await expect.poll(async () => audio.evaluate((element) =>
    element instanceof HTMLAudioElement ? element.volume : -1
  )).toBe(0.43);

  await reveal(page);
  await openFallbacks(page);
  await page.getByRole("button", { name: /Закончить вечер/ }).click();
  await expect(page.getByRole("heading", { name: "Последняя записка" })).toBeVisible();
  expect(await audio.getAttribute("src")).toBeNull();
});

test("the real browser starts background music from the host action", async ({ page }) => {
  await startGame(page, 2);
  const audio = page.locator("#background-music");

  await expect(audio).toHaveAttribute("src", /paper-jar-whispers-\d\.mp3$/);
  await expect.poll(async () => audio.evaluate((element) =>
    element instanceof HTMLAudioElement && !element.paused
  )).toBe(true);
});

test("the host can finish after any revealed question", async ({ page }) => {
  await startGame(page);
  await reveal(page);
  await openFallbacks(page);
  await page.getByRole("button", { name: /Закончить вечер/ }).click();
  await expect(page.getByRole("heading", { name: "Последняя записка" })).toBeVisible();
  await expect(page.getByText("Что за этот вечер запомнилось больше всего?")).toBeVisible();
  await expect(page.locator(".finish-note")).toBeVisible();
});

test("the deck editor lives inside host settings", async ({ page }) => {
  await startGame(page);
  await expect(page.getByRole("button", { name: "Колода", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Настройки" }).click();
  await page.getByRole("button", { name: "Открыть колоду" }).click();
  await expect(page.getByRole("heading", { name: "Вопросы вашей компании" })).toBeVisible();
  await page.getByRole("button", { name: "Назад" }).click();
  await expect(page.getByRole("heading", { name: "Настройки игры" })).toBeVisible();
  await page.getByRole("button", { name: "Назад" }).click();
  await expect(page.getByRole("heading", { name: "Игрок 1" })).toBeVisible();
});

test("a previous saved session migrates and continues", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("teply-krug:v1", JSON.stringify({
      version: 1,
      preferences: {
        timerSeconds: 75,
        soundEnabled: true,
        motionEnabled: true,
        savedNames: ["Аня", "Борис"],
        seenCardIds: ["spark-bible-1"],
        disabledBuiltInCardIds: [],
      },
      session: {
        players: [
          { id: "player-1", name: "Аня", abilities: ["replace"], usedAbilities: [] },
          { id: "player-2", name: "Борис", abilities: ["replace"], usedAbilities: [] },
        ],
        currentPlayerIndex: 0,
        stage: "spark",
        round: 1,
        currentCardId: "spark-bible-1",
        alternativeCardIds: [],
        partnerPlayerId: null,
        groupHelpActive: false,
      },
      customCards: [],
    }));
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByRole("heading", { name: "Аня" })).toBeVisible();
  await expect(page.getByText(/жетон/iu)).toHaveCount(0);
});

test("an empty host-curated deck shows a recovery path", async ({ page }) => {
  await page.addInitScript(() => {
    const stages = ["spark", "closer", "together"];
    const categories = ["personal", "stories", "service", "bible", "creative"];
    const disabledBuiltInCardIds = stages.flatMap((stage) =>
      categories.flatMap((category) =>
        Array.from({ length: 24 }, (_, index) => `${stage}-${category}-${index + 1}`),
      ),
    );
    localStorage.setItem("teply-krug:v1", JSON.stringify({
      version: 2,
      preferences: {
        timerSeconds: 75,
        soundEnabled: true,
        motionEnabled: true,
        savedNames: ["Аня", "Борис"],
        seenCardIds: [],
        disabledBuiltInCardIds,
      },
      session: {
        players: [
          { id: "player-1", name: "Аня" },
          { id: "player-2", name: "Борис" },
        ],
        currentPlayerIndex: 0,
        round: 1,
        currentCardId: null,
        partnerPlayerId: null,
        mode: "open",
        turnsCompleted: 0,
        targetTurns: null,
        recentCardIds: [],
      },
      customCards: [],
    }));
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByRole("heading", { name: "В банке не осталось вопросов" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Открыть настройки" })).toBeVisible();
});
