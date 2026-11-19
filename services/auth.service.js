import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { models } from "../models/index.js";

export async function authenticateAdmin(email, password) {
  const admin = await models.Admin.findOne({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return null;

  return {
    token: jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "12h" },
    ),
    id: admin.id,
    name: admin.name,
    email: admin.email,
  };
}
