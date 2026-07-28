import "./review.css";

import { builtInCards } from "./content/cards";

interface ReviewState {
  selectedIds: string[];
  comments: Record<string, string>;
}

const storageKey = "dostavay:question-review:v1";
const root = document.querySelector<HTMLElement>("#review-app");
const liveRegion = document.querySelector<HTMLElement>("#review-status");
const validCardIds = new Set(builtInCards.map((card) => card.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function loadState(): ReviewState {
  const empty: ReviewState = { selectedIds: [], comments: {} };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      return empty;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.selectedIds) || !isRecord(parsed.comments)) {
      return empty;
    }
    const selectedIds = parsed.selectedIds.filter(
      (value): value is string => typeof value === "string" && validCardIds.has(value),
    );
    const comments: Record<string, string> = {};
    for (const [cardId, value] of Object.entries(parsed.comments)) {
      if (validCardIds.has(cardId) && typeof value === "string" && value.trim().length > 0) {
        comments[cardId] = value.slice(0, 500);
      }
    }
    return { selectedIds, comments };
  } catch {
    return empty;
  }
}

const stored = loadState();
const selectedIds = new Set(stored.selectedIds);
const comments = new Map(Object.entries(stored.comments));
let searchQuery = "";
let selectedOnly = false;

function persist(): void {
  const commentRecord: Record<string, string> = {};
  for (const [cardId, comment] of comments) {
    if (comment.trim().length > 0) {
      commentRecord[cardId] = comment.trim();
    }
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      selectedIds: [...selectedIds],
      comments: commentRecord,
    }));
  } catch {
    announce("Не удалось сохранить отметки в этом браузере.");
  }
}

function selectionLabel(count: number): string {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 14) {
    return `${count} отмечено`;
  }
  if (remainder10 === 1) {
    return `${count} отмечен`;
  }
  if (remainder10 >= 2 && remainder10 <= 4) {
    return `${count} отмечено`;
  }
  return `${count} отмечено`;
}

function formatReport(): string {
  const rows = builtInCards.flatMap((card, index) => {
    if (!selectedIds.has(card.id)) {
      return [];
    }
    const comment = comments.get(card.id)?.trim();
    return [
      `${index + 1}. ${card.text}${comment === undefined || comment.length === 0 ? "" : `\nКомментарий: ${comment}`}`,
    ];
  });
  return [
    "Странные вопросы из игры «Доставай!»",
    `Отмечено: ${rows.length} из ${builtInCards.length}`,
    "",
    ...rows,
  ].join("\n\n");
}

function announce(message: string): void {
  if (liveRegion !== null) {
    liveRegion.textContent = message;
  }
}

function updateSummary(): void {
  const count = selectedIds.size;
  const hasDraft = count > 0 || comments.size > 0;
  document.querySelectorAll<HTMLElement>("[data-selected-count]").forEach((element) => {
    element.textContent = selectionLabel(count);
  });
  document.querySelectorAll<HTMLButtonElement>("[data-requires-selection]").forEach((button) => {
      button.disabled = count === 0;
  });
  const clearButton = document.querySelector<HTMLButtonElement>("[data-clear-review]");
  if (clearButton !== null) {
    clearButton.disabled = !hasDraft;
  }
  const selectedFilter = document.querySelector<HTMLButtonElement>("[data-filter-selected]");
  if (selectedFilter !== null) {
    selectedFilter.textContent = `Только отмеченные · ${count}`;
    selectedFilter.setAttribute("aria-pressed", String(selectedOnly));
  }
}

function createReviewItem(cardId: string, text: string, index: number): HTMLElement {
  const item = document.createElement("article");
  item.className = `review-item${selectedIds.has(cardId) ? " review-item-selected" : ""}`;
  item.dataset.cardId = cardId;

  const choice = document.createElement("label");
  choice.className = "review-choice";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedIds.has(cardId);
  checkbox.setAttribute("aria-label", `Отметить вопрос ${index + 1}`);

  const marker = document.createElement("span");
  marker.className = "review-checkbox";
  marker.setAttribute("aria-hidden", "true");

  choice.append(checkbox, marker);

  const question = document.createElement("div");
  question.className = "review-question";
  const number = document.createElement("span");
  number.className = "review-number";
  number.textContent = String(index + 1);
  const copy = document.createElement("p");
  copy.textContent = text;
  question.append(number, copy);

  const comment = document.createElement("textarea");
  comment.className = "review-comment";
  comment.rows = 2;
  comment.maxLength = 500;
  comment.placeholder = "Комментарий — необязательно";
  comment.value = comments.get(cardId) ?? "";
  comment.setAttribute("aria-label", `Комментарий к вопросу ${index + 1}`);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      selectedIds.add(cardId);
      item.classList.add("review-item-selected");
    } else {
      selectedIds.delete(cardId);
      item.classList.remove("review-item-selected");
    }
    persist();
    updateSummary();
    if (selectedOnly && !checkbox.checked) {
      renderList();
    }
  });

  comment.addEventListener("input", () => {
    if (comment.value.trim().length === 0) {
      comments.delete(cardId);
    } else {
      comments.set(cardId, comment.value);
    }
    persist();
    updateSummary();
  });

  item.append(choice, question, comment);
  return item;
}

