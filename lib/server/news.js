import fs from "fs/promises";
import path from "path";
import { supabaseRest } from "./supabase";

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
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", "news-images");
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/news-images/${filename}`;
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
