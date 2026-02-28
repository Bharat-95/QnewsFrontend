export async function uploadFileToSupabaseStorage(file, { bucket, folder = "uploads" }) {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const safeName = (file.name || "file")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();

  const objectPath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "x-upsert": "true",
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${text}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}
