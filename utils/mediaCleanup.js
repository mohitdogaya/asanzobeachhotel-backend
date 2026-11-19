import { unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { models } from "../models/index.js";
import { parseArray } from "./media.js";

const uploadDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");

function getUploadFilename(value, req, enforceLocalHost = false) {
  if (typeof value !== "string" || !value.trim()) return null;
  let parsed;
  try {
    parsed = new URL(value, `${req.protocol}://${req.get("host")}`);
  } catch {
    return null;
  }

  if (enforceLocalHost) {
    const allowedHosts = new Set([req.get("host")]);
    if (process.env.API_PUBLIC_URL) {
      try { allowedHosts.add(new URL(process.env.API_PUBLIC_URL).host); } catch { /* invalid config: ignore */ }
    }
    if (!allowedHosts.has(parsed.host)) return null;
  }

  let pathname;
  try { pathname = decodeURIComponent(parsed.pathname); } catch { return null; }
  const match = pathname.match(/^\/uploads\/([^/\\]+)$/);
  if (!match || match[1] === "." || match[1] === "..") return null;
  return path.basename(match[1]) === match[1] ? match[1] : null;
}

export async function removeUnreferencedUploadedImages(req, imageUrls) {
  const candidates = new Set(imageUrls.map((url) => getUploadFilename(url, req, true)).filter(Boolean));
  if (!candidates.size) return;

  const [rooms, posts, galleryImages] = await Promise.all([
    models.Room.findAll({ attributes: ["images"] }),
    models.BlogPost.findAll({ attributes: ["images"] }),
    models.GalleryImage.findAll({ attributes: ["image"] }),
  ]);

  for (const room of rooms) for (const image of parseArray(room.images)) candidates.delete(getUploadFilename(image, req));
  for (const post of posts) for (const image of parseArray(post.images)) candidates.delete(getUploadFilename(image, req));
  for (const image of galleryImages) candidates.delete(getUploadFilename(image.image, req));

  await Promise.all([...candidates].map(async (filename) => {
    const filePath = path.resolve(uploadDirectory, filename);
    if (path.dirname(filePath) !== uploadDirectory) return;
    try { await unlink(filePath); } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }));
}

export async function removeUnreferencedUploadedFile(filename) {
  const safeFilename = path.basename(filename || "");
  if (!safeFilename || safeFilename !== filename) return;
  const filePath = path.resolve(uploadDirectory, safeFilename);
  if (path.dirname(filePath) !== uploadDirectory) return;
  try { await unlink(filePath); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function discardUploadedFiles(files = []) {
  await Promise.all(files.map((file) => removeUnreferencedUploadedFile(file.filename)));
}
