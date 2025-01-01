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
			allowNull: true,
		},
    property: {
			type: DataTypes.STRING,
			allowNull: true,
		},
    price: {
			type: DataTypes.STRING,
			allowNull: true,
    },
    city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
    state: {
			type: DataTypes.STRING,
			allowNull: true,
		},
    country: {
			type: DataTypes.STRING,
			allowNull: true,
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
