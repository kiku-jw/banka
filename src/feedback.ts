export interface CardFeedback {
  cardId: string;
  cardText: string;
  comment: string;
}

const FEEDBACK_KEY = "dostavay:card-feedback:v1";
export const MAX_FEEDBACK_ITEMS = 30;
export const MAX_FEEDBACK_COMMENT_LENGTH = 500;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCardFeedback(value: unknown): value is CardFeedback {
  return isObject(value)
    && typeof value.cardId === "string"
    && value.cardId.length > 0
    && value.cardId.length <= 100
    && typeof value.cardText === "string"
    && value.cardText.length > 0
    && value.cardText.length <= 220
    && typeof value.comment === "string"
    && value.comment.length <= MAX_FEEDBACK_COMMENT_LENGTH;
}

export function loadCardFeedback(storage: Storage = window.localStorage): CardFeedback[] {
  const raw = storage.getItem(FEEDBACK_KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      && parsed.length <= MAX_FEEDBACK_ITEMS
      && parsed.every(isCardFeedback)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveCardFeedback(items: CardFeedback[], storage: Storage = window.localStorage): void {
  storage.setItem(FEEDBACK_KEY, JSON.stringify(items.slice(-MAX_FEEDBACK_ITEMS)));
}

export function upsertCardFeedback(items: CardFeedback[], item: CardFeedback): CardFeedback[] {
  return [...items.filter((candidate) => candidate.cardId !== item.cardId), item]
    .slice(-MAX_FEEDBACK_ITEMS);
}

export function removeCardFeedback(items: CardFeedback[], cardId: string): CardFeedback[] {
  return items.filter((item) => item.cardId !== cardId);
}

export function clearCardFeedback(storage: Storage = window.localStorage): void {
  storage.removeItem(FEEDBACK_KEY);
}

export function feedbackMailto(items: CardFeedback[]): string {
  const body = items.map((item, index) => [
    `${index + 1}. ${item.cardText}`,
    `ID: ${item.cardId}`,
    `Комментарий: ${item.comment.length > 0 ? item.comment : "Без комментария"}`,
  ].join("\n")).join("\n\n");
  return `mailto:support@kikuai.dev?subject=${encodeURIComponent("Замечания к вопросам игры «Доставай!»")}&body=${encodeURIComponent(body)}`;
}
