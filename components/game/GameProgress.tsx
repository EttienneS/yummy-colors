import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface GameProgressProps {
  currentRound: number;
  totalRounds: number;
  gamePhase: "selection" | "favorites" | "finale" | "complete";
}

export function GameProgress({
  currentRound,
  totalRounds,
  gamePhase,
}: GameProgressProps) {
  const getPhaseText = () => {
    switch (gamePhase) {
      case "selection":
        return `Round ${currentRound} of ${totalRounds}`;
      case "favorites":
        return "Choose your favorites";
      case "finale":
        return "Final ranking";
      case "complete":
        return "Complete!";
      default:
        return "";
    }
  };

  const getProgress = () => {
    if (gamePhase === "selection") {
      return (currentRound / totalRounds) * 60; // 60% for selection rounds
    }
    if (gamePhase === "favorites") {
      return 80;
    }
    if (gamePhase === "finale") {
      return 95;
    }
    return 100;
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{getPhaseText()}</h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(getProgress())}%
            </span>
          </div>
          <Progress value={getProgress()} className="h-3" />

          {gamePhase === "selection" && (
            <p className="text-sm text-muted-foreground">
              Pick the most appetizing color from each set
            </p>
          )}
          {gamePhase === "favorites" && (
            <p className="text-sm text-muted-foreground">
              Select your favorite colors from your previous choices
            </p>
          )}
          {gamePhase === "finale" && (
            <p className="text-sm text-muted-foreground">
              Rank your top 3 most appetizing colors
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
