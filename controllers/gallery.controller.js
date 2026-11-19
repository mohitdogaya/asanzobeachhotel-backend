import { Op } from "sequelize";
import { models } from "../models/index.js";
import { getPublicMediaUrl } from "../utils/media.js";
import { getPagination, paginationMeta, sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

export async function addGalleryImage(req, res) {
  if (!req.file) return sendError(res, "An image file is required");
  const record = await models.GalleryImage.create({ image: getPublicMediaUrl(req, req.file.filename) });
  return sendSuccess(res, toPlain(record), "Gallery image added", 201);
}

export async function getGalleryList(req, res) {
  const { page, limit, offset } = getPagination(req.body);
  const search = `%${String(req.body.search || "").trim()}%`;
  const result = await models.GalleryImage.findAndCountAll({
    where: { image: { [Op.like]: search } },
    order: [["created_at", "DESC"]], limit, offset,
  });
  return sendSuccess(res, result.rows.map(toPlain), "Gallery loaded", 200, {
    pagination: paginationMeta(page, limit, result.count),
  });
}

export async function getGalleryDetails(req, res) {
  const image = await models.GalleryImage.findByPk(req.params.id);
  return image ? sendSuccess(res, toPlain(image)) : sendError(res, "Gallery image not found", 404);
}

export async function updateGalleryImage(req, res) {
  if (!req.file) return sendError(res, "An image file is required");
  const [updated] = await models.GalleryImage.update(
    { image: getPublicMediaUrl(req, req.file.filename) },
    { where: { id: req.params.id } },
  );
  return updated ? sendSuccess(res, null, "Gallery image updated") : sendError(res, "Gallery image not found", 404);
}

export async function deleteGalleryImage(req, res) {
  const deleted = await models.GalleryImage.destroy({ where: { id: req.params.id } });
  return deleted ? sendSuccess(res, null, "Gallery image deleted") : sendError(res, "Gallery image not found", 404);
}

export async function getPublicGallery(_req, res) {
  const images = await models.GalleryImage.findAll({ order: [["created_at", "DESC"]] });
  return sendSuccess(res, images.map(toPlain));
}
