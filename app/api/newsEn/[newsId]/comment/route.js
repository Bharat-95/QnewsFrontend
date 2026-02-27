import { NextResponse } from "next/server";
import { fetchSingleNews } from "@/lib/server/supabase";
import { buildComment, updateNewsById } from "@/lib/server/news";

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const { userEmail, firstName, lastName, comment } = await req.json();

    if (!userEmail || !comment?.trim()) {
      return NextResponse.json({ message: "userEmail and comment are required" }, { status: 400 });
    }

    const news = await fetchSingleNews(newsId);
    if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });

    const comments = Array.isArray(news.comments) ? news.comments : [];
    const newComment = buildComment({ userEmail, firstName, lastName, comment: comment.trim() });

    const updated = await updateNewsById(newsId, {
      comments: [...comments, newComment],
    });

    return NextResponse.json({ success: true, data: updated, comment: newComment });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Comment failed", details: error.data || null }, { status: error.status || 500 });
  }
}
