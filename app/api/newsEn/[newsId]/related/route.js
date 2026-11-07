import { NextResponse } from "next/server";
import { PUBLIC_CACHE_HEADERS } from "@/lib/server/cache";
import { fetchSingleNews, supabaseRest } from "@/lib/server/supabase";

export async function GET(_req, { params }) {
  try {
    const { newsId } = await params;
    const current = await fetchSingleNews(newsId);

    if (!current) {
      return NextResponse.json({ data: [] });
    }

    const data = await supabaseRest("news", {
      query: {
        select: "*",
        category: `eq.${current.category}`,
        newsId: `neq.${newsId}`,
        status: "eq.Approved",
        order: "createdAt.desc",
        limit: "20",
      },
    });

    return NextResponse.json(
      { data: data || [] },
      { headers: PUBLIC_CACHE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch related news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
