import { DataTypes } from "sequelize";

export default function defineGalleryImage(sequelize) {
  return sequelize.define("GalleryImage", {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    image: { type: DataTypes.STRING(1000), allowNull: false },
  }, { tableName: "gallery_images", timestamps: true, updatedAt: false, createdAt: "created_at" });
}
