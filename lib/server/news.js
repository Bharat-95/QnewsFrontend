import { getSupabaseConfig, supabaseRest, supabaseStorageDeleteObject, supabaseStorageUpload } from "./supabase";

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

function parseSupabaseStorageUrl(fileUrl) {
  if (!fileUrl) return null;

  try {
    const parsed = new URL(fileUrl);
    const { url: supabaseUrl } = getSupabaseConfig();
    if (!supabaseUrl) return null;

    const marker = "/storage/v1/object/public/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;

    // Ensure this URL belongs to current Supabase project.
    if (!fileUrl.startsWith(supabaseUrl)) return null;

    const remainder = parsed.pathname.slice(idx + marker.length);
    const [bucket, ...pathParts] = remainder.split("/");
    if (!bucket || pathParts.length === 0) return null;

    const objectPath = decodeURIComponent(pathParts.join("/"));
    return { bucket, objectPath };
  } catch {
    return null;
  }
}

export async function deleteNewsImageByUrl(fileUrl) {
  const parsed = parseSupabaseStorageUrl(fileUrl);
  if (!parsed) return false;

  await supabaseStorageDeleteObject(parsed);
  return true;
}
