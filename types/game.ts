export interface Color {
  id: string;
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
  selectedColors: Color[];
  roundHistory: RoundResult[];
  favorites: Color[];
  finalTop3: Color[];
  gamePhase: 'selection' | 'favorites' | 'finale' | 'complete';
  startTime: Date;
}

export interface GameSession {
  id: string;
  gameState: GameState;
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  completedAt?: Date;
}
