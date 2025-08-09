"use client";
import { Color } from "@/types/game";
import { useGameState } from "@/lib/game-state";
import { GameProgress } from "@/components/game/GameProgress";
import { ColorSelection } from "@/components/game/ColorSelection";
import { FinaleRound } from "@/components/game/FinaleRound";
import { ResultsDisplay } from "@/components/game/ResultsDisplay";

export default function ColorGamePage() {
  const {
    gameState,
    currentColors,
    selectColor,
    nextRound,
    previousRound,
    setFinalRanking,
    resetGame,
  } = useGameState();

  const handleColorSelect = (color: Color) => {
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
            onPreviousRound={previousRound}
            isLastRound={gameState.currentRound === gameState.totalRounds}
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
          <h1 className="text-4xl font-bold mb-2">🍽️ Yummy Colors 🍽️</h1>
        </div>

        {renderCurrentPhase()}
        <div className="m-2" />
        {gameState.gamePhase !== "complete" && (
          <GameProgress
            currentRound={gameState.currentRound}
            totalRounds={gameState.totalRounds}
            gamePhase={gameState.gamePhase}
          />
        )}

        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">Hi! My name is Emily!</p>
          <p className="text-lg text-muted-foreground">
            I&apos;m doing an experiment for school to see if I can find the
            most delicious color. Please help me by selecting your favorite
            colors in each round!
          </p>
        </div>
      </div>
    </div>
  );
}
