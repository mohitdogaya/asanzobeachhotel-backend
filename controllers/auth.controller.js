import { authenticateAdmin } from "../services/auth.service.js";
import { sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

export async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return sendError(res, "Email and password are required");

  const adminSession = await authenticateAdmin(email, password);
  if (!adminSession) return sendError(res, "Invalid email or password", 401);
  return sendSuccess(res, adminSession, "Sign-in successful");
}

export async function getCurrentAdmin(req, res) {
  const admin = await models.Admin.findByPk(req.admin.id, {
    attributes: ["id", "name", "email"],
  });
  return admin
    ? sendSuccess(res, toPlain(admin))
    : sendError(res, "Administrator not found", 404);
}
