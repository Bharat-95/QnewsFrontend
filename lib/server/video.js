import fs from "fs/promises";
import path from "path";
import { supabaseRest } from "@/lib/server/supabase";

export const CHANNEL_IDS = [
  "UCI-7hequY2IuQjpuj6g9BlA",
  "UCbivggwUD5UjHhYmkha8DdQ",
  "UCUVJf9GvRRxUDauQi-qCcfQ",
  "UCvOTCRd0GKMSGeKww86Qw5Q",
];

function decodeXml(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractMatch(input, regex) {
  const match = input.match(regex);
  return match?.[1] ? decodeXml(match[1].trim()) : "";
}

export function extractVideoIdFromUrl(url = "") {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").trim();
    }

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v").trim();
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex >= 0 && parts[embedIndex + 1]) {
      return parts[embedIndex + 1].trim();
    }

    return "";
  } catch {
    return "";
  }
}

export function parseYoutubeFeedXml(xml, channelId) {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];

  return entries
    .map((entry) => {
      const videoId = extractMatch(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/i);
      const title = extractMatch(entry, /<title>([\s\S]*?)<\/title>/i);
      const published = extractMatch(entry, /<published>([^<]+)<\/published>/i);
      const link = extractMatch(entry, /<link[^>]*href="([^"]+)"/i);
      const thumbnail = extractMatch(entry, /<media:thumbnail[^>]*url="([^"]+)"/i);

      if (!videoId || !title || !published) return null;
      if (title.includes("Shorts") || title.includes("#")) return null;

      return {
        videoId,
        channelId,
        titleEn: title,
        titleTe: title,
        title,
        category: "YouTube",
        URL: link || `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        published,
        status: "Approved",
        source: "youtube_feed",
        createdAt: published,
      };
    })
    .filter(Boolean);
}

export async function fetchVideosFromChannel(channelId) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(feedUrl, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`YouTube feed fetch failed for channel ${channelId} with ${res.status}`);
  }

  const xml = await res.text();
  return parseYoutubeFeedXml(xml, channelId);
}

export async function syncYoutubeVideos() {
  let allVideos = [];

  for (const channelId of CHANNEL_IDS) {
    try {
      const videos = await fetchVideosFromChannel(channelId);
      allVideos = allVideos.concat(videos);
    } catch (error) {
      // Keep partial success if one channel fails.
      console.error("YouTube sync channel error:", channelId, error.message);
    }
  }

  if (allVideos.length === 0) return [];

  const dedupMap = new Map();
  for (const video of allVideos) {
    if (!dedupMap.has(video.videoId)) dedupMap.set(video.videoId, video);
  }

  const deduped = Array.from(dedupMap.values());

  await supabaseRest("videos", {
    method: "POST",
    query: { on_conflict: "videoId" },
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: deduped,
  });

  return deduped;
}

export async function saveVideoThumbnail(file) {
  if (!file || typeof file === "string") return file || "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", "video-thumbnails");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);

  return `/uploads/video-thumbnails/${filename}`;
}
