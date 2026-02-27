import { NextResponse } from "next/server";
import { fetchSingleNews } from "@/lib/server/supabase";
import { updateNewsById } from "@/lib/server/news";

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const { commentId, userEmail } = await req.json();

    if (!commentId || !userEmail) {
      return NextResponse.json({ message: "commentId and userEmail are required" }, { status: 400 });
    }

    const news = await fetchSingleNews(newsId);
    if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });

    const comments = Array.isArray(news.comments) ? news.comments : [];
    const nextComments = comments.map((item) => {
      if (item.commentId !== commentId) return item;
      const likedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
      if (likedBy.includes(userEmail)) return item;
      return {
        ...item,
        likes: (item.likes || 0) + 1,
        likedBy: [...likedBy, userEmail],
      };
    });

    const updated = await updateNewsById(newsId, { comments: nextComments });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Comment like failed", details: error.data || null }, { status: error.status || 500 });
  }
}
