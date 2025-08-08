import { NextRequest, NextResponse } from "next/server";
import { GameSession } from "@/types/game";
import {
  saveGameSession,
  getGameResults,
  getColorAnalytics,
  getLocationAnalytics,
} from "@/lib/database-pg";

export async function POST(request: NextRequest) {
  try {
    const gameSession: GameSession = await request.json();

    // Validate the game session data
    if (!gameSession.id || !gameSession.gameState) {
      return NextResponse.json(
        { error: "Invalid game session data" },
        { status: 400 }
      );
    }

    // Validate that the game is actually complete
    if (gameSession.gameState.gamePhase !== "complete") {
      return NextResponse.json(
        { error: "Can only save completed game sessions" },
        { status: 400 }
      );
    }

    // Save to database
    const result = await saveGameSession(gameSession);

    return NextResponse.json({
      success: true,
      message: "Game session saved successfully",
      sessionId: result.sessionId,
    });
  } catch (error) {
    console.error("Error saving game session:", error);
    return NextResponse.json(
      { error: "Failed to save game session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const includeAnalytics = url.searchParams.get("analytics") === "true";
    const includeLocationAnalytics =
      url.searchParams.get("locationAnalytics") === "true";

    // Get recent game results
    const recentResults = await getGameResults(limit);

    const response: {
      results: typeof recentResults;
      total: number;
      analytics?: Awaited<ReturnType<typeof getColorAnalytics>>;
      locationAnalytics?: Awaited<ReturnType<typeof getLocationAnalytics>>;
    } = {
      results: recentResults,
      total: recentResults.length,
    };

    // Include analytics if requested
    if (includeAnalytics) {
      response.analytics = await getColorAnalytics();
    }

    // Include location analytics if requested
    if (includeLocationAnalytics) {
      response.locationAnalytics = await getLocationAnalytics();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching game results:", error);
    return NextResponse.json(
      { error: "Failed to fetch game results" },
      { status: 500 }
    );
  }
}
