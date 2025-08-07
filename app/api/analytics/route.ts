import { NextResponse } from "next/server";
import { getColorAnalytics } from "@/lib/database";

export async function GET() {
  try {
    const analytics = getColorAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
