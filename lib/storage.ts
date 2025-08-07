import { GameState, GameSession } from "@/types/game";

const GAME_STATE_KEY = "yummy-colors-game-state";
const GAME_SESSIONS_KEY = "yummy-colors-sessions";

export function saveGameState(gameState: GameState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      try {
        const gameState = JSON.parse(saved);
        // Convert date strings back to Date objects
        gameState.startTime = new Date(gameState.startTime);
        gameState.roundHistory = gameState.roundHistory.map((round: any) => ({
          ...round,
          timestamp: new Date(round.timestamp),
        }));
        return gameState;
      } catch (error) {
        console.error("Error loading game state:", error);
        clearGameState();
      }
    }
  }
  return null;
}

export function clearGameState(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GAME_STATE_KEY);
  }
}

export function saveGameSession(session: GameSession): void {
  if (typeof window !== "undefined") {
    const existingSessions = loadGameSessions();
    const updatedSessions = [...existingSessions, session];
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(updatedSessions));
  }
}

export function loadGameSessions(): GameSession[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(GAME_SESSIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error loading game sessions:", error);
      }
    }
  }
  return [];
}

export function getDeviceInfo() {
  if (typeof window !== "undefined") {
    return {
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };
  }
  return {
    userAgent: "unknown",
    screenSize: { width: 0, height: 0 },
  };
}
