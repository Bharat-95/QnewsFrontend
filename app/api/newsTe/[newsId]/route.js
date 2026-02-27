import { NextResponse } from "next/server";
import { fetchSingleNews } from "@/lib/server/supabase";

export async function GET(_req, { params }) {
  try {
    const { newsId } = await params;
    const data = await fetchSingleNews(newsId);

    if (!data) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
