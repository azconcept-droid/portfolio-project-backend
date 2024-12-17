
require("dotenv").config({ path: `${process.cwd()}/.env` });

const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DB_URL) {
	sequelize = new Sequelize(process.env.DB_URL);
} else {
	sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USERNAME,
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			dialect: process.env.DB_DIALECT,
			logging: false,
		},
	);
}
module.exports = sequelize;
