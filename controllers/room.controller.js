import { models } from "../models/index.js";
import { getPublicMediaUrl, normalizePublicMediaUrl, parseArray, toBoolean } from "../utils/media.js";
import { discardUploadedFiles, removeUnreferencedUploadedImages } from "../utils/mediaCleanup.js";
import { getPagination, paginationMeta, sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

export async function getRooms(req, res) {
  const { page, limit, offset } = getPagination(req.query);
  const result = await models.Room.findAndCountAll({ order: [["created_at", "DESC"]], limit, offset });
  return sendSuccess(res, result.rows.map((room) => serializeRoom(req, room)), "Rooms loaded", 200, {
    pagination: paginationMeta(page, limit, result.count),
  });
}

export async function createRoom(req, res) {
  const { name, description = "", amenities = [], price = 0, capacity = 1, availability = true } = req.body;
  if (!String(name || "").trim() || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
    await discardUploadedFiles(req.files);
    return sendError(res, "Room name, valid price, and capacity are required");
  }
  const imageUrls = parseArray(req.body.images);
  const uploadedImages = (req.files || []).map((file) => getPublicMediaUrl(req, file.filename));
  let room;
  try {
    room = await models.Room.create({
      name: name.trim(), description, amenities: parseArray(amenities), price: Number(price),
      capacity: Number(capacity), availability: toBoolean(availability), images: [...imageUrls, ...uploadedImages],
    });
  } catch (error) {
    await discardUploadedFiles(req.files);
    throw error;
  }
  return sendSuccess(res, toPlain(room), "Room created", 201);
}

export async function getRoomById(req, res) {
  const room = await models.Room.findByPk(req.params.id);
  return room ? sendSuccess(res, serializeRoom(req, room)) : sendError(res, "Room not found", 404);
}

export async function updateRoom(req, res) {
  const allowedFields = ["name", "description", "amenities", "price", "capacity", "availability", "images"];
  const values = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
  if (!Object.keys(values).length && !req.files?.length) return sendError(res, "No room fields provided");
  if ("name" in values && !String(values.name).trim()) {
    await discardUploadedFiles(req.files);
    return sendError(res, "Room name cannot be empty");
  }
  if ("price" in values && (!Number.isFinite(Number(values.price)) || Number(values.price) < 0)) {
    await discardUploadedFiles(req.files);
    return sendError(res, "Room price must be zero or more");
  }
  if ("capacity" in values && (!Number.isInteger(Number(values.capacity)) || Number(values.capacity) < 1)) {
    await discardUploadedFiles(req.files);
    return sendError(res, "Room capacity must be at least one guest");
  }
  if ("price" in values) values.price = Number(values.price);
  if ("capacity" in values) values.capacity = Number(values.capacity);
  if ("name" in values) values.name = String(values.name).trim();
  for (const key of ["amenities", "images"]) if (key in values) values[key] = parseArray(values[key]);
  if ("availability" in values) values.availability = toBoolean(values.availability);
  const uploadedImages = (req.files || []).map((file) => getPublicMediaUrl(req, file.filename));
  const room = await models.Room.findByPk(req.params.id);
  if (!room) {
    await discardUploadedFiles(req.files);
    return sendError(res, "Room not found", 404);
  }
  if (uploadedImages.length) {
    const currentImages = "images" in values
      ? values.images
      : parseArray(room.images);
    values.images = [...parseArray(currentImages), ...uploadedImages];
  }
  const previousImages = parseArray(room.images);
  try {
    await room.update(values);
  } catch (error) {
    await discardUploadedFiles(req.files);
    throw error;
  }
  const currentImages = parseArray(room.images);
  const removedImages = previousImages.filter((image) => !currentImages.includes(image));
  await removeUnreferencedUploadedImages(req, removedImages);
  return sendSuccess(res, null, "Room updated");
}

export async function deleteRoom(req, res) {
  const room = await models.Room.findByPk(req.params.id);
  if (!room) return sendError(res, "Room not found", 404);
  const images = parseArray(room.images);
  await room.destroy();
  await removeUnreferencedUploadedImages(req, images);
  return sendSuccess(res, null, "Room deleted");
}

export async function getPublicRooms(req, res) {
  const rooms = await models.Room.findAll({
    where: { availability: true }, order: [["created_at", "DESC"]],
  });
  return sendSuccess(res, rooms.map((room) => serializeRoom(req, room)));
}

function serializeRoom(req, room) {
  const plainRoom = toPlain(room);
  return {
    ...plainRoom,
    images: parseArray(plainRoom.images).map((image) => normalizePublicMediaUrl(req, image)),
  };
}
