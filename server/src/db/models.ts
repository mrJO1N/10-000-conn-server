import { DataTypes } from "sequelize";
import sequelize from "./conn.js";

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, isInt: true },
  },
});

export const models = {
  User,
};
