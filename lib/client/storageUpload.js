import { compressImage } from "./compressImage";

// Uploads a file to Supabase Storage through a one-time signed URL issued by
// our backend (staff only). The public anon key has no upload rights.
export async function uploadFileToSupabaseStorage(inputFile, { bucket, folder = "uploads" }) {
  if (!inputFile) {
    throw new Error("No file provided for upload");
  }

  // Images are resized/compressed (never cropped); PDFs and other files pass through.
  const file = await compressImage(inputFile);

  // The auth client adds the staff login token to this request.
  const signRes = await fetch("/api/storage/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, folder, fileName: file.name || "file" }),
  });

  const signed = await signRes.json().catch(() => null);
  if (!signRes.ok || !signed?.uploadUrl) {
    throw new Error(signed?.message || `Could not start upload (${signRes.status})`);
  }

  const res = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${text}`);
  }

  return signed.publicUrl;
}
