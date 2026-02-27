import { NextResponse } from "next/server";
import { extractVideoIdFromUrl, saveVideoThumbnail, syncYoutubeVideos } from "@/lib/server/video";
import { supabaseRest } from "@/lib/server/supabase";

let lastSyncAt = 0;
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

async function maybeSyncYoutube(force = false) {
  const now = Date.now();
  if (force || now - lastSyncAt > SYNC_INTERVAL_MS) {
    await syncYoutubeVideos();
    lastSyncAt = now;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forceSync = searchParams.get("sync") === "1";

    await maybeSyncYoutube(forceSync);

    const data = await supabaseRest("videos", {
      query: {
        select: "*",
        status: "neq.Unapproved",
        order: "published.desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Videos fetched successfully",
      data: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching videos", error: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const titleEn = (formData.get("titleEn") || "").toString().trim();
    const titleTe = (formData.get("titleTe") || "").toString().trim();
    const category = (formData.get("category") || "").toString().trim();
    const URL = (formData.get("URL") || "").toString().trim();
    const thumbnailInput = formData.get("thumbnail");

    if (!titleEn || !titleTe || !URL) {
      return NextResponse.json({ success: false, message: "titleEn, titleTe, URL are required" }, { status: 400 });
    }

    const videoId = extractVideoIdFromUrl(URL);
    if (!videoId) {
      return NextResponse.json({ success: false, message: "Invalid YouTube URL" }, { status: 400 });
    }

    const thumbnail = await saveVideoThumbnail(thumbnailInput);

    const rows = await supabaseRest("videos", {
      method: "POST",
      query: { on_conflict: "videoId" },
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: [{
        videoId,
        titleEn,
        titleTe,
        title: titleEn,
        category: category || "Recorded",
        URL,
        thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        published: new Date().toISOString(),
        status: "Pending",
        source: "manual",
      }],
    });

    return NextResponse.json({ success: true, data: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Error adding video", error: error.data || null },
      { status: error.status || 500 }
    );
  }
}
