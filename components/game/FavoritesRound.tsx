import React, { useState } from "react";
import { Color } from "@/types/game";
import { ColorCard } from "./ColorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FavoritesRoundProps {
  colors: Color[];
  onFavoritesSelect: (favorites: Color[]) => void;
  maxSelections?: number;
}

export function FavoritesRound({
  colors,
  onFavoritesSelect,
  maxSelections = 6,
}: FavoritesRoundProps) {
  const [selectedFavorites, setSelectedFavorites] = useState<Color[]>([]);

  const handleColorClick = (color: Color) => {
    setSelectedFavorites((prev) => {
      const isAlreadySelected = prev.some((c) => c.id === color.id);

      if (isAlreadySelected) {
        // Remove from favorites
        return prev.filter((c) => c.id !== color.id);
      } else if (prev.length < maxSelections) {
        // Add to favorites
        return [...prev, color];
      }

      return prev; // Don't add if max reached
    });
  };

  const handleContinue = () => {
    if (selectedFavorites.length >= 3) {
      onFavoritesSelect(selectedFavorites);
    }
  };

  const sortedColors = [...colors].sort(
    (a, b) => b.selectionCount - a.selectionCount
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">
          Choose Your Favorite Colors
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Select 3-{maxSelections} colors that you find most appetizing
          <br />
          <span className="text-sm">
            ({selectedFavorites.length}/{maxSelections} selected)
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {sortedColors.map((color) => (
            <div key={color.id} className="relative">
              <ColorCard
                color={color}
                isSelected={selectedFavorites.some((c) => c.id === color.id)}
                onClick={() => handleColorClick(color)}
                className="w-full"
                showHex={true}
              />
              <div className="text-center mt-2 text-xs text-muted-foreground">
                Selected {color.selectionCount} time
                {color.selectionCount !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="px-8"
            disabled={selectedFavorites.length < 3}
          >
            Continue to Final Ranking
          </Button>
          {selectedFavorites.length < 3 && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select at least 3 colors to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
