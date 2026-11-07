// Browser-side image compression used before every upload to Supabase Storage.
//
// Guarantees, so images look identical in the website and the mobile app:
// - Never crops or splits: the whole picture is scaled down proportionally
//   (same aspect ratio), only if it is wider than MAX_WIDTH. Never upscaled.
// - Phone photos keep their correct orientation (the browser applies the
//   EXIF rotation when decoding, and the pixels are saved already rotated).
// - Output is a standard JPEG, which every Android/iOS version can display.
// - Transparent PNGs get a white background instead of turning black.
// - If compression would not make the file smaller, the original is kept.

const MAX_WIDTH = 1280;
const TARGET_BYTES = 200 * 1024;
const START_QUALITY = 0.8;
const MIN_QUALITY = 0.6;
const SKIP_BELOW_BYTES = 150 * 1024;

// Formats we leave untouched (animation / vector would be lost).
const PASSTHROUGH_TYPES = new Set(["image/gif", "image/svg+xml"]);

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    img.src = url;
  });
}

function canvasToJpeg(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function jpegName(originalName = "image") {
  const base = originalName.replace(/\.[^.]+$/, "") || "image";
  return `${base}.jpg`;
}

export async function compressImage(file) {
  if (typeof window === "undefined" || !file) return file;
  if (!file.type?.startsWith("image/") || PASSTHROUGH_TYPES.has(file.type)) return file;

  try {
    const img = await loadImage(file);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) return file;

    // Already small and not oversized: nothing to gain.
    if (file.size <= SKIP_BELOW_BYTES && width <= MAX_WIDTH) return file;

    const scale = Math.min(1, MAX_WIDTH / width);
    const outWidth = Math.round(width * scale);
    const outHeight = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outWidth, outHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, outWidth, outHeight);

    let quality = START_QUALITY;
    let blob = await canvasToJpeg(canvas, quality);
    while (blob && blob.size > TARGET_BYTES && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 0.05);
      blob = await canvasToJpeg(canvas, quality);
    }

    if (!blob || blob.size >= file.size) return file;

    return new File([blob], jpegName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    // Never block an upload because compression failed.
    return file;
  }
}
