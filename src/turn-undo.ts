import type { SessionState } from "./types";

export interface TurnSnapshot {
  session: SessionState;
  seenCardIds: string[];
  cardRevealed: boolean;
  timerRemaining: number;
}

function copySession(session: SessionState): SessionState {
  return {
    ...session,
    players: session.players.map((player) => ({ ...player })),
    recentCardIds: [...session.recentCardIds],
  };
}

export function createTurnSnapshot(
  session: SessionState,
  seenCardIds: string[],
  cardRevealed: boolean,
  timerRemaining: number,
): TurnSnapshot {
  return {
    session: copySession(session),
    seenCardIds: [...seenCardIds],
    cardRevealed,
    timerRemaining,
  };
}

export function copySnapshotSession(snapshot: TurnSnapshot): SessionState {
  return copySession(snapshot.session);
}
