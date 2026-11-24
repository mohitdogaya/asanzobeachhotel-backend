export const getPublicBaseUrl = (req) => {
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = forwardedHost || req.get("host");
  const baseUrl = process.env.API_PUBLIC_URL || `${protocol}://${host}`;
  return baseUrl.replace(/\/$/, "");
};

export const getPublicMediaUrl = (req, filename) => {
  const baseUrl = getPublicBaseUrl(req);
  return `${baseUrl}/uploads/${filename}`;
};

export const normalizePublicMediaUrl = (req, mediaUrl) => {
  if (typeof mediaUrl !== "string" || !mediaUrl) return mediaUrl;
  try {
    const parsedUrl = new URL(mediaUrl);
    if (!/^localhost$|^127\.0\.0\.1$/.test(parsedUrl.hostname) || !parsedUrl.pathname.startsWith("/uploads/")) {
      return mediaUrl;
    }
    return `${getPublicBaseUrl(req)}${parsedUrl.pathname}${parsedUrl.search}`;
  } catch {
    return mediaUrl;
  }
};

export const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
};

export const toBoolean = (value) => value === true || value === 1 || value === "1" || value === "true";
