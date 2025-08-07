import { NextRequest, NextResponse } from "next/server";
import { GameSession } from "@/types/game";

// In a real application, you would store this in a database
// For now, we'll use a simple in-memory store
const gameResults: GameSession[] = [];

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

    // Store the game session
    gameResults.push({
      ...gameSession,
      completedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Game session saved successfully",
      sessionId: gameSession.id,
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

    // Return recent game results (in a real app, you'd query from database)
    const recentResults = gameResults.slice(-limit).map((session) => ({
      id: session.id,
      completedAt: session.completedAt,
      finalTop3: session.gameState.finalTop3,
      roundCount: session.gameState.totalRounds,
      userAgent: session.userAgent,
      screenSize: session.screenSize,
    }));

    return NextResponse.json({
      results: recentResults,
      total: gameResults.length,
    });
  } catch (error) {
    console.error("Error fetching game results:", error);
    return NextResponse.json(
      { error: "Failed to fetch game results" },
      { status: 500 }
    );
  }
}
