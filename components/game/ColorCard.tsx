import { Color, getContrastColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ColorCardProps {
  color: Color;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showHex?: boolean;
  showName?: boolean;
  foodImageIndex?: number; // New prop to specify which food image to use
}

const foodImages = [
  "/berry.png",
  "/candy.png",
  "/cane.png",
  "/cotton.png",
  "/heart.png",
  "/ice.png",
];

export function ColorCard({
  color,
  isSelected = false,
  onClick,
  className,
  showHex = false,
  showName = false,
  foodImageIndex = 0,
}: ColorCardProps) {
  const contrastColor = getContrastColor(color);
  const foodImage = foodImages[foodImageIndex % foodImages.length];

  return (
    <div
      className={cn(
        "relative aspect-square rounded-xl shadow-lg transition-all duration-200 cursor-pointer overflow-hidden",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "min-h-[120px] min-w-[120px] ",
        isSelected && "ring-4 ring-blue-500 ring-offset-2",
        className
      )}
      onClick={onClick}
    >
      {/* Color border/frame */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          border: `5px solid ${color.hex}`,
        }}
      />

      {/* Food image on white background */}
      <div className="absolute inset-2 flex items-center justify-center bg-transparent rounded-lg">
        <Image
          src={foodImage}
          alt="Food item"
          width={80}
          height={80}
          className="w-3/4 h-3/4 object-contain"
        />
        {/* Subtle color tint overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none rounded-lg"
          style={{ backgroundColor: color.hex }}
        />
      </div>
      {showHex && (
        <div
          className="absolute bottom-2 left-2 text-xs font-mono font-bold px-2 py-1 rounded backdrop-blur-sm"
          style={{
            color: contrastColor,
            backgroundColor: `rgba(${
              contrastColor === "#ffffff" ? "255,255,255" : "0,0,0"
            }, 0.2)`,
          }}
        >
          {color.hex}
        </div>
      )}

      {showName && (
        <div
          className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
          style={{
            color: contrastColor,
            backgroundColor: `rgba(${
              contrastColor === "#ffffff" ? "255,255,255" : "0,0,0"
            }, 0.2)`,
          }}
        >
          {color.name}
        </div>
      )}

      {isSelected && (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: contrastColor, color: color.hex }}
        >
          ✓
        </div>
      )}
    </div>
  );
}
