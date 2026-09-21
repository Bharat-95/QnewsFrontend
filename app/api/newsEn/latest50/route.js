import { NextResponse } from "next/server";
import { NEWS_LIST_COLUMNS } from "@/lib/server/news";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET() {
  try {
    const data = await supabaseRest("news", {
      query: {
        select: NEWS_LIST_COLUMNS,
        order: "createdAt.desc",
        limit: "50",
      },
    });

    return NextResponse.json(
      { data: data || [] },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch latest news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
