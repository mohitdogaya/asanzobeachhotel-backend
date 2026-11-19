import { DataTypes } from "sequelize";

export default function defineHotelContact(sequelize) {
  return sequelize.define("HotelContact", {
    id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, defaultValue: 1 },
    phone_number: { type: DataTypes.STRING(40), allowNull: false, defaultValue: "" },
    email: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },
    address: { type: DataTypes.STRING(1000), allowNull: false, defaultValue: "" },
    social_links: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  }, { tableName: "hotel_contact_details", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
}
