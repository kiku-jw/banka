import "./couples.css";

import {
  coupleQuestions,
  coupleThemeNames,
} from "./content/couples";
import type { CoupleDepth, CoupleQuestion } from "./content/couples";

interface CoupleNames {
  first: string;
  second: string;
}

interface CoupleState {
  version: 1;
  names: CoupleNames;
  seenQuestionIds: string[];
  currentQuestionId: string | null;
  answeredCount: number;
}

type CoupleScreen = "setup" | "game" | "finish";
type TransitionKind = "answered" | "skipped" | null;

const STORAGE_KEY = "banka:couples:v1";

const rootElement = document.querySelector<HTMLDivElement>("#couples-app");
const liveElement = document.querySelector<HTMLDivElement>("#couples-live");

if (rootElement === null || liveElement === null) {
  throw new Error("Required couples application roots are missing.");
}

const root: HTMLDivElement = rootElement;
const liveRegion: HTMLDivElement = liveElement;

function createDefaultState(): CoupleState {
  return {
    version: 1,
    names: { first: "", second: "" },
    seenQuestionIds: [],
    currentQuestionId: null,
    answeredCount: 0,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKnownQuestionId(value: string): boolean {
  return coupleQuestions.some((question) => question.id === value);
}

function readNames(value: unknown): CoupleNames | null {
  if (!isObject(value)
    || typeof value.first !== "string"
    || typeof value.second !== "string") {
    return null;
  }
  return {
    first: value.first.trim().slice(0, 30),
    second: value.second.trim().slice(0, 30),
  };
}

function loadState(storage: Storage = window.localStorage): CoupleState {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) {
    return createDefaultState();
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || parsed.version !== 1) {
      return createDefaultState();
    }
    const names = readNames(parsed.names);
    if (names === null
      || !Array.isArray(parsed.seenQuestionIds)
      || typeof parsed.answeredCount !== "number") {
      return createDefaultState();
    }
    const seenQuestionIds: string[] = [];
    for (const candidate of parsed.seenQuestionIds) {
      if (typeof candidate === "string"
        && isKnownQuestionId(candidate)
        && !seenQuestionIds.includes(candidate)) {
        seenQuestionIds.push(candidate);
      }
    }
    const currentQuestionId = typeof parsed.currentQuestionId === "string"
      && isKnownQuestionId(parsed.currentQuestionId)
      ? parsed.currentQuestionId
      : null;
    if (currentQuestionId !== null && !seenQuestionIds.includes(currentQuestionId)) {
      seenQuestionIds.push(currentQuestionId);
    }
    return {
      version: 1,
      names,
      seenQuestionIds,
      currentQuestionId,
      answeredCount: Math.max(0, Math.floor(parsed.answeredCount)),
    };
  } catch {
    return createDefaultState();
  }
}

