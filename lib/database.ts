import fs from "fs";
import path from "path";
import { GameSession } from "@/types/game";
import { CURATED_COLORS } from "./colors";

// Data file path
const dataPath = path.join(process.cwd(), "data", "game-results.json");

// Ensure data directory exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper functions to get color metadata
function getColorName(hex: string): string {
  const color = CURATED_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return color ? color.name : hex;
}

function getColorCategory(hex: string): string {
  const color = CURATED_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return color ? color.category : "unknown";
}

interface StoredGameData {
  sessions: GameSession[];
  lastUpdated: string;
}

function readGameData(): StoredGameData {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading game data:", error);
  }

  return {
    sessions: [],
    lastUpdated: new Date().toISOString(),
  };
}

function writeGameData(data: StoredGameData): void {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing game data:", error);
    throw error;
  }
}

export function saveGameSession(gameSession: GameSession) {
  try {
    const data = readGameData();

    // Add completed timestamp if not present
    const sessionToSave = {
      ...gameSession,
      completedAt: gameSession.completedAt || new Date(),
    };

    // Check if session already exists and update it, otherwise add new
    const existingIndex = data.sessions.findIndex(
      (s) => s.id === gameSession.id
    );
    if (existingIndex >= 0) {
      data.sessions[existingIndex] = sessionToSave;
    } else {
      data.sessions.push(sessionToSave);
    }

    data.lastUpdated = new Date().toISOString();
    writeGameData(data);

    return { success: true, sessionId: gameSession.id };
  } catch (error) {
    console.error("Error saving game session:", error);
    throw error;
  }
}

export function getGameResults(limit: number = 100) {
  try {
    const data = readGameData();

    // Filter completed sessions and return recent ones
    const completedSessions = data.sessions
      .filter((session) => session.gameState.gamePhase === "complete")
      .sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bTime - aTime; // Most recent first
      })
      .slice(0, limit);

    return completedSessions.map((session) => ({
      id: session.id,
      completedAt: session.completedAt,
      userAgent: session.userAgent,
      screenSize: session.screenSize,
      totalRounds: session.gameState.totalRounds,
      finalColors: session.gameState.finalTop3.map((color, index) => ({
        hex: color.hex,
        rank: index + 1,
        hsl: color.hsl,
        selectionCount: color.selectionCount,
      })),
      roundHistory: session.gameState.roundHistory.length,
      favoritesCount: session.gameState.favorites.length,
    }));
  } catch (error) {
    console.error("Error getting game results:", error);
    throw error;
  }
}

export function getColorAnalytics() {
  try {
    const data = readGameData();
    const completedSessions = data.sessions.filter(
      (s) => s.gameState.gamePhase === "complete"
    );

    // Collect all final colors
    const finalColors = completedSessions.flatMap((session) =>
      session.gameState.finalTop3.map((color, index) => ({
        ...color,
        rank: index + 1,
        sessionId: session.id,
      }))
    );

    // Collect all selected colors from rounds
    const selectedColors = completedSessions.flatMap((session) =>
      session.gameState.roundHistory.map((round) => ({
        ...round.selectedColor,
        sessionId: session.id,
        round: round.round,
      }))
    );

    // Popular final colors with names and categories
    const colorFrequency = new Map<
      string,
      {
        hex: string;
        name: string;
        category: string;
        frequency: number;
        avgRank: number;
        avgHue: number;
        avgSaturation: number;
        avgLightness: number;
      }
    >();

    finalColors.forEach((color) => {
      const existing = colorFrequency.get(color.hex);
      if (existing) {
        existing.frequency++;
        existing.avgRank = (existing.avgRank + color.rank) / 2;
        existing.avgHue = (existing.avgHue + color.hsl.h) / 2;
        existing.avgSaturation = (existing.avgSaturation + color.hsl.s) / 2;
        existing.avgLightness = (existing.avgLightness + color.hsl.l) / 2;
      } else {
        colorFrequency.set(color.hex, {
          hex: color.hex,
          name: getColorName(color.hex),
          category: getColorCategory(color.hex),
          frequency: 1,
          avgRank: color.rank,
          avgHue: color.hsl.h,
          avgSaturation: color.hsl.s,
          avgLightness: color.hsl.l,
        });
      }
    });

    const popularFinalColors = Array.from(colorFrequency.values())
      .sort((a, b) => b.frequency - a.frequency || a.avgRank - b.avgRank)
      .slice(0, 20);

    // Color name preferences
    const nameStats = new Map<string, number>();
    selectedColors.forEach((color) => {
      const name = getColorName(color.hex);
      nameStats.set(name, (nameStats.get(name) || 0) + 1);
    });

    const colorNamePreferences = Array.from(nameStats.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Category preferences
    const categoryStats = new Map<string, number>();
    selectedColors.forEach((color) => {
      const category = getColorCategory(color.hex);
      categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
    });

    const categoryPreferences = Array.from(categoryStats.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Hue preferences (grouped by 30-degree ranges)
    const hueRanges = new Map<number, number>();
    finalColors.forEach((color) => {
      const range = Math.floor(color.hsl.h / 30) * 30;
      hueRanges.set(range, (hueRanges.get(range) || 0) + 1);
    });

    const huePreferences = Array.from(hueRanges.entries())
      .map(([range, frequency]) => ({ hue_range: range, frequency }))
      .sort((a, b) => a.hue_range - b.hue_range);

    // Saturation preferences (grouped by 10% ranges)
    const saturationRanges = new Map<number, number>();
    finalColors.forEach((color) => {
      const range = Math.floor(color.hsl.s / 10) * 10;
      saturationRanges.set(range, (saturationRanges.get(range) || 0) + 1);
    });

    const saturationPreferences = Array.from(saturationRanges.entries())
      .map(([range, frequency]) => ({ saturation_range: range, frequency }))
      .sort((a, b) => a.saturation_range - b.saturation_range);

    // Lightness preferences (grouped by 10% ranges)
    const lightnessRanges = new Map<number, number>();
    finalColors.forEach((color) => {
      const range = Math.floor(color.hsl.l / 10) * 10;
      lightnessRanges.set(range, (lightnessRanges.get(range) || 0) + 1);
    });

    const lightnessPreferences = Array.from(lightnessRanges.entries())
      .map(([range, frequency]) => ({ lightness_range: range, frequency }))
      .sort((a, b) => a.lightness_range - b.lightness_range);

    return {
      popularFinalColors,
      huePreferences,
      saturationPreferences,
      lightnessPreferences,
      colorNamePreferences,
      categoryPreferences,
      totalSessions: completedSessions.length,
      totalColors: finalColors.length,
      totalRounds: selectedColors.length,
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    throw error;
  }
}
