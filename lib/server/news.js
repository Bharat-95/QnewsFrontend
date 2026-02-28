import { supabaseRest, supabaseStorageUpload } from "./supabase";

export function toSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function buildComment({ userEmail, firstName, lastName, comment }) {
  return {
    commentId: crypto.randomUUID(),
    userEmail,
    firstName,
    lastName,
    comment,
    likes: 0,
    likedBy: [],
    replies: [],
    createdAt: new Date().toISOString(),
  };
}

export function buildReply({ userEmail, firstName, lastName, reply }) {
  return {
    replyId: crypto.randomUUID(),
    userEmail,
    firstName,
    lastName,
    reply,
    createdAt: new Date().toISOString(),
  };
}

export async function saveNewsImage(file) {
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const filename = `news-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const bucket = process.env.SUPABASE_BUCKET_NEWS_IMAGES || "news-images";
  return supabaseStorageUpload({
    bucket,
    objectPath: filename,
    body: buffer,
    contentType: file.type || "image/jpeg",
  });
}

export async function updateNewsById(newsId, patch) {
  const rows = await supabaseRest("news", {
    method: "PATCH",
    query: {
      newsId: `eq.${newsId}`,
      select: "*",
    },
    body: patch,
    headers: {
      Prefer: "return=representation",
    },
  });

  return Array.isArray(rows) ? rows[0] : null;
}
