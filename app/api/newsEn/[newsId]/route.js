import { NextResponse } from "next/server";
import { deleteNewsImageByUrl, toSlug, updateNewsById } from "@/lib/server/news";
import { fetchSingleNews, supabaseRest } from "@/lib/server/supabase";

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

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const payload = await req.json();

    if (payload.headlineEn && !payload.slug) {
      payload.slug = toSlug(payload.headlineEn);
    }

    const updated = await updateNewsById(newsId, payload);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { newsId } = await params;
    const existing = await fetchSingleNews(newsId);
    if (!existing) {
      return NextResponse.json({ success: false, message: "News not found" }, { status: 404 });
    }

    await supabaseRest("news", {
      method: "DELETE",
      query: {
        newsId: `eq.${newsId}`,
      },
    });

    if (existing.image) {
      try {
        await deleteNewsImageByUrl(existing.image);
      } catch (cleanupError) {
        console.error("Failed to delete related news image:", cleanupError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
