const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const ShoppingCartItem = sequelize.define(
  "ShoppingCartItem",
  {
    cart_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    added_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "shopping_cart_items", timestamps: false }
);

module.exports = ShoppingCartItem;
