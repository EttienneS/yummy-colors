import React, { useState } from 'react';
import { Color } from '@/types/game';
import { ColorCard } from './ColorCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FinaleRoundProps {
  colors: Color[];
  onFinalRanking: (top3: Color[]) => void;
}

export function FinaleRound({ colors, onFinalRanking }: FinaleRoundProps) {
  const [rankedColors, setRankedColors] = useState<Color[]>([...colors]);

  const moveColor = (fromIndex: number, direction: 'up' | 'down') => {
    const newRanked = [...rankedColors];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < newRanked.length) {
      [newRanked[fromIndex], newRanked[toIndex]] = [newRanked[toIndex], newRanked[fromIndex]];
      setRankedColors(newRanked);
    }
  };

  const handleFinalize = () => {
    onFinalRanking(rankedColors.slice(0, 3));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">
          Final Ranking
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Arrange your colors in order of most to least appetizing
          <br />
          <span className="text-sm">
            The top 3 will be your final results
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {rankedColors.map((color, index) => (
            <div
              key={color.id}
              className="flex items-center gap-4 p-4 border rounded-lg bg-card"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveColor(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveColor(index, 'down')}
                  disabled={index === rankedColors.length - 1}
                  className="h-8 w-8"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold text-muted-foreground min-w-[2rem]">
                  #{index + 1}
                </div>
                <ColorCard
                  color={color}
                  className="w-16 h-16 min-w-16 min-h-16"
                  showHex={true}
                />
                <div className="flex-1">
                  <div className="font-medium">{color.hex}</div>
                  <div className="text-sm text-muted-foreground">
                    HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleFinalize}
            size="lg"
            className="px-8"
          >
            Finalize Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
