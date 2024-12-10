const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import your Sequelize instance

const Transaction = sequelize.define(
	'Transaction',
	{
		transactionId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		customerEmail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		transactionType: {
			type: DataTypes.STRING,
			defaultValue: 'Payment',
			allowNull: false,
		},
		reference: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		transactionDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
		planId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		customerName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		flutterwaveReference: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false, // Disable automatic timestamps
	}
);

module.exports = Transaction;
