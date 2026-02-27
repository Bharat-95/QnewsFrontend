import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET(_req, { params }) {
  try {
    const { paperId } = await params;
    const rows = await supabaseRest("papers", {
      query: {
        select: "*",
        paperId: `eq.${paperId}`,
        limit: "1",
      },
    });

    const paper = rows?.[0] || null;
    if (!paper) {
      return NextResponse.json({ success: false, message: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: paper });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch paper", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
