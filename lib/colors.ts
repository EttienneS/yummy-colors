import { Color } from "@/types/game";

// Re-export Color type for convenience
export type { Color } from "@/types/game";

// Curated set of 50 named colors with food-related and appealing tones
export const CURATED_COLORS: Array<{
  name: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
  rgb: { r: number; g: number; b: number };
  category: "warm" | "cool" | "neutral" | "earth" | "bright";
}> = [
  // Warm/Red tones (appetizing)
  {
    name: "Tomato Red",
    hex: "#FF6347",
    hsl: { h: 9, s: 100, l: 64 },
    rgb: { r: 255, g: 99, b: 71 },
    category: "warm",
  },
  {
    name: "Coral",
    hex: "#FF7F50",
    hsl: { h: 16, s: 100, l: 66 },
    rgb: { r: 255, g: 127, b: 80 },
    category: "warm",
  },
  {
    name: "Salmon",
    hex: "#FA8072",
    hsl: { h: 6, s: 93, l: 71 },
    rgb: { r: 250, g: 128, b: 114 },
    category: "warm",
  },
  {
    name: "Crimson",
    hex: "#DC143C",
    hsl: { h: 348, s: 83, l: 47 },
    rgb: { r: 220, g: 20, b: 60 },
    category: "warm",
  },
  {
    name: "Fire Brick",
    hex: "#B22222",
    hsl: { h: 0, s: 68, l: 42 },
    rgb: { r: 178, g: 34, b: 34 },
    category: "warm",
  },

  // Orange tones (citrus/appetizing)
  {
    name: "Orange",
    hex: "#FFA500",
    hsl: { h: 39, s: 100, l: 50 },
    rgb: { r: 255, g: 165, b: 0 },
    category: "warm",
  },
  {
    name: "Dark Orange",
    hex: "#FF8C00",
    hsl: { h: 33, s: 100, l: 50 },
    rgb: { r: 255, g: 140, b: 0 },
    category: "warm",
  },
  {
    name: "Papaya",
    hex: "#FFEFD5",
    hsl: { h: 37, s: 100, l: 92 },
    rgb: { r: 255, g: 239, b: 213 },
    category: "warm",
  },
  {
    name: "Peach",
    hex: "#FFCBA4",
    hsl: { h: 28, s: 100, l: 82 },
    rgb: { r: 255, g: 203, b: 164 },
    category: "warm",
  },
  {
    name: "Carrot",
    hex: "#ED9121",
    hsl: { h: 34, s: 85, l: 54 },
    rgb: { r: 237, g: 145, b: 33 },
    category: "warm",
  },

  // Yellow tones (bright/energetic)
  {
    name: "Gold",
    hex: "#FFD700",
    hsl: { h: 51, s: 100, l: 50 },
    rgb: { r: 255, g: 215, b: 0 },
    category: "bright",
  },
  {
    name: "Lemon",
    hex: "#FFFACD",
    hsl: { h: 54, s: 100, l: 90 },
    rgb: { r: 255, g: 250, b: 205 },
    category: "bright",
  },
  {
    name: "Banana",
    hex: "#FFE135",
    hsl: { h: 53, s: 100, l: 60 },
    rgb: { r: 255, g: 225, b: 53 },
    category: "bright",
  },
  {
    name: "Corn",
    hex: "#FBEC5D",
    hsl: { h: 55, s: 95, l: 68 },
    rgb: { r: 251, g: 236, b: 93 },
    category: "bright",
  },
  {
    name: "Mustard",
    hex: "#FFDB58",
    hsl: { h: 48, s: 100, l: 67 },
    rgb: { r: 255, g: 219, b: 88 },
    category: "bright",
  },

  // Green tones (fresh/natural)
  {
    name: "Lime",
    hex: "#32CD32",
    hsl: { h: 120, s: 61, l: 50 },
    rgb: { r: 50, g: 205, b: 50 },
    category: "cool",
  },
  {
    name: "Forest Green",
    hex: "#228B22",
    hsl: { h: 120, s: 61, l: 34 },
    rgb: { r: 34, g: 139, b: 34 },
    category: "cool",
  },
  {
    name: "Olive",
    hex: "#808000",
    hsl: { h: 60, s: 100, l: 25 },
    rgb: { r: 128, g: 128, b: 0 },
    category: "earth",
  },
  {
    name: "Avocado",
    hex: "#9CAF88",
    hsl: { h: 94, s: 25, l: 62 },
    rgb: { r: 156, g: 175, b: 136 },
    category: "earth",
  },
  {
    name: "Mint",
    hex: "#98FB98",
    hsl: { h: 120, s: 93, l: 79 },
    rgb: { r: 152, g: 251, b: 152 },
    category: "cool",
  },

  // Blue tones (cool/refreshing)
  {
    name: "Sky Blue",
    hex: "#87CEEB",
    hsl: { h: 197, s: 71, l: 73 },
    rgb: { r: 135, g: 206, b: 235 },
    category: "cool",
  },
  {
    name: "Ocean Blue",
    hex: "#0077BE",
    hsl: { h: 203, s: 100, l: 37 },
    rgb: { r: 0, g: 119, b: 190 },
    category: "cool",
  },
  {
    name: "Turquoise",
    hex: "#40E0D0",
    hsl: { h: 174, s: 72, l: 56 },
    rgb: { r: 64, g: 224, b: 208 },
    category: "cool",
  },
  {
    name: "Teal",
    hex: "#008080",
    hsl: { h: 180, s: 100, l: 25 },
    rgb: { r: 0, g: 128, b: 128 },
    category: "cool",
  },
  {
    name: "Navy",
    hex: "#000080",
    hsl: { h: 240, s: 100, l: 25 },
    rgb: { r: 0, g: 0, b: 128 },
    category: "cool",
  },

  // Purple tones (rich/luxurious)
  {
    name: "Lavender",
    hex: "#E6E6FA",
    hsl: { h: 240, s: 67, l: 94 },
    rgb: { r: 230, g: 230, b: 250 },
    category: "cool",
  },
  {
    name: "Plum",
    hex: "#DDA0DD",
    hsl: { h: 300, s: 47, l: 75 },
    rgb: { r: 221, g: 160, b: 221 },
    category: "cool",
  },
  {
    name: "Grape",
    hex: "#6F2DA8",
    hsl: { h: 271, s: 57, l: 42 },
    rgb: { r: 111, g: 45, b: 168 },
    category: "cool",
  },
  {
    name: "Eggplant",
    hex: "#614051",
    hsl: { h: 325, s: 20, l: 34 },
    rgb: { r: 97, g: 64, b: 81 },
    category: "earth",
  },
  {
    name: "Wine",
    hex: "#722F37",
    hsl: { h: 353, s: 42, l: 32 },
    rgb: { r: 114, g: 47, b: 55 },
    category: "earth",
  },

  // Brown/Earth tones (natural/appetizing)
  {
    name: "Chocolate",
    hex: "#D2691E",
    hsl: { h: 25, s: 75, l: 47 },
    rgb: { r: 210, g: 105, b: 30 },
    category: "earth",
  },
  {
    name: "Coffee",
    hex: "#6F4E37",
    hsl: { h: 25, s: 31, l: 33 },
    rgb: { r: 111, g: 78, b: 55 },
    category: "earth",
  },
  {
    name: "Caramel",
    hex: "#C68E17",
    hsl: { h: 38, s: 78, l: 44 },
    rgb: { r: 198, g: 142, b: 23 },
    category: "earth",
  },
  {
    name: "Cinnamon",
    hex: "#CD853F",
    hsl: { h: 30, s: 59, l: 52 },
    rgb: { r: 205, g: 133, b: 63 },
    category: "earth",
  },
  {
    name: "Tan",
    hex: "#D2B48C",
    hsl: { h: 34, s: 44, l: 69 },
    rgb: { r: 210, g: 180, b: 140 },
    category: "earth",
  },

  // Pink tones (sweet/dessert)
  {
    name: "Rose",
    hex: "#FF69B4",
    hsl: { h: 330, s: 100, l: 71 },
    rgb: { r: 255, g: 105, b: 180 },
    category: "warm",
  },
  {
    name: "Pink",
    hex: "#FFC0CB",
    hsl: { h: 350, s: 100, l: 88 },
    rgb: { r: 255, g: 192, b: 203 },
    category: "warm",
  },
  {
    name: "Berry",
    hex: "#8B0000",
    hsl: { h: 0, s: 100, l: 27 },
    rgb: { r: 139, g: 0, b: 0 },
    category: "warm",
  },
  {
    name: "Strawberry",
    hex: "#FC5A8D",
    hsl: { h: 343, s: 96, l: 67 },
    rgb: { r: 252, g: 90, b: 141 },
    category: "warm",
  },
  {
    name: "Blush",
    hex: "#DE5D83",
    hsl: { h: 343, s: 61, l: 61 },
    rgb: { r: 222, g: 93, b: 131 },
    category: "warm",
  },

  // Neutral tones (versatile)
  {
    name: "Cream",
    hex: "#F5F5DC",
    hsl: { h: 60, s: 56, l: 91 },
    rgb: { r: 245, g: 245, b: 220 },
    category: "neutral",
  },
  {
    name: "Beige",
    hex: "#F5DEB3",
    hsl: { h: 33, s: 78, l: 84 },
    rgb: { r: 245, g: 222, b: 179 },
    category: "neutral",
  },
  {
    name: "Ivory",
    hex: "#FFFFF0",
    hsl: { h: 60, s: 100, l: 97 },
    rgb: { r: 255, g: 255, b: 240 },
    category: "neutral",
  },
  {
    name: "Pearl",
    hex: "#F8F6F0",
    hsl: { h: 45, s: 44, l: 96 },
    rgb: { r: 248, g: 246, b: 240 },
    category: "neutral",
  },
  {
    name: "Sand",
    hex: "#C2B280",
    hsl: { h: 45, s: 38, l: 63 },
    rgb: { r: 194, g: 178, b: 128 },
    category: "neutral",
  },

  // Additional appetizing colors
  {
    name: "Honey",
    hex: "#FFC30F",
    hsl: { h: 46, s: 100, l: 53 },
    rgb: { r: 255, g: 195, b: 15 },
    category: "bright",
  },
  {
    name: "Amber",
    hex: "#FFBF00",
    hsl: { h: 45, s: 100, l: 50 },
    rgb: { r: 255, g: 191, b: 0 },
    category: "bright",
  },
  {
    name: "Apricot",
    hex: "#FBCEB1",
    hsl: { h: 24, s: 90, l: 84 },
    rgb: { r: 251, g: 206, b: 177 },
    category: "warm",
  },
  {
    name: "Mango",
    hex: "#FFCC5C",
    hsl: { h: 42, s: 100, l: 68 },
    rgb: { r: 255, g: 204, b: 92 },
    category: "bright",
  },
  {
    name: "Saffron",
    hex: "#F4C430",
    hsl: { h: 45, s: 89, l: 57 },
    rgb: { r: 244, g: 196, b: 48 },
    category: "bright",
  },
  {
    name: "Burgundy",
    hex: "#800020",
    hsl: { h: 345, s: 100, l: 25 },
    rgb: { r: 128, g: 0, b: 32 },
    category: "earth",
  },
];

