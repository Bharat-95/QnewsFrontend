import { NextResponse } from "next/server";
import { fetchSingleNews } from "@/lib/server/supabase";
import { buildReply, updateNewsById } from "@/lib/server/news";

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const { commentId, userEmail, firstName, lastName, reply } = await req.json();

    if (!commentId || !userEmail || !reply?.trim()) {
      return NextResponse.json({ message: "commentId, userEmail and reply are required" }, { status: 400 });
    }

    const news = await fetchSingleNews(newsId);
    if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });

    const comments = Array.isArray(news.comments) ? news.comments : [];
    const newReply = buildReply({ userEmail, firstName, lastName, reply: reply.trim() });

    const nextComments = comments.map((item) => {
      if (item.commentId !== commentId) return item;
      return {
        ...item,
        replies: [...(Array.isArray(item.replies) ? item.replies : []), newReply],
      };
    });

    await updateNewsById(newsId, { comments: nextComments });

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Reply failed", details: error.data || null }, { status: error.status || 500 });
  }
}