function saveState(storage: Storage = window.localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function namesAreReady(names: CoupleNames): boolean {
  const first = names.first.trim();
  const second = names.second.trim();
  return first.length > 0
    && second.length > 0
    && first.length <= 30
    && second.length <= 30
    && first.toLocaleLowerCase("ru-RU") !== second.toLocaleLowerCase("ru-RU");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function announce(message: string): void {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 20);
}

function questionForId(id: string | null): CoupleQuestion | null {
  if (id === null) {
    return null;
  }
  return coupleQuestions.find((question) => question.id === id) ?? null;
}

function allowedDepths(shownCount: number): CoupleDepth[] {
  if (shownCount < 3) {
    return ["warm"];
  }
  if (shownCount < 8) {
    return ["warm", "closer"];
  }
  return ["warm", "closer", "deep"];
}

function drawNextQuestion(previousQuestionId: string | null): CoupleQuestion | null {
  const seen = new Set(state.seenQuestionIds);
  const unseen = coupleQuestions.filter((question) => !seen.has(question.id));
  if (unseen.length === 0) {
    return null;
  }

  const depths = allowedDepths(state.seenQuestionIds.length);
  const paced = unseen.filter((question) => depths.includes(question.depth));
  let candidates = paced.length > 0 ? paced : unseen;
  const previous = questionForId(previousQuestionId);
  if (previous !== null) {
    const varied = candidates.filter((question) => question.theme !== previous.theme);
    if (varied.length > 0) {
      candidates = varied;
    }
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? null;
}

function markQuestionShown(question: CoupleQuestion): void {
  if (!state.seenQuestionIds.includes(question.id)) {
    state.seenQuestionIds.push(question.id);
  }
  state.currentQuestionId = question.id;
}

function startFreshCycle(): void {
  state.seenQuestionIds = [];
  state.currentQuestionId = null;
  state.answeredCount = 0;
  const firstQuestion = drawNextQuestion(null);
  if (firstQuestion !== null) {
    markQuestionShown(firstQuestion);
  }
  screen = firstQuestion === null ? "finish" : "game";
  transitionKind = null;
  saveState();
  render();
  window.scrollTo(0, 0);
  focusQuestion();
}

function advance(answered: boolean): void {
  if (screen !== "game") {
    return;
  }
  const previousQuestionId = state.currentQuestionId;
  if (answered) {
    state.answeredCount += 1;
  }
  const nextQuestion = drawNextQuestion(previousQuestionId);
  state.currentQuestionId = null;
  if (nextQuestion !== null) {
    markQuestionShown(nextQuestion);
  }
  screen = nextQuestion === null ? "finish" : "game";
  transitionKind = answered ? "answered" : "skipped";
  saveState();
  render();
  window.scrollTo(0, 0);
  if (nextQuestion === null) {
    announce("Вы открыли все вопросы в банке.");
  } else {
    const firstName = state.answeredCount % 2 === 0 ? state.names.first : state.names.second;
    announce(`Сначала отвечает ${firstName}. Вопрос: ${nextQuestion.text}`);
    focusQuestion();
  }
}

function brandMarkup(): string {
  return `
    <div class="couple-brand" aria-label="Секретная банка для двоих">
      <span class="couple-brand-mark" aria-hidden="true"><i></i><i></i></span>
      <span><strong>Секретная банка</strong><small>для двоих</small></span>
    </div>
  `;
}

function settingsMarkup(): string {
  if (!namesAreReady(state.names)) {
    return "";
  }
  return `
    <details class="couple-menu">
      <summary aria-label="Настройки" title="Настройки"><span aria-hidden="true">•••</span></summary>
      <div class="couple-menu-panel">
        <p><strong>${state.seenQuestionIds.length} из ${coupleQuestions.length}</strong> вопросов показано</p>
        <p>Ответили оба: ${state.answeredCount}</p>
        <button type="button" data-action="edit-names">Изменить имена</button>
        <button type="button" data-action="restart">Начать заново</button>
        <small>Сохраняются только имена и прогресс на этом устройстве. Ответы остаются между вами.</small>
      </div>
    </details>
  `;
}

function renderShell(content: string, surface: string): void {
  root.innerHTML = `
    <div class="couple-app ${surface}">
      <header class="couple-topbar">
        ${brandMarkup()}
        ${settingsMarkup()}
      </header>
      ${content}
    </div>
  `;
  bindCommonActions();
}

function renderSetup(): void {
  const returning = namesAreReady(state.names)
    && (state.currentQuestionId !== null || state.seenQuestionIds.length > 0);
  renderShell(`
    <main id="couples-main" class="couple-setup" aria-labelledby="couple-setup-title">
      <section class="couple-intro">
        <p class="couple-intro-note">Один вопрос, два ответа</p>
        <h1 id="couple-setup-title">Разговор, в котором слышно обоих</h1>
        <p class="couple-intro-lead">Отвечайте по очереди, задавайте уточнения и спокойно меняйте вопрос, если сейчас не хочется его обсуждать.</p>
        <div class="couple-principles" aria-label="Как устроена игра">
          <p><strong>Оба отвечают</strong><span>На следующем вопросе первым начинает другой.</span></p>
          <p><strong>Без давления</strong><span>Любую карточку можно сменить без объяснений.</span></p>
          <p><strong>Только между вами</strong><span>Ответы нигде не вводятся и не сохраняются.</span></p>
        </div>
      </section>
      <section class="couple-setup-panel" aria-label="Имена">
        <form id="couple-setup-form" novalidate>
          <div class="couple-form-heading">
            <h2>${returning ? "Как вас называть?" : "Кто сегодня вдвоём?"}</h2>
            <p>У каждого имени будет свой цвет.</p>
          </div>
          <div class="couple-name-fields">
            <label>
              <span><i class="person-dot person-a" aria-hidden="true"></i>Первое имя</span>
              <input name="first-name" maxlength="30" autocomplete="off" value="${escapeHtml(state.names.first)}" placeholder="Аня" />
            </label>
            <label>
              <span><i class="person-dot person-b" aria-hidden="true"></i>Второе имя</span>
              <input name="second-name" maxlength="30" autocomplete="off" value="${escapeHtml(state.names.second)}" placeholder="Миша" />
            </label>
          </div>
          <p id="couple-form-error" class="couple-form-error" aria-live="polite"></p>
          <div class="couple-form-actions">
            ${returning ? '<button class="couple-button couple-button-secondary" type="button" data-action="back-to-game">Назад</button>' : ""}
            <button class="couple-button couple-button-primary" type="submit">${returning ? "Сохранить" : "Начать разговор"}</button>
          </div>
          <p class="couple-local-note">Имена и прогресс останутся только в этом браузере.</p>
        </form>
        <div class="couple-preview" aria-hidden="true">
          <span>Близость и поддержка</span>
          <p>Что помогает тебе почувствовать, что тебя действительно поняли?</p>
          <div><i></i><i></i></div>
        </div>
      </section>
    </main>
  `, "couple-surface-setup");

  const setupForm = root.querySelector<HTMLFormElement>("#couple-setup-form");
  setupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstInput = setupForm.elements.namedItem("first-name");
    const secondInput = setupForm.elements.namedItem("second-name");
    if (!(firstInput instanceof HTMLInputElement) || !(secondInput instanceof HTMLInputElement)) {
      return;
    }
    const names: CoupleNames = {
      first: firstInput.value.trim(),
      second: secondInput.value.trim(),
    };
    const error = root.querySelector<HTMLParagraphElement>("#couple-form-error");
    if (names.first.length === 0 || names.second.length === 0) {
      if (error !== null) {
        error.textContent = "Введите оба имени.";
      }
      return;
    }
    if (names.first.toLocaleLowerCase("ru-RU") === names.second.toLocaleLowerCase("ru-RU")) {
      if (error !== null) {
        error.textContent = "Добавьте к одному имени короткое уточнение, чтобы различать ответы.";
      }
      return;
    }
    state.names = names;
    if (state.currentQuestionId === null && state.seenQuestionIds.length === 0) {
      const firstQuestion = drawNextQuestion(null);
      if (firstQuestion !== null) {
        markQuestionShown(firstQuestion);
      }
    }
    screen = state.currentQuestionId === null ? "finish" : "game";
    saveState();
    render();
    window.scrollTo(0, 0);
    focusQuestion();
  });
}

