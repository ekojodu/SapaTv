const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import your Sequelize instance

const Plan = sequelize.define(
	'Plan',
	{
		planId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
	},
	{
		timestamps: false, // Disable automatic timestamps
	}
);

module.exports = Plan;