// Convert curated color to game Color type
function createColorFromCurated(
  curatedColor: (typeof CURATED_COLORS)[0]
): Color {
  return {
    id: crypto.randomUUID(),
    hex: curatedColor.hex,
    hsl: curatedColor.hsl,
    rgb: curatedColor.rgb,
    selectionCount: 0,
  };
}

export function generateRandomColor(): Color {
  // Select a random color from our curated set
  const randomIndex = Math.floor(Math.random() * CURATED_COLORS.length);
  const selectedColor = CURATED_COLORS[randomIndex];
  return createColorFromCurated(selectedColor);
}

export function generateColorSet(count: number): Color[] {
  // Ensure we don't request more colors than we have available
  const requestedCount = Math.min(count, CURATED_COLORS.length);

  // Create a copy of the curated colors array and shuffle it
  const shuffled = [...CURATED_COLORS].sort(() => Math.random() - 0.5);

  // Take the first 'count' colors and convert them
  return shuffled.slice(0, requestedCount).map(createColorFromCurated);
}

export function generateBalancedColorSet(count: number): Color[] {
  // Generate a balanced set with colors from different categories
  const categories: Array<"warm" | "cool" | "neutral" | "earth" | "bright"> = [
    "warm",
    "cool",
    "neutral",
    "earth",
    "bright",
  ];
  const colorsPerCategory = Math.ceil(count / categories.length);
  const selectedColors: Color[] = [];

  for (const category of categories) {
    const categoryColors = CURATED_COLORS.filter(
      (c) => c.category === category
    );
    const shuffled = categoryColors.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(colorsPerCategory, categoryColors.length)
    );
    selectedColors.push(...selected.map(createColorFromCurated));

    if (selectedColors.length >= count) break;
  }

  // Shuffle the final set and return the requested count
  return selectedColors.sort(() => Math.random() - 0.5).slice(0, count);
}

export function getColorByName(name: string): Color | null {
  const found = CURATED_COLORS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  return found ? createColorFromCurated(found) : null;
}

export function getColorsByCategory(
  category: "warm" | "cool" | "neutral" | "earth" | "bright"
): Color[] {
  return CURATED_COLORS.filter((c) => c.category === category).map(
    createColorFromCurated
  );
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("")}`;
}

export function getContrastColor(color: Color): string {
  // Calculate relative luminance
  const { r, g, b } = color.rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export function getMostSelectedColors(colors: Color[], count: number): Color[] {
  return colors
    .sort((a, b) => b.selectionCount - a.selectionCount)
    .slice(0, count);
}
