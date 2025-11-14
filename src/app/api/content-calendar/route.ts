import { NextRequest, NextResponse } from "next/server";
import { getContentCalendar, saveContentCalendar } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    let content = await getContentCalendar(startDate, endDate);
    if (status) {
      content = content.filter((c) => c.status === status);
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content calendar:", error);
    return NextResponse.json({ error: "Failed to fetch content calendar" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contentId = await saveContentCalendar({
      title: body.title,
      content_type: body.content_type,
      platform: body.platform,
      scheduled_date: new Date(body.scheduled_date),
      status: body.status || "Scheduled",
      creator_id: body.creator_id,
    });
    return NextResponse.json({ id: contentId });
  } catch (error) {
    console.error("Error saving content calendar:", error);
    return NextResponse.json({ error: "Failed to save content calendar" }, { status: 500 });
  }
}

