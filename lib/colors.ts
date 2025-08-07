import { Color } from '@/types/game';

// Re-export Color type for convenience
export type { Color } from '@/types/game';

export function generateRandomColor(): Color {
  // Generate colors with good saturation and lightness for visibility
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 40; // 40-80% saturation
  const l = Math.floor(Math.random() * 30) + 35; // 35-65% lightness
  
  const id = crypto.randomUUID();
  const hsl = { h, s, l };
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return {
    id,
    hex,
    hsl,
    rgb,
    selectionCount: 0
  };
}

export function generateColorSet(count: number): Color[] {
  return Array.from({ length: count }, () => generateRandomColor());
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

export function getContrastColor(color: Color): string {
  // Calculate relative luminance
  const { r, g, b } = color.rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function getMostSelectedColors(colors: Color[], count: number): Color[] {
  return colors
    .sort((a, b) => b.selectionCount - a.selectionCount)
    .slice(0, count);
}
