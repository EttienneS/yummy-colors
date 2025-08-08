export interface Color {
  id: string;
  name: string;
  hex: string;
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  selectionCount: number;
}

export interface RoundResult {
  round: number;
  colorsShown: Color[];
  selectedColor: Color;
  timeSpent: number;
  timestamp: Date;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  colorsPerRound: number;
  allRounds: Color[][]; // Pre-generated colors for all rounds
  selectedColors: Color[];
  roundHistory: RoundResult[];
  favorites: Color[];
  finalTop3: Color[];
  gamePhase: "selection" | "finale" | "complete";
  startTime: Date;
}

export interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

export interface GameSession {
  id: string;
  gameState: GameState;
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  location?: LocationData;
  completedAt?: Date;
}
