import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, saveCampaign } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const campaigns = await getCampaigns(status || undefined);
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaignId = await saveCampaign({
      name: body.name,
      status: body.status || "Draft",
      budget: body.budget,
      spent: body.spent || 0,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
      impressions: body.impressions || 0,
      clicks: body.clicks || 0,
      conversions: body.conversions || 0,
      revenue: body.revenue || 0,
      platform: body.platform,
    });
    return NextResponse.json({ id: campaignId });
  } catch (error) {
    console.error("Error saving campaign:", error);
    return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
  }
}

