"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const otp = sequelize.define(
  "otps",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    modelName: "otps",
  },
);

otp.addHook("beforeCreate", (otp, options) => {
  otp.createdAt = new Date();
});

module.exports = otp;