function renderList(): void {
  const list = document.querySelector<HTMLElement>("#question-review-list");
  const empty = document.querySelector<HTMLElement>("#review-empty");
  if (list === null || empty === null) {
    return;
  }
  list.replaceChildren();
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ru-RU");
  let visibleCount = 0;
  builtInCards.forEach((card, index) => {
    const matchesSearch = normalizedQuery.length === 0
      || card.text.toLocaleLowerCase("ru-RU").includes(normalizedQuery)
      || String(index + 1) === normalizedQuery;
    if (matchesSearch && (!selectedOnly || selectedIds.has(card.id))) {
      list.append(createReviewItem(card.id, card.text, index));
      visibleCount += 1;
    }
  });
  empty.hidden = visibleCount > 0;
  const resultCount = document.querySelector<HTMLElement>("#review-result-count");
  if (resultCount !== null) {
    resultCount.textContent = `Показано ${visibleCount} из ${builtInCards.length}`;
  }
}

async function copyReport(): Promise<void> {
  const report = formatReport();
  try {
    await navigator.clipboard.writeText(report);
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = report;
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand("copy");
    fallback.remove();
    if (!copied) {
      announce("Не удалось скопировать. Используйте скачивание.");
      return;
    }
  }
  announce("Отмеченные вопросы скопированы.");
  const button = document.querySelector<HTMLButtonElement>("[data-copy-report]");
  if (button !== null) {
    const label = button.textContent;
    button.textContent = "Скопировано ✓";
    window.setTimeout(() => {
      button.textContent = label;
    }, 1600);
  }
}

function downloadReport(): void {
  const url = URL.createObjectURL(new Blob([formatReport()], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "dostavay-question-review.txt";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  announce("Файл с отмеченными вопросами скачан.");
}

if (root !== null) {
  root.innerHTML = `
    <header class="review-header">
      <div class="review-header-inner">
        <a class="review-brand" href="./">
          <span class="review-jar" aria-hidden="true"><i></i><i></i><i></i></span>
          <span><strong>Доставай!</strong><small>проверка вопросов</small></span>
        </a>
        <span class="review-saved">Сохраняется в этом браузере</span>
      </div>
    </header>
    <section class="review-intro" aria-labelledby="review-title">
      <p class="review-kicker">Все ${builtInCards.length} карточек</p>
      <h1 id="review-title">Отметь вопросы, которые звучат странно</h1>
      <p>Поставь галочку и, если хочется, напиши рядом причину. В конце скопируй список или скачай файл и пришли его мне.</p>
      <p class="review-privacy"><strong>Ничего не отправляется автоматически.</strong> Отметки остаются только на этом устройстве.</p>
    </section>
    <section class="review-workspace" aria-label="Проверка списка вопросов">
      <div class="review-toolbar">
        <label class="review-search">
          <span>Поиск по номеру или тексту</span>
          <input id="review-search" type="search" autocomplete="off" placeholder="Например: служение или 147" />
        </label>
        <button class="review-filter" type="button" data-filter-selected aria-pressed="false">Только отмеченные · 0</button>
      </div>
      <div class="review-list-heading">
        <span id="review-result-count">Показано ${builtInCards.length} из ${builtInCards.length}</span>
        <span data-selected-count>0 отмечено</span>
      </div>
      <div id="question-review-list" class="review-list"></div>
      <div id="review-empty" class="review-empty" hidden>
        <strong>Ничего не найдено</strong>
        <span>Попробуй другой запрос или покажи все вопросы.</span>
      </div>
    </section>
    <footer class="review-export">
      <div>
        <strong data-selected-count>0 отмечено</strong>
        <span>Комментарии попадут в итоговый список.</span>
      </div>
      <div class="review-export-actions">
        <button class="review-button review-button-quiet" type="button" data-clear-review disabled>Сбросить</button>
        <button class="review-button review-button-secondary" type="button" data-download-report data-requires-selection disabled>Скачать .txt</button>
        <button class="review-button review-button-primary" type="button" data-copy-report data-requires-selection disabled>Скопировать</button>
      </div>
    </footer>
  `;

  document.querySelector<HTMLInputElement>("#review-search")?.addEventListener("input", (event) => {
    const target = event.currentTarget;
    if (target instanceof HTMLInputElement) {
      searchQuery = target.value;
      renderList();
    }
  });
  document.querySelector<HTMLButtonElement>("[data-filter-selected]")?.addEventListener("click", () => {
    selectedOnly = !selectedOnly;
    updateSummary();
    renderList();
  });
  document.querySelector<HTMLButtonElement>("[data-copy-report]")?.addEventListener("click", () => {
    void copyReport();
  });
  document.querySelector<HTMLButtonElement>("[data-download-report]")?.addEventListener("click", downloadReport);
  document.querySelector<HTMLButtonElement>("[data-clear-review]")?.addEventListener("click", () => {
    if (window.confirm("Снять все отметки и удалить комментарии?")) {
      selectedIds.clear();
      comments.clear();
      persist();
      updateSummary();
      renderList();
      announce("Все отметки и комментарии удалены.");
    }
  });

  updateSummary();
  renderList();
}
