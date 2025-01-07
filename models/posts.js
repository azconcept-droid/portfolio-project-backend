"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const post = sequelize.define(
  "posts",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    search_vector: {
      type: "TSVECTOR",
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
			type: DataTypes.ENUM("available", "processing", "rented"),
			allowNull: false,
			defaultValue: "available",
			validate: {
				notNull: {
					msg: "Status cannot be null",
				},
				notEmpty: {
					msg: "Status cannot be empty",
				},
				isIn: {
					args: [["available", "processing", "rented"]],
					msg: "Availability status must be one of: 'available', 'rented', 'processing'",
				},
			},
		},
    videoUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title cannot be null",
        },
        notEmpty: {
          msg: "title cannot be empty",
        },
      },
    },
    postImageUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    property: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description cannot be null",
        },
        notEmpty: {
          msg: "description cannot be empty",
        },
      },
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description cannot be null",
        },
        notEmpty: {
          msg: "description cannot be empty",
        },
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description cannot be null",
        },
        notEmpty: {
          msg: "description cannot be empty",
        },
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description cannot be null",
        },
        notEmpty: {
          msg: "description cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description cannot be null",
        },
        notEmpty: {
          msg: "description cannot be empty",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "posts",
  },
);

module.exports = post;
