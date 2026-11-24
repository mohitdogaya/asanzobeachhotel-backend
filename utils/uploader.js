import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const uploadDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });
export const uploadMaxBytes = Number(process.env.UPLOAD_MAX_BYTES || 8 * 1024 * 1024);
export const uploadMaxMegabytes = Math.ceil(uploadMaxBytes / (1024 * 1024));
const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: uploadMaxBytes, files: 10 },
  fileFilter: (_req, file, callback) => {
    if (supportedImageTypes.has(file.mimetype)) return callback(null, true);
    return callback(Object.assign(new Error("Unsupported file type. Choose a JPG, PNG, WebP, or GIF image."), { status: 400 }));
  },
});
