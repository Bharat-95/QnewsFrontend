import { supabaseStorageUpload } from "@/lib/server/supabase";

async function saveUpload(file, folder, fallbackExt, bucket) {
  if (!file || typeof file === "string") return file || "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name?.split(".").pop() || fallbackExt).toLowerCase();
  const filename = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  return supabaseStorageUpload({
    bucket,
    objectPath: filename,
    body: buffer,
    contentType: file.type || "application/octet-stream",
  });
}

export async function savePaperFile(file) {
  return saveUpload(file, "papers", "pdf", process.env.SUPABASE_BUCKET_PAPERS || "papers");
}

export async function savePaperThumbnail(file) {
  return saveUpload(
    file,
    "paper-thumbnails",
    "jpg",
    process.env.SUPABASE_BUCKET_PAPER_THUMBNAILS || "paper-thumbnails"
  );
}
