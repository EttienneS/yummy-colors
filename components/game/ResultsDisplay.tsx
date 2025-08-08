import { Color } from "@/types/game";
import { ColorCard } from "./ColorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface ResultsDisplayProps {
  top3Colors: Color[];
  onPlayAgain: () => void;
  totalRounds: number;
}

export function ResultsDisplay({
  top3Colors,
  onPlayAgain,
  totalRounds,
}: ResultsDisplayProps) {
  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 0:
        return "Most Appetizing";
      case 1:
        return "Second Choice";
      case 2:
        return "Third Choice";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          🎉 Your Most Appetizing Colors! 🎉
        </CardTitle>
        <p className="text-muted-foreground">
          Based on your selections across {totalRounds} rounds
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mb-8">
          {top3Colors.map((color, index) => (
            <div
              key={color.id}
              className="flex items-center gap-6 p-6 border rounded-xl bg-gradient-to-r from-background to-muted/30"
            >
              <div className="flex flex-col items-center gap-2">
                {getTrophyIcon(index)}
                <div className="text-lg font-bold">#{index + 1}</div>
              </div>

              <ColorCard
                color={color}
                className="w-20 h-20 min-w-20 min-h-20"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">
                  {getPositionText(index)}
                </h3>
                <div className="text-2xl font-bold mb-1">{color.name}</div>
                <div className="text-lg font-mono text-muted-foreground mb-2">
                  {color.hex}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                  </div>
                  <div>
                    RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                  </div>
                  {color.selectionCount > 0 && (
                    <div>Selected {color.selectionCount} times</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Interesting! Your color preferences show you&apos;re drawn to:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {getColorInsights(top3Colors).map((insight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {insight}
                </span>
              ))}
            </div>
          </div>

          <Button onClick={onPlayAgain} size="lg" className="px-8">
            Play Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorInsights(colors: Color[]): string[] {
  const insights: string[] = [];

  // Analyze hue preferences
  const avgHue =
    colors.reduce((sum, color) => sum + color.hsl.h, 0) / colors.length;
  if (avgHue < 60) insights.push("Warm tones");
  else if (avgHue < 180) insights.push("Cool greens");
  else if (avgHue < 240) insights.push("Cool blues");
  else if (avgHue < 300) insights.push("Purple tones");
  else insights.push("Warm reds");

  // Analyze saturation
  const avgSaturation =
    colors.reduce((sum, color) => sum + color.hsl.s, 0) / colors.length;
  if (avgSaturation > 70) insights.push("Vibrant colors");
  else if (avgSaturation < 30) insights.push("Muted tones");
  else insights.push("Balanced saturation");

  // Analyze lightness
  const avgLightness =
    colors.reduce((sum, color) => sum + color.hsl.l, 0) / colors.length;
  if (avgLightness > 60) insights.push("Bright colors");
  else if (avgLightness < 40) insights.push("Dark colors");
  else insights.push("Medium tones");

  return insights;
}
