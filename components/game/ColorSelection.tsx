import React, { useState } from "react";
import { Color } from "@/types/game";
import { ColorCard } from "./ColorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

interface ColorSelectionProps {
  colors: Color[];
  onColorSelect: (color: Color) => void;
  round: number;
  onNextRound?: () => void;
  onPreviousRound?: () => void;
  isLastRound?: boolean;
}

export function ColorSelection({
  colors,
  onColorSelect,
  round,
  onNextRound,
  onPreviousRound,
  isLastRound = false,
}: ColorSelectionProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const handleColorClick = (color: Color) => {
    if (selectedColor?.id === color.id) {
      return; // Already selected
    }

    setSelectedColor(color);

    // Add a small delay for visual feedback before auto-advancing
    setTimeout(() => {
      onColorSelect({
        ...color,
        selectionCount: color.selectionCount + 1,
      });

      // Auto-advance to next round after selection
      if (onNextRound) {
        setTimeout(() => {
          onNextRound();
        }, 500); // Additional delay to show selection feedback
      }
    }, 300);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          {round > 1 && onPreviousRound && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousRound}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <CardTitle className="text-center flex-1">
            Round {round}: Pick the most appetizing color
          </CardTitle>
          <div className="w-20" /> {/* Spacer for layout balance */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {colors.map((color) => (
            <ColorCard
              key={color.id}
              color={color}
              isSelected={selectedColor?.id === color.id}
              onClick={() => handleColorClick(color)}
              className="w-full"
            />
          ))}
        </div>

        {selectedColor && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLastRound
                ? "Advancing to final ranking..."
                : "Advancing to next round..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
