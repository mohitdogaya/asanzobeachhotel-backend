import { DataTypes } from "sequelize";

export default function defineAdmin(sequelize) {
  return sequelize.define("Admin", {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
  }, { tableName: "admins", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
}
