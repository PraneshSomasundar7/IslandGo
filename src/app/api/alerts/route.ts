import { NextRequest, NextResponse } from "next/server";
import { getAlerts, saveAlert } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const alerts = await getAlerts(status);
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const alertId = await saveAlert({
      type: body.type,
      severity: body.severity,
      message: body.message,
      threshold: body.threshold,
      current_value: body.current_value,
      status: body.status || "Active",
      resolved_at: body.resolved_at ? new Date(body.resolved_at) : undefined,
    });
    return NextResponse.json({ id: alertId });
  } catch (error) {
    console.error("Error saving alert:", error);
    return NextResponse.json({ error: "Failed to save alert" }, { status: 500 });
  }
}

