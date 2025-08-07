import React, { useState } from 'react';
import { Color } from '@/types/game';
import { ColorCard } from './ColorCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColorSelectionProps {
  colors: Color[];
  onColorSelect: (color: Color) => void;
  round: number;
  onNextRound?: () => void;
  isLastRound?: boolean;
}

export function ColorSelection({ 
  colors, 
  onColorSelect, 
  round, 
  onNextRound,
  isLastRound = false
}: ColorSelectionProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [roundStartTime] = useState(Date.now());

  const handleColorClick = (color: Color) => {
    if (selectedColor?.id === color.id) {
      return; // Already selected
    }
    
    setSelectedColor(color);
    const timeSpent = Date.now() - roundStartTime;
    
    // Add a small delay for visual feedback before calling onColorSelect
    setTimeout(() => {
      onColorSelect({
        ...color,
        selectionCount: color.selectionCount + 1
      });
    }, 300);
  };

  const handleNextRound = () => {
    if (selectedColor && onNextRound) {
      onNextRound();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">
          Round {round}: Pick the most appetizing color
        </CardTitle>
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
        
        {selectedColor && onNextRound && (
          <div className="text-center">
            <Button 
              onClick={handleNextRound}
              size="lg"
              className="px-8"
            >
              {isLastRound ? 'Continue to Favorites' : 'Next Round'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
