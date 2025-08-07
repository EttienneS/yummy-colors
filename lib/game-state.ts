import { useState, useEffect, useCallback } from "react";
import { GameState, Color, RoundResult } from "@/types/game";
import { generateColorSet } from "@/lib/colors";
import { saveGameState, loadGameState, clearGameState } from "@/lib/storage";

const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  totalRounds: 5,
  colorsPerRound: 6,
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

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && savedState.gamePhase !== "complete") {
      setGameState(savedState);
      if (savedState.gamePhase === "selection") {
        setCurrentColors(generateColorSet(savedState.colorsPerRound));
      }
    } else {
      // Start new game
      setCurrentColors(generateColorSet(INITIAL_GAME_STATE.colorsPerRound));
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState.currentRound > 1 || gameState.gamePhase !== "selection") {
      saveGameState(gameState);
    }
  }, [gameState]);

  const selectColor = useCallback(
    (selectedColor: Color, timeSpent: number = 0) => {
      setGameState((prev) => {
        const roundResult: RoundResult = {
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
        setCurrentColors(generateColorSet(prev.colorsPerRound));
        return newState;
      } else {
        // Move to favorites phase
        return {
          ...prev,
          gamePhase: "favorites" as const,
        };
      }
    });
  }, []);

  const selectFavorites = useCallback((favorites: Color[]) => {
    setGameState((prev) => ({
      ...prev,
      favorites,
      gamePhase: "finale",
    }));
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
    const newState = {
      ...INITIAL_GAME_STATE,
      startTime: new Date(),
    };
    setGameState(newState);
    setCurrentColors(generateColorSet(newState.colorsPerRound));
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
    selectFavorites,
    setFinalRanking,
    resetGame,
    getMostSelectedColors,
  };
}