function speakerOrderMarkup(): string {
  const firstStarts = state.answeredCount % 2 === 0;
  const first = firstStarts
    ? { name: state.names.first, className: "speaker-a" }
    : { name: state.names.second, className: "speaker-b" };
  const second = firstStarts
    ? { name: state.names.second, className: "speaker-b" }
    : { name: state.names.first, className: "speaker-a" };
  return `
    <div class="speaker-order" id="speaker-order">
      <span class="speaker-chip ${first.className}"><small>Сначала</small><strong>${escapeHtml(first.name)}</strong></span>
      <span class="speaker-arrow" aria-hidden="true">→</span>
      <span class="speaker-chip ${second.className}"><small>Потом</small><strong>${escapeHtml(second.name)}</strong></span>
    </div>
  `;
}

function renderGame(): void {
  const question = questionForId(state.currentQuestionId);
  if (question === null) {
    screen = "finish";
    renderFinish();
    return;
  }
  const transition = transitionKind === null ? "" : `data-enter="${transitionKind}"`;
  renderShell(`
    <main id="couples-main" class="couple-game" data-theme="${question.theme}" aria-labelledby="couple-question">
      <section class="couple-question-stage">
        <article class="couple-question-card" tabindex="0" aria-describedby="speaker-order couple-question-help" ${transition}>
          <span class="couple-card-light couple-card-light-a" aria-hidden="true"></span>
          <span class="couple-card-light couple-card-light-b" aria-hidden="true"></span>
          <p class="couple-theme">${coupleThemeNames[question.theme]}</p>
          <h1 id="couple-question">${escapeHtml(question.text)}</h1>
          ${speakerOrderMarkup()}
          <span class="swipe-signal swipe-signal-left" aria-hidden="true">Сменить</span>
          <span class="swipe-signal swipe-signal-right" aria-hidden="true">Ответили</span>
        </article>
        <p id="couple-question-help" class="couple-question-help">Сначала выслушайте оба ответа. Потом можно обсудить, что оказалось разным.</p>
        <div class="couple-controls" aria-label="Действия с вопросом">
          <button class="couple-button couple-button-secondary" type="button" data-action="skip">
            <span aria-hidden="true">←</span><strong>Другой вопрос</strong>
          </button>
          <button class="couple-button couple-button-primary" type="button" data-action="answered">
            <strong>Ответили оба</strong><span aria-hidden="true">→</span>
          </button>
        </div>
        <p class="couple-keyboard-hint">Можно также смахнуть карточку или нажать ← / →</p>
      </section>
    </main>
  `, "couple-surface-game");
  transitionKind = null;
  bindGameActions();
}

