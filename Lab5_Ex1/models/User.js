const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    registration_date: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING(120), unique: true },
  },
  { tableName: "users", timestamps: false }
);

module.exports = User;
