import sequelize from "../connection";
import { DataTypes } from "sequelize";

const Contact = sequelize.define(
  "contact",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    linkedId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    linkPrecedence: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    collate: "utf8mb4_general_ci",
    timestamps: true,
    tableName: "contact",
  }
);

export default Contact;
