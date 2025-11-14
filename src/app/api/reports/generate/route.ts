import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, getBudgets, getEngagementMetrics, getSocialMedia } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, dateRange, startDate, endDate, format } = body;

    let start: Date;
    let end: Date = new Date();

    if (dateRange === "custom" && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const days = parseInt(dateRange) || 30;
      start = new Date();
      start.setDate(start.getDate() - days);
    }

    let data: any = {};

    switch (type) {
      case "comprehensive":
        data = {
          campaigns: await getCampaigns(),
          budgets: await getBudgets(),
          engagement: await getEngagementMetrics(start, end),
          socialMedia: await getSocialMedia(undefined, start, end),
        };
        break;
      case "campaigns":
        data = { campaigns: await getCampaigns() };
        break;
      case "budget":
        data = { budgets: await getBudgets() };
        break;
      case "engagement":
        data = { engagement: await getEngagementMetrics(start, end) };
        break;
      case "social":
        data = { socialMedia: await getSocialMedia(undefined, start, end) };
        break;
      default:
        data = {};
    }

    // For now, return JSON. In production, you'd generate PDF/CSV/Excel
    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="report-${new Date().toISOString()}.json"`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

