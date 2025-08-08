import { GameState, GameSession, RoundResult } from "@/types/game";
import { getLocationData } from "@/lib/location";

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
        gameState.roundHistory = gameState.roundHistory.map(
          (round: RoundResult) => ({
            ...round,
            timestamp: new Date(round.timestamp),
          })
        );
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

export async function saveGameSession(session: GameSession): Promise<void> {
  if (typeof window !== "undefined") {
    // Save locally first
    const existingSessions = loadGameSessions();
    const updatedSessions = [...existingSessions, session];
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(updatedSessions));

    // Send to server if game is complete
    if (session.gameState.gamePhase === "complete") {
      try {
        const response = await fetch("/api/game-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();
        console.log("Game session saved to server:", result.sessionId);
      } catch (error) {
        console.error("Failed to save to server, data saved locally:", error);
        // Don't throw error - local storage is our fallback
      }
    }
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

export async function saveCompletedGame(gameState: GameState): Promise<void> {
  if (gameState.gamePhase !== "complete") {
    console.warn("Game not complete, not saving to server");
    return;
  }

  const deviceInfo = getDeviceInfo();

  // Get location data (city-level only, no consent needed)
  const locationData = await getLocationData();

  const session: GameSession = {
    id: crypto.randomUUID(),
    gameState,
    userAgent: deviceInfo.userAgent,
    screenSize: deviceInfo.screenSize,
    location: locationData || undefined,
    completedAt: new Date(),
  };

  await saveGameSession(session);
}
