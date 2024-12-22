"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const blog = sequelize.define(
	"blogs",
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
		blogImageUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notNull: {
					msg: "body cannot be null",
				},
				notEmpty: {
					msg: "body cannot be empty",
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
		modelName: "blogs",
	},
);

module.exports = blog; 
