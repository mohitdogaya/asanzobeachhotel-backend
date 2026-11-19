import { DataTypes } from "sequelize";

export default function defineFaq(sequelize) {
  return sequelize.define("Faq", {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    question: { type: DataTypes.STRING(500), allowNull: false },
    answer: { type: DataTypes.TEXT("long"), allowNull: false },
    sort_order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    is_published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: "faqs", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
}
