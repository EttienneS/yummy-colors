import { useState, useEffect, useCallback } from "react";
import { GameState, Color } from "@/types/game";
import { generateAllGameRounds } from "@/lib/colors";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveCompletedGame,
} from "@/lib/storage";

const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  totalRounds: 5,
  colorsPerRound: 6,
  allRounds: [], // Will be populated when game starts
  selectedColors: [],
  roundHistory: [],
  favorites: [],
  finalTop3: [],
  gamePhase: "selection",
  startTime: new Date(),
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [currentColors, setCurrentColors] = useState<Color[]>([]);

  // Initialize game with pre-generated rounds
  const initializeGame = useCallback((state: GameState) => {
    // If allRounds is missing, not an array, or empty, re-generate
    const allRounds: Color[][] =
      Array.isArray(state.allRounds) && state.allRounds.length > 0
        ? state.allRounds
        : generateAllGameRounds(state.totalRounds, state.colorsPerRound);
    const newState = { ...state, allRounds };
    setGameState(newState);
    const roundIndex = newState.currentRound - 1;
    setCurrentColors(allRounds[roundIndex] || []);
    return newState;
  }, []);

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && savedState.gamePhase !== "complete") {
      initializeGame(savedState);
    } else {
      // Start new game
      const allRounds = generateAllGameRounds(
        INITIAL_GAME_STATE.totalRounds,
        INITIAL_GAME_STATE.colorsPerRound
      );
      const newState = {
        ...INITIAL_GAME_STATE,
        allRounds,
        startTime: new Date(),
      };
      setGameState(newState);
      setCurrentColors(allRounds[0]);
    }
  }, [initializeGame]);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState.currentRound > 1 || gameState.gamePhase !== "selection") {
      saveGameState(gameState);

      // Save completed game to server
      if (gameState.gamePhase === "complete") {
        saveCompletedGame(gameState).catch((error) => {
          console.error("Failed to save completed game:", error);
        });
      }
    }
  }, [gameState]);

  const selectColor = useCallback(
    (selectedColor: Color, timeSpent: number = 0) => {
      setGameState((prev) => {
        const roundResult = {
          round: prev.currentRound,
          colorsShown: currentColors,
          selectedColor,
          timeSpent,
          timestamp: new Date(),
        };

        const updatedSelectedColors = [...prev.selectedColors];
        const existingColorIndex = updatedSelectedColors.findIndex(
          (c) => c.hex === selectedColor.hex
        );

        if (existingColorIndex >= 0) {
          updatedSelectedColors[existingColorIndex].selectionCount += 1;
        } else {
          updatedSelectedColors.push({ ...selectedColor, selectionCount: 1 });
        }

        return {
          ...prev,
          selectedColors: updatedSelectedColors,
          roundHistory: [...prev.roundHistory, roundResult],
        };
      });
    },
    [currentColors]
  );

  const nextRound = useCallback(() => {
    setGameState((prev) => {
      if (prev.currentRound < prev.totalRounds) {
        const newState = {
          ...prev,
          currentRound: prev.currentRound + 1,
        };
        const roundIndex = newState.currentRound - 1;
        setCurrentColors(prev.allRounds[roundIndex] || []);
        return newState;
      } else {
        // Move directly to finale phase with top 5 selected colors
        const topColors = prev.selectedColors
          .sort((a, b) => b.selectionCount - a.selectionCount)
          .slice(0, 5);

        return {
          ...prev,
          favorites: topColors,
          gamePhase: "finale" as const,
        };
      }
    });
  }, []);

  const previousRound = useCallback(() => {
    setGameState((prev) => {
      if (prev.currentRound > 1) {
        const newState = {
          ...prev,
          currentRound: prev.currentRound - 1,
        };
        const roundIndex = newState.currentRound - 1;
        setCurrentColors(prev.allRounds[roundIndex] || []);
        return newState;
      }
      return prev;
    });
  }, []);

  const setFinalRanking = useCallback((finalTop3: Color[]) => {
    setGameState((prev) => ({
      ...prev,
      finalTop3,
      gamePhase: "complete",
    }));
  }, []);

  const resetGame = useCallback(() => {
    clearGameState();
    const allRounds = generateAllGameRounds(
      INITIAL_GAME_STATE.totalRounds,
      INITIAL_GAME_STATE.colorsPerRound
    );
    const newState = {
      ...INITIAL_GAME_STATE,
      allRounds,
      startTime: new Date(),
    };
    setGameState(newState);
    setCurrentColors(allRounds[0]);
  }, []);

  const getMostSelectedColors = useCallback(
    (count: number = 10) => {
      return gameState.selectedColors
        .sort((a, b) => b.selectionCount - a.selectionCount)
        .slice(0, count);
    },
    [gameState.selectedColors]
  );

  return {
    gameState,
    currentColors,
    selectColor,
    nextRound,
    previousRound,
    setFinalRanking,
    resetGame,
    getMostSelectedColors,
  };
}
