export const getPublicMediaUrl = (req, filename) => {
  const baseUrl = process.env.API_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl.replace(/\/$/, "")}/uploads/${filename}`;
};

export const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
};

export const toBoolean = (value) => value === true || value === 1 || value === "1" || value === "true";
