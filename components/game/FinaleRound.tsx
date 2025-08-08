import React, { useState } from "react";
import { Color } from "@/types/game";
import { ColorCard } from "./ColorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinaleRoundProps {
  colors: Color[];
  onFinalRanking: (finalRanking: Color[]) => void;
}

export function FinaleRound({ colors, onFinalRanking }: FinaleRoundProps) {
  // Bracket state: 0 = first semi, 1 = second semi, 2 = final, 3 = third place
  const [bracketStep, setBracketStep] = useState(0);
  const [semiWinners, setSemiWinners] = useState<Color[]>([]);
  const [semiLosers, setSemiLosers] = useState<Color[]>([]);
  const [finalWinner, setFinalWinner] = useState<Color | null>(null);
  const [thirdPlace, setThirdPlace] = useState<Color | null>(null);

  // Defensive: only allow with 4 colors
  if (colors.length !== 4) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Finale Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Finale requires exactly 4 colors.</p>
        </CardContent>
      </Card>
    );
  }

  // Step 0: Pick between colors[0] vs colors[1]
  // Step 1: Pick between colors[2] vs colors[3]
  // Step 2: Pick between semiWinners[0] vs semiWinners[1]
  // Step 3: Pick between semi losers for 3rd place

  const handleSemiPick = (winner: Color, matchColors: Color[]) => {
    const loser = matchColors.find((c) => c.id !== winner.id)!;
    setSemiWinners((prev) => [...prev, winner]);
    setSemiLosers((prev) => [...prev, loser]);
    setBracketStep((prev) => prev + 1);
  };

  const handleFinalPick = (winner: Color) => {
    setFinalWinner(winner);
    setBracketStep(3); // Move to third place match
  };

  const handleThirdPlacePick = (winner: Color) => {
    setThirdPlace(winner);
    const fourthPlace = semiLosers.find((l) => l.id !== winner.id)!;
    const secondPlace = semiWinners.find((w) => w.id !== finalWinner!.id)!;

    const finalRanking = [
      finalWinner!,
      secondPlace,
      winner, // third place
      fourthPlace,
    ];
    onFinalRanking(finalRanking);
  };

  let content = null;
  if (bracketStep === 0) {
    // First semi-final
    content = (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center text-lg mb-4 font-semibold z-10 relative">
          Semi-final 1: Pick your favorite
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div
            key={colors[0].id}
            onClick={() => handleSemiPick(colors[0], [colors[0], colors[1]])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={colors[0]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{colors[0].name}</span>
          </div>
          <div className="text-4xl font-bold text-muted-foreground mx-4">
            VS
          </div>
          <div
            key={colors[1].id}
            onClick={() => handleSemiPick(colors[1], [colors[0], colors[1]])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={colors[1]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{colors[1].name}</span>
          </div>
        </div>
      </div>
    );
  } else if (bracketStep === 1) {
    // Second semi-final
    content = (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center text-lg mb-4 font-semibold z-10 relative">
          Semi-final 2: Pick your favorite
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div
            key={colors[2].id}
            onClick={() => handleSemiPick(colors[2], [colors[2], colors[3]])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={colors[2]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{colors[2].name}</span>
          </div>
          <div className="text-4xl font-bold text-muted-foreground mx-4">
            VS
          </div>
          <div
            key={colors[3].id}
            onClick={() => handleSemiPick(colors[3], [colors[2], colors[3]])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={colors[3]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{colors[3].name}</span>
          </div>
        </div>
      </div>
    );
  } else if (bracketStep === 2 && semiWinners.length === 2) {
    // Final
    content = (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center text-lg mb-4 font-semibold z-10 relative">
          Final: Pick the ultimate winner
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div
            key={semiWinners[0].id}
            onClick={() => handleFinalPick(semiWinners[0])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={semiWinners[0]}
              className="w-24 h-24 mb-2"
              showHex={true}
            />
            <span className="font-bold">{semiWinners[0].name}</span>
          </div>
          <div className="text-4xl font-bold text-muted-foreground mx-4">
            VS
          </div>
          <div
            key={semiWinners[1].id}
            onClick={() => handleFinalPick(semiWinners[1])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={semiWinners[1]}
              className="w-24 h-24 mb-2"
              showHex={true}
            />
            <span className="font-bold">{semiWinners[1].name}</span>
          </div>
        </div>
      </div>
    );
  } else if (bracketStep === 3 && semiLosers.length === 2) {
    // Third place playoff
    content = (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center text-lg mb-4 font-semibold z-10 relative">
          Third Place: Pick the better runner-up
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div
            key={semiLosers[0].id}
            onClick={() => handleThirdPlacePick(semiLosers[0])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={semiLosers[0]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{semiLosers[0].name}</span>
          </div>
          <div className="text-4xl font-bold text-muted-foreground mx-4">
            VS
          </div>
          <div
            key={semiLosers[1].id}
            onClick={() => handleThirdPlacePick(semiLosers[1])}
            className="flex flex-col items-center p-4 cursor-pointer hover:bg-muted rounded-lg transition-colors"
          >
            <ColorCard
              color={semiLosers[1]}
              className="w-20 h-20 mb-2"
              showHex={true}
            />
            <span className="font-medium">{semiLosers[1].name}</span>
          </div>
        </div>
      </div>
    );
  } else {
    content = <div className="text-center">Processing...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Final Bracket</CardTitle>
        <p className="text-center text-muted-foreground">
          Choose your favorites in a bracket showdown!
        </p>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
