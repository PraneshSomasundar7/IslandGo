import { NextRequest, NextResponse } from "next/server";
import { getCompetitors, saveCompetitor } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const competitorName = searchParams.get("competitorName") || undefined;

    const competitors = await getCompetitors(competitorName);
    return NextResponse.json(competitors);
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return NextResponse.json({ error: "Failed to fetch competitors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const competitorId = await saveCompetitor({
      competitor_name: body.competitor_name,
      metric: body.metric,
      value: body.value,
      date: new Date(body.date),
    });
    return NextResponse.json({ id: competitorId });
  } catch (error) {
    console.error("Error saving competitor:", error);
    return NextResponse.json({ error: "Failed to save competitor" }, { status: 500 });
  }
}

