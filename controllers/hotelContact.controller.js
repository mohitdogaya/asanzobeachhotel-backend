import { models } from "../models/index.js";
import { sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

const editableFields = ["phone_number", "email", "address", "social_links"];

function parseSocialLinks(value) {
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value)
    .filter(([key, url]) => /^[a-z0-9_-]{2,30}$/i.test(key) && typeof url === "string")
    .map(([key, url]) => [key, url.trim()]));
}

export async function getHotelContactDetails(_req, res) {
  const details = await models.HotelContact.findByPk(1);
  return sendSuccess(res, details ? toPlain(details) : {
    id: 1, phone_number: "", email: "", address: "", social_links: {},
  });
}

export async function updateHotelContactDetails(req, res) {
  const current = await models.HotelContact.findByPk(1);
  const values = Object.fromEntries(Object.entries(req.body).filter(([key]) => editableFields.includes(key)));
  if (!Object.keys(values).length) return sendError(res, "No contact detail fields provided");
  for (const key of ["phone_number", "email", "address"]) {
    if (key in values) values[key] = String(values[key] || "").trim();
  }
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) return sendError(res, "Enter a valid email address");
  if ("social_links" in values) {
    const links = parseSocialLinks(values.social_links);
    if (!links) return sendError(res, "Social links must be a valid key/value object");
    for (const url of Object.values(links)) {
      if (!url) continue;
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) return sendError(res, "Social links must use http or https URLs");
      } catch {
        return sendError(res, "Enter a valid social media URL");
      }
    }
    values.social_links = links;
  }
  if (current) await current.update(values);
  else await models.HotelContact.create({ id: 1, ...values });
  return getHotelContactDetails(req, res);
}
