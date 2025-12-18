const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Product = sequelize.define(
  "Product",
  {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_name: { type: DataTypes.STRING(150), allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    manufacturing_date: { type: DataTypes.DATEONLY },
  },
  { tableName: "products", timestamps: false }
);

module.exports = Product;