function renderFinish(): void {
  renderShell(`
    <main id="couples-main" class="couple-finish" aria-labelledby="couple-finish-title">
      <section>
        <p class="couple-intro-note">Все ${coupleQuestions.length} вопросов открыты</p>
        <h1 id="couple-finish-title">Теперь карточка не нужна</h1>
        <p>Вы ответили вместе на ${state.answeredCount} вопросов. Закончите ещё одним, который принадлежит только вам.</p>
        <blockquote>
          <span>Продолжите без игры</span>
          <p>Что из сегодняшнего разговора тебе хочется продолжить?</p>
        </blockquote>
        <div class="couple-finish-actions">
          <button class="couple-button couple-button-primary" type="button" data-action="new-cycle">Перемешать заново</button>
          <button class="couple-button couple-button-secondary" type="button" data-action="edit-names">Изменить имена</button>
        </div>
      </section>
    </main>
  `, "couple-surface-finish");
}

function bindCommonActions(): void {
  root.querySelectorAll<HTMLButtonElement>("[data-action='edit-names']").forEach((button) => {
    button.addEventListener("click", () => {
      setupReturnScreen = screen;
      screen = "setup";
      render();
      root.querySelector<HTMLInputElement>("input[name='first-name']")?.focus();
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-action='restart']").forEach((button) => {
    button.addEventListener("click", () => {
      const confirmed = window.confirm("Начать заново? Текущий прогресс вопросов будет сброшен.");
      if (confirmed) {
        startFreshCycle();
      }
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-action='back-to-game']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = setupReturnScreen;
      render();
      window.scrollTo(0, 0);
      focusQuestion();
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-action='new-cycle']").forEach((button) => {
    button.addEventListener("click", startFreshCycle);
  });
}

function resetDraggedCard(card: HTMLElement): void {
  card.classList.remove("is-dragging", "drag-left", "drag-right");
  card.style.removeProperty("--drag-x");
}

function bindCardSwipe(card: HTMLElement): void {
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let horizontalDrag = false;

  card.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    horizontalDrag = false;
    card.setPointerCapture(event.pointerId);
    card.classList.add("is-dragging");
  });

  card.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!horizontalDrag && Math.abs(deltaX) > 9 && Math.abs(deltaX) > Math.abs(deltaY)) {
      horizontalDrag = true;
    }
    if (!horizontalDrag) {
      return;
    }
    event.preventDefault();
    const limitedX = Math.max(-150, Math.min(150, deltaX));
    card.style.setProperty("--drag-x", `${limitedX}px`);
    card.classList.toggle("drag-left", limitedX < -24);
    card.classList.toggle("drag-right", limitedX > 24);
  });

  const finish = (event: PointerEvent): void => {
    if (pointerId !== event.pointerId) {
      return;
    }
    const deltaX = event.clientX - startX;
    const threshold = Math.min(96, card.clientWidth * 0.18);
    const committed = horizontalDrag && Math.abs(deltaX) >= threshold;
    pointerId = null;
    if (committed) {
      advance(deltaX > 0);
      return;
    }
    resetDraggedCard(card);
  };

  card.addEventListener("pointerup", finish);
  card.addEventListener("pointercancel", (event) => {
    if (pointerId === event.pointerId) {
      pointerId = null;
      resetDraggedCard(card);
    }
  });
}

function bindGameActions(): void {
  root.querySelector<HTMLButtonElement>("[data-action='skip']")?.addEventListener("click", () => advance(false));
  root.querySelector<HTMLButtonElement>("[data-action='answered']")?.addEventListener("click", () => advance(true));
  const card = root.querySelector<HTMLElement>(".couple-question-card");
  if (card !== null) {
    bindCardSwipe(card);
  }
}

function focusQuestion(): void {
  if (screen !== "game") {
    return;
  }
  window.requestAnimationFrame(() => {
    root.querySelector<HTMLElement>(".couple-question-card")?.focus({ preventScroll: true });
  });
}

function render(): void {
  if (screen === "setup") {
    renderSetup();
  } else if (screen === "game") {
    renderGame();
  } else {
    renderFinish();
  }
}

let state = loadState();
let transitionKind: TransitionKind = null;
let setupReturnScreen: CoupleScreen = state.currentQuestionId === null ? "finish" : "game";

if (namesAreReady(state.names)
  && state.currentQuestionId === null
  && state.seenQuestionIds.length < coupleQuestions.length) {
  const recoveredQuestion = drawNextQuestion(null);
  if (recoveredQuestion !== null) {
    markQuestionShown(recoveredQuestion);
    saveState();
  }
}

let screen: CoupleScreen = !namesAreReady(state.names)
  ? "setup"
  : state.currentQuestionId === null
    ? "finish"
    : "game";

document.addEventListener("keydown", (event) => {
  if (screen !== "game" || event.defaultPrevented) {
    return;
  }
  const target = event.target;
  if (target instanceof HTMLInputElement
    || target instanceof HTMLButtonElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || target instanceof HTMLElement && target.closest("details") !== null) {
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    advance(false);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    advance(true);
  }
});

render();
