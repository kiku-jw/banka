import { describe, expect, it } from "vitest";

import { copySnapshotSession, createTurnSnapshot } from "../src/turn-undo";
import type { SessionState } from "../src/types";

describe("one-step turn history", () => {
  it("keeps a detached copy of the complete previous turn", () => {
    const session: SessionState = {
      players: [{ id: "one", name: "Аня" }, { id: "two", name: "Борис" }],
      currentPlayerIndex: 0,
      round: 1,
      currentCardId: "spark-bible-1",
      partnerPlayerId: "two",
      mode: "open",
      turnsCompleted: 0,
      targetTurns: null,
      recentCardIds: ["spark-bible-1"],
    };
    const snapshot = createTurnSnapshot(session, ["spark-bible-1"], true, 41);
    session.currentPlayerIndex = 1;
    session.players[0] = { id: "changed", name: "Другое имя" };
    session.recentCardIds.push("next");

    expect(copySnapshotSession(snapshot)).toEqual({
      players: [{ id: "one", name: "Аня" }, { id: "two", name: "Борис" }],
      currentPlayerIndex: 0,
      round: 1,
      currentCardId: "spark-bible-1",
      partnerPlayerId: "two",
      mode: "open",
      turnsCompleted: 0,
      targetTurns: null,
      recentCardIds: ["spark-bible-1"],
    });
    expect(snapshot.seenCardIds).toEqual(["spark-bible-1"]);
    expect(snapshot.cardRevealed).toBe(true);
    expect(snapshot.timerRemaining).toBe(41);
  });
});
