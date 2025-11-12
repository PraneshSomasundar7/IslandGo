import { NextRequest, NextResponse } from "next/server";
import { getGaps } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const priority = (searchParams.get("priority") as "High" | "Medium" | "Low") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;

    const result = await getGaps(priority, page, limit, search);

    return NextResponse.json({
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching gaps:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch gaps",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

