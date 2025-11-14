import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    if (body.status === "Resolved") {
      await sql`UPDATE alerts SET status = 'Resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    } else {
      await sql`UPDATE alerts SET status = ${body.status} WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}

