"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";
import { GameProgress } from "@/components/game/GameProgress";
import { ColorSelection } from "@/components/game/ColorSelection";
import { FavoritesRound } from "@/components/game/FavoritesRound";
import { FinaleRound } from "@/components/game/FinaleRound";
import { ResultsDisplay } from "@/components/game/ResultsDisplay";

export default function Home() {
  const {
    gameState,
    currentColors,
    selectColor,
    nextRound,
    selectFavorites,
    setFinalRanking,
    resetGame,
    getMostSelectedColors,
  } = useGameState();

  const handleColorSelect = (color: any) => {
    selectColor(color);
  };

  const renderCurrentPhase = () => {
    switch (gameState.gamePhase) {
      case "selection":
        return (
          <ColorSelection
            colors={currentColors}
            onColorSelect={handleColorSelect}
            round={gameState.currentRound}
            onNextRound={nextRound}
            isLastRound={gameState.currentRound === gameState.totalRounds}
          />
        );

      case "favorites":
        const mostSelected = getMostSelectedColors(12);
        return (
          <FavoritesRound
            colors={mostSelected}
            onFavoritesSelect={selectFavorites}
            maxSelections={8}
          />
        );

      case "finale":
        return (
          <FinaleRound
            colors={gameState.favorites}
            onFinalRanking={setFinalRanking}
          />
        );

      case "complete":
        return (
          <ResultsDisplay
            top3Colors={gameState.finalTop3}
            onPlayAgain={resetGame}
            totalRounds={gameState.totalRounds}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🍽️ Yummy Colors</h1>
          <p className="text-lg text-muted-foreground">
            Discover which colors make you feel most hungry!
          </p>
        </div>

        {gameState.gamePhase !== "complete" && (
          <GameProgress
            currentRound={gameState.currentRound}
            totalRounds={gameState.totalRounds}
            gamePhase={gameState.gamePhase}
          />
        )}

        {renderCurrentPhase()}
      </div>
    </div>
  );
}
