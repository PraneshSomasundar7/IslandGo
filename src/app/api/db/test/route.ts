import { NextResponse } from "next/server";
import { initializeDatabase, getCreators, getGaps, getViralContent } from "@/lib/db";

// Test endpoint to verify database connection
export async function GET() {
  try {
    // Initialize database (creates tables if they don't exist)
    await initializeDatabase();

    // Test queries
    const creators = await getCreators(undefined, 1, 1);
    const gaps = await getGaps(undefined, 1, 1);
    const viral = await getViralContent(1, 1);

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      tables: {
        creators: {
          count: creators.total,
          sample: creators.data.length > 0 ? "Has data" : "Empty",
        },
        gaps: {
          count: gaps.total,
          sample: gaps.data.length > 0 ? "Has data" : "Empty",
        },
        viral_content: {
          count: viral.total,
          sample: viral.data.length > 0 ? "Has data" : "Empty",
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Database connection failed. Check your POSTGRES_URL environment variable.",
      },
      { status: 500 }
    );
  }
}

