import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") 
      ? new Date(searchParams.get("startDate")!) 
      : undefined;
    const endDate = searchParams.get("endDate") 
      ? new Date(searchParams.get("endDate")!) 
      : undefined;

    const analytics = await getAnalyticsData(startDate, endDate);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

