import { Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import { 
  models, 
  registerModels 
} from "../models/index.js";

export const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || "",
    process.env.MYSQL_USER || "",
    process.env.MYSQL_PASSWORD || "",
    {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT || 3306),
        dialect: "mysql",
        logging: false,
        pool: {
            max: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        ...(process.env.MYSQL_SSL === "true"
            ? { dialectOptions: { ssl: { rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== "false" } } }
            : {}),
    },
);

export async function initializeDatabase() {
    const missing = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"].filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing required MySQL settings: ${missing.join(", ")}`);
  if (process.env.MYSQL_HOST.trim() === process.env.MYSQL_DATABASE.trim()) {
    throw new Error("MYSQL_HOST must be the MySQL server hostname, not the database name. Copy the host from Hostinger hPanel → Remote MySQL.");
  }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes("replace-with")) {
        throw new Error("Set JWT_SECRET to a random value of at least 32 characters");
    }
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD to create the first hotel administrator");
    }

    registerModels(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();
  const queryInterface = sequelize.getQueryInterface();
  const adminColumns = await queryInterface.describeTable("admins");
  for (const column of ["otp_hash", "otp_expires_at"]) {
    if (adminColumns[column]) await queryInterface.removeColumn("admins", column);
  }
    const existingTables = await queryInterface.showAllTables();
    const retiredTables = ["cms_content", "contact_messages"];
    for (const tableName of retiredTables) {
        const existingTable = existingTables.find((table) => String(typeof table === "string" ? table : table.tableName).toLowerCase() === tableName);
        if (existingTable) await queryInterface.dropTable(tableName);
    }
  await models.HotelContact.findOrCreate({ where: { id: 1 }, defaults: {} });
  console.log("Hostinger MySQL connected and hotel models synchronized");
}

export async function seedAdmin() {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Asanzo Admin" } = process.env;
    const email = ADMIN_EMAIL.toLowerCase();
    const existingAdmin = await models.Admin.findOne({ where: { email } });
    if (existingAdmin) return;
    const admin = await models.Admin.create({ name: ADMIN_NAME, email, password_hash: await bcrypt.hash(ADMIN_PASSWORD, 12) });
    console.log(`Initial admin account created for ${admin.email}`);
}
