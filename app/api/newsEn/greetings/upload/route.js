import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") || formData.get("media") || formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "greetings");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/greetings/${filename}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || "Upload failed" }, { status: 500 });
  }
}
