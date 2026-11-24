import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sequelize, initializeDatabase, seedAdmin } from "./config/db.js";
import hotelRoutes from "./routes/hotel.routes.js";
import { seedHotelContent } from "./config/seedHotelContent.js";
import { uploadMaxMegabytes } from "./utils/uploader.js";

const app = express();
const dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins?.length || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use("/uploads", express.static(path.join(dirname, "uploads"), { maxAge: "7d", immutable: true }));
app.get("/health", (_req, res) => res.json({ ok: true, service: "asanzo-beach-hotel-api" }));
app.use("/api", hotelRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      status: false,
      message: `Image is too large. The maximum file size is ${uploadMaxMegabytes} MB. Choose a smaller JPG, PNG, WebP, or GIF image.`,
    });
  }
  if (error.code?.startsWith("LIMIT_")) {
    return res.status(400).json({ status: false, message: error.message });
  }
  const status = error.status || 500;
  return res.status(status).json({ status: false, message: status === 500 ? "Internal server error" : error.message });
});

const port = Number(process.env.PORT || 4000);
try {
  await initializeDatabase();
  await seedAdmin();
  await seedHotelContent();
  const server = app.listen(port, () => console.log(`Asanzo Beach Hotel API listening on port ${port}`));
  const shutdown = async () => {
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} catch (error) {
  console.error("Unable to start hotel API:", error.message);
  process.exit(1);
}
