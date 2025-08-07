import React from 'react';
import { Color, getContrastColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface ColorCardProps {
  color: Color;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showHex?: boolean;
}

export function ColorCard({ 
  color, 
  isSelected = false, 
  onClick, 
  className,
  showHex = false 
}: ColorCardProps) {
  const contrastColor = getContrastColor(color);
  
  return (
    <div
      className={cn(
        "relative aspect-square rounded-xl shadow-lg transition-all duration-200 cursor-pointer",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "min-h-[120px] min-w-[120px]",
        isSelected && "ring-4 ring-blue-500 ring-offset-2",
        className
      )}
      style={{ backgroundColor: color.hex }}
      onClick={onClick}
    >
      {showHex && (
        <div 
          className="absolute bottom-2 left-2 text-xs font-mono font-bold px-2 py-1 rounded backdrop-blur-sm"
          style={{ color: contrastColor, backgroundColor: `rgba(${contrastColor === '#ffffff' ? '255,255,255' : '0,0,0'}, 0.2)` }}
        >
          {color.hex}
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
