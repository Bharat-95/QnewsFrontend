import fs from "fs/promises";
import path from "path";

async function saveUpload(file, folder, fallbackExt) {
  if (!file || typeof file === "string") return file || "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name?.split(".").pop() || fallbackExt).toLowerCase();
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function savePaperFile(file) {
  return saveUpload(file, "papers", "pdf");
}

export async function savePaperThumbnail(file) {
  return saveUpload(file, "paper-thumbnails", "jpg");
}
