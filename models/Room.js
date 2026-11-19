import { DataTypes } from "sequelize";

export default function defineRoom(sequelize) {
  return sequelize.define("Room", {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
    availability: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  }, { tableName: "rooms", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
}
