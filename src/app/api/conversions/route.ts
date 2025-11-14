import { NextRequest, NextResponse } from "next/server";
import { getConversions, saveConversion } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get("campaignId") || undefined;

    const conversions = await getConversions(campaignId);
    return NextResponse.json(conversions);
  } catch (error) {
    console.error("Error fetching conversions:", error);
    return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const conversionId = await saveConversion({
      campaign_id: body.campaign_id,
      stage: body.stage,
      user_id: body.user_id,
      value: body.value || 0,
      date: new Date(body.date),
    });
    return NextResponse.json({ id: conversionId });
  } catch (error) {
    console.error("Error saving conversion:", error);
    return NextResponse.json({ error: "Failed to save conversion" }, { status: 500 });
  }
}

