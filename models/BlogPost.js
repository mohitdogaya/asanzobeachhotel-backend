import { DataTypes } from "sequelize";

export default function defineBlogPost(sequelize) {
  return sequelize.define("BlogPost", {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    post_headline: { type: DataTypes.STRING(255), allowNull: false },
    post_text: { type: DataTypes.TEXT("long"), allowNull: false },
    post_type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "public" },
    address: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  }, { tableName: "blog_posts", timestamps: true, createdAt: "created_at", updatedAt: "updated_at", indexes: [{ type: "FULLTEXT", fields: ["post_headline", "post_text", "address"] }] });
}
