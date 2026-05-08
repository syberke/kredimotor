// src/lib/cloudinary.ts

interface CloudinaryConfig {
  cloudName: string;
  unsignedPreset?: string;
}

const config: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  unsignedPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

/**
 * Normalize URL dokumen dari database agar kompatibel dengan Cloudinary preview
 * - Jika sudah URL Cloudinary valid → return langsung
 * - Jika public_id → build URL Cloudinary
 * - Jika URL eksternal lain → return langsung
 * - Jika kosong/null → return null
 */
export function getDocumentPreviewUrl(filePath: string | null | undefined): string | null {
  if (!filePath || filePath.trim() === "" || filePath === "null") return null;

  // Sudah URL lengkap (http/https)
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    // Jika sudah URL Cloudinary, pastikan format preview yang aman
    if (filePath.includes("res.cloudinary.com")) {
      // Pastikan pakai format /image/upload atau /raw/upload
      if (!filePath.includes("/upload/")) {
        // Inject /upload/ jika belum ada
        const parts = filePath.split("/");
        const insertIndex = parts.findIndex(p => p === config.cloudName);
        if (insertIndex !== -1) {
          parts.splice(insertIndex + 1, 0, "upload");
          return parts.join("/");
        }
      }
      return filePath;
    }
    // URL eksternal lain (Google Drive, dll)
    return filePath;
  }

  // Jika hanya public_id (misal: "documents/ktp_123.jpg")
  if (config.cloudName) {
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filePath);
    const resourceType = isImage ? "image" : "raw";
    return `https://res.cloudinary.com/${config.cloudName}/${resourceType}/upload/${filePath}`;
  }

  return null;
}

/**
 * Generate thumbnail URL untuk preview cepat (khusus image)
 */
export function getDocumentThumbnailUrl(filePath: string | null | undefined, width = 200, height = 200): string | null {
  const originalUrl = getDocumentPreviewUrl(filePath);
  if (!originalUrl || !originalUrl.includes("res.cloudinary.com")) return null;

  // Hanya untuk image
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(originalUrl)) return originalUrl;

  // Inject transformation: resize, crop, quality
  return originalUrl.replace(
    /\/upload\//,
    `/upload/f_auto,q_auto,w_${width},h_${height},c_fit/`
  );
}

/**
 * Cek apakah file adalah image yang bisa di-preview inline
 */
export function isPreviewableImage(filePath: string | null | undefined): boolean {
  if (!filePath) return false;
  const url = getDocumentPreviewUrl(filePath);
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}