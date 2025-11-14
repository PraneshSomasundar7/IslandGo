import { NextRequest, NextResponse } from "next/server";
import { getEngagementMetrics, saveEngagement } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    const metrics = await getEngagementMetrics(startDate, endDate);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return NextResponse.json({ error: "Failed to fetch engagement metrics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const engagementId = await saveEngagement({
      content_id: body.content_id,
      content_type: body.content_type,
      platform: body.platform,
      views: body.views || 0,
      likes: body.likes || 0,
      shares: body.shares || 0,
      comments: body.comments || 0,
      engagement_rate: body.engagement_rate || 0,
      date: new Date(body.date),
    });
    return NextResponse.json({ id: engagementId });
  } catch (error) {
    console.error("Error saving engagement:", error);
    return NextResponse.json({ error: "Failed to save engagement" }, { status: 500 });
  }
}

