import { NextRequest, NextResponse } from "next/server";
import { getBudgets, saveBudget } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month") || undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

    const budgets = await getBudgets(month, year);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.category || !body.allocated || !body.month || !body.year) {
      return NextResponse.json(
        { error: "Missing required fields: category, allocated, month, year" },
        { status: 400 }
      );
    }

    const budgetId = await saveBudget({
      category: body.category,
      allocated: parseFloat(body.allocated),
      spent: body.spent ? parseFloat(body.spent) : 0,
      month: body.month,
      year: parseInt(body.year),
    });
    return NextResponse.json({ id: budgetId, success: true });
  } catch (error) {
    console.error("Error saving budget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to save budget: ${errorMessage}` },
      { status: 500 }
    );
  }
}

