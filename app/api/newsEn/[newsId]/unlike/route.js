import { NextResponse } from "next/server";
import { fetchSingleNews } from "@/lib/server/supabase";
import { updateNewsById } from "@/lib/server/news";

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const { userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ message: "userEmail is required" }, { status: 400 });
    }

    const news = await fetchSingleNews(newsId);
    if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });

    const likedBy = Array.isArray(news.likedBy) ? news.likedBy : [];
    const nextLikedBy = likedBy.filter((email) => email !== userEmail);
    const decremented = Math.max(0, (news.likes || 0) - (likedBy.length === nextLikedBy.length ? 0 : 1));

    const updated = await updateNewsById(newsId, {
      likes: decremented,
      likedBy: nextLikedBy,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Unlike failed", details: error.data || null }, { status: error.status || 500 });
  }
}
