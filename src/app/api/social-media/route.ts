import { NextRequest, NextResponse } from "next/server";
import { getSocialMedia, saveSocialMedia } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") || undefined;
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    const socialMedia = await getSocialMedia(platform, startDate, endDate);
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Error fetching social media:", error);
    return NextResponse.json({ error: "Failed to fetch social media" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const socialMediaId = await saveSocialMedia({
      platform: body.platform,
      post_id: body.post_id,
      content_type: body.content_type,
      views: body.views || 0,
      likes: body.likes || 0,
      shares: body.shares || 0,
      comments: body.comments || 0,
      reach: body.reach || 0,
      impressions: body.impressions || 0,
      engagement_rate: body.engagement_rate || 0,
      date: new Date(body.date),
    });
    return NextResponse.json({ id: socialMediaId });
  } catch (error) {
    console.error("Error saving social media:", error);
    return NextResponse.json({ error: "Failed to save social media" }, { status: 500 });
  }
}

