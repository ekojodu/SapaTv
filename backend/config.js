require('dotenv').config(); // Load environment variables
const express = require('express');
const { Sequelize, DataTypes, DATE, Transaction } = require('sequelize');
const { decrypt } = require('./Encryption'); // Decrypting function
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const winston = require('winston'); // Optional: For advanced logging
const cors = require('cors');
const helmet = require('helmet'); // Helmet for enhanced security
const axios = require('axios'); // CSRF protection
const sanitize = require('sanitize')(); // Input sanitization
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware for enhanced security
app.use(helmet()); // Use Helmet for security headers

app.use(
	cors({
		origin: 'https://sapa-tv.vercel.app', // Replace with your frontend URL
		methods: ['GET', 'POST'], // Specify allowed methods
		credentials: true, // If your requests include cookies or authentication headers
	})
);
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Create a reusable email transporter
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

// Set up logging with Winston (Optional, can be removed if not needed)
const logger = winston.createLogger({
	level: 'info',
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
	],
});

// Create a new Sequelize instance
const sequelize = new Sequelize(
	process.env.DB_NAME, // Database name
	process.env.DB_USER, // Username
	process.env.DB_PASSWORD, // Password
	{
		host: process.env.DB_HOST, // Hostname (e.g., localhost or an IP address)
		dialect: process.env.DB_DIALECT, // Database dialect
		dialectOptions: {
			options: {
				encrypt: true, // Use encryption for secure connections
				trustServerCertificate: true, // Trust self-signed certificates
			},
		},
		logging: false, // Disable logging for cleaner output (optional)
	}
);

// Define the Transactions model (table name is `Transactions`)
const Transactions = sequelize.define(
	'Transactions',
	{
		TransactionId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		CustomerEmail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		TransactionType: {
			type: DataTypes.STRING,
			defaultValue: 'Payment',
			allowNull: false,
		},
		Reference: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		TransactionStatus: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0, // Default to 0, which represents 'pending'
			validate: {
				isIn: {
					args: [[0, 1, 2]], // Ensure the value is one of 0, 1, or 2
					msg: 'TransactionStatus must be either 0 (pending), 1 (completed), or 2 (failed)',
				},
			},
		},

		TransactionDate: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
			allowNull: false,
		},
		PlanId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		CustomerName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		TrxId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			defaultValue: 0, // Ensure default value is 0 (if that's what you want)
			validate: {
				notNull: {
					msg: 'TrxId cannot be null',
				},
				isInt: {
					msg: 'TrxId must be an integer',
				},
			},
		},
		FlutterReference: {
			type: DataTypes.STRING,
			allowNull: true, // Allow null value initially
			validate: {
				is: {
					args: /^[a-zA-Z0-9-_]+$/, // Optional: Regex to allow alphanumeric with optional dashes/underscores
					msg: 'FlutterwaveReference must be a valid string',
				},
			},
		},
		PaymentUrl: {
			type: DataTypes.STRING,
			allowNull: true, // Allow null value initially
			validate: {
				isUrl: {
					args: true,
					msg: 'PaymentUrl must be a valid string',
				},
			},
		},
	},
	{
		timestamps: false, // Disable automatic timestamps since we define `TransactionDate`
	}
);

const Plans = sequelize.define(
	'Plans',
	{
		PlanId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		PlanName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		DurationInDays: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		IsArchived: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		ImageUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: false, // Only if you don’t use `createdAt` or `updatedAt`
		tableName: 'Plans', // Ensure it matches your DB table name
	}
);

const Codes = sequelize.define(
	'Codes',
	{
		CodeId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		EncryptedSubscriptionCode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		IsRedeemed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		CreatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		ExpiresAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		PlanId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // Only if you don’t use `createdAt` or `updatedAt`
		tableName: 'Codes', // Ensure it matches your DB table name
	}
);

// Query Logic

// Test the connection
sequelize
	.authenticate()
	.then(() => console.log('Connection established successfully.'))
	.catch((error) => {
		logger.error('Unable to connect to the database:', error);
		process.exit(1); // Terminate the process if DB connection fails
	});
const paymentConfirmationLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15-minute window
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: true, // Disable the `X-RateLimit-*` headers
});

// async function fetchPlanDetails(planId) {
// 	try {
// 		const planDetails = await Plans.findOne({
// 			where: { PlanId: planId },
// 			attributes: [
// 				'PlanId',
// 				'PlanName',
// 				'Amount',
// 				'DurationInDays',
// 				'IsArchived',
// 				'ImageUrl',
// 			],
// 		});

// 		if (!planDetails) {
// 			console.error('No plan details found for PlanId:', planId);
// 		}

// 		return planDetails;
// 	} catch (error) {
// 		console.error('Error fetching plan details:', error);
// 		throw error;
// 	}
// }
async function fetchAndUpdateCodes(planId, quantity) {
	try {
		// Calculate bonus codes
		const bonusCodes = Math.floor(quantity / 10); // 1 free code for every 10 purchased
		const totalQuantity = quantity + bonusCodes; // Total codes to fetch

		// Fetch the required number of codes
		const codes = await Codes.findAll({
			where: { PlanId: planId, IsRedeemed: false },
			limit: totalQuantity,
		});

		if (codes.length < totalQuantity) {
			throw new Error(
				`Not enough codes available for PlanId ${planId}. Requested: ${totalQuantity}, Available: ${codes.length}`
			);
		}

		// Extract the code IDs
		const codeIds = codes.map((code) => code.CodeId);

		// Mark the codes as redeemed
		await Codes.update({ IsRedeemed: true }, { where: { CodeId: codeIds } });

		// Assuming you have a decryption function
		const decryptedCodes = codes.map((code) =>
			decrypt(code.EncryptedSubscriptionCode)
		);

		return decryptedCodes;
	} catch (error) {
		console.error('Error fetching or updating codes:', error);
		throw error;
	}
}

const sendEmail = async (recipient, subject, content) => {
	const mailOptions = {
		from: process.env.SMTP_USER,
		to: recipient,
		subject,
		text: content,
	};
	await transporter.sendMail(mailOptions);
};
app.post('/api/initiate-payment', async (req, res) => {
	const { name, email, plan, type } = req.body;

	// Step 1: Validate required fields
	if (!name || !email || !plan || !type) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Step 2: Validate type
	if (!['subscribe', 'reseller'].includes(type)) {
		return res.status(400).json({ error: 'Invalid type' });
	}

	// Step 3: Validate plan and plan structure
	if (type === 'subscribe') {
		if (!plan.price || !plan.id) {
			return res
				.status(400)
				.json({ error: 'Missing plan price or id for subscribe' });
		}
	} else if (type === 'reseller') {
		if (!plan.plans || !Array.isArray(plan.plans) || plan.plans.length === 0) {
			return res.status(400).json({ error: 'Invalid plans for reseller' });
		}
		for (let singlePlan of plan.plans) {
			if (!singlePlan.price || !singlePlan.quantity || !singlePlan.id) {
				return res
					.status(400)
					.json({ error: 'Missing price, quantity, or id for reseller plan' });
			}
		}
	}

	try {
		// Generate a unique transaction reference
		const generateReference = () => {
			const characters =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let reference = '';
			for (let i = 0; i < 10; i++) {
				reference += characters.charAt(
					Math.floor(Math.random() * characters.length)
				);
			}
			return reference;
		};

		const reference = generateReference();
		const date = new Date(); // Current date

		// Prepare the payload for Flutterwave
		let flutterwavePayload;

		if (type === 'subscribe') {
			await Transactions.create({
				CustomerEmail: email,
				Amount: plan.price,
				TransactionType: 'subscribe',
				Reference: reference,
				TransactionStatus: 0, // Pending
				TransactionDate: date,
				PlanId: plan.id,
				CustomerName: name,
			});

			flutterwavePayload = {
				tx_ref: reference,
				amount: plan.price,
				currency: 'NGN',
				redirect_url: 'https://sapatv.onrender.com/api/confirm-payment',
				customer: { name, email },
			};
		} else if (type === 'reseller') {
			const uniquePlans = Array.from(
				new Set(plan.plans.map(JSON.stringify))
			).map(JSON.parse);

			const transactionRows = uniquePlans.map((singlePlan) => ({
				CustomerEmail: email,
				Amount: singlePlan.price * singlePlan.quantity,
				TransactionType: 'reseller',
				Reference: reference,
				TransactionStatus: 0, // Pending
				TransactionDate: date,
				PlanId: singlePlan.id,
				CustomerName: name,
			}));

			await Transactions.bulkCreate(transactionRows);

			const resellerAmount = plan.plans.reduce((acc, singlePlan) => {
				return acc + singlePlan.price * singlePlan.quantity;
			}, 0);

			flutterwavePayload = {
				tx_ref: reference,
				amount: resellerAmount,
				currency: 'NGN',
				redirect_url: 'https://sapatv.onrender.com/api/confirm-payment',
				customer: { name, email },
			};
		}

		// Make API call to Flutterwave
		const flutterwaveResponse = await fetch(
			'https://api.flutterwave.com/v3/payments',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(flutterwavePayload),
			}
		);

		const paymentData = await flutterwaveResponse.json();

		if (
			flutterwaveResponse.status !== 200 ||
			paymentData.status !== 'success'
		) {
			return res
				.status(500)
				.json({ error: 'Failed to initiate payment', details: paymentData });
		}

		const paymentUrl = paymentData.data.link;
		return res.json({ paymentLink: paymentUrl });
	} catch (error) {
		return res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
});
app.get(
	'/api/confirm-payment',
	paymentConfirmationLimiter,
	async (req, res) => {
		try {
			const { status, tx_ref, transaction_id } = req.query;

			if (status !== 'successful') {
				console.error('Payment not successful:', status);
				return res.status(400).json({ error: 'Payment not successful' });
			}

			// Verify the transaction with Flutterwave
			const verificationResponse = await fetch(
				`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const verificationData = await verificationResponse.json();

			if (
				verificationResponse.status !== 200 ||
				verificationData.status !== 'success'
			) {
				console.error('Failed to verify transaction:', verificationData);
				return res.status(500).json({
					error: 'Failed to verify transaction',
					details: verificationData,
				});
			}

			const { flw_ref, meta, id, customer } = verificationData.data;
			const paymentUrl = meta?.__CheckoutInitAddress;

			console.log('Verification Data:', verificationData);

			const transaction = await Transactions.findOne({
				where: { Reference: tx_ref },
			});

			if (!transaction) {
				console.error('Transaction not found for reference:', tx_ref);
				return res.status(404).json({ error: 'Transaction not found' });
			}

			await Transactions.update(
				{
					TrxId: id,
					TransactionStatus:
						verificationData.data.status === 'successful' ? 1 : 0,
					FlutterReference: flw_ref,
					PaymentUrl: paymentUrl,
				},
				{ where: { Reference: tx_ref } }
			);

			const customerEmail = customer.email;
			const customerName = customer.name;

			const plan =
				transaction.TransactionType === 'subscribe'
					? {
							type: 'subscribe',
							plans: [{ id: transaction.PlanId }],
					  }
					: {
							type: 'reseller',
							plans: await (async () => {
								try {
									console.log('Finding all transactions with tx_ref:', tx_ref);

									const transactions = await Transactions.findAll({
										where: { Reference: tx_ref },
									});

									console.log('Transactions found:', transactions);

									return Promise.all(
										transactions.map(async (trx) => {
											if (!trx.PlanId || trx.amount === undefined) {
												console.error(
													'Missing PlanId or Amount for transaction:',
													trx.TransactionId
												);
												throw new Error(
													`Plan or Amount details not found for transaction: ${trx.TransactionId}`
												);
											}

											// Fetch Plan details
											const planDetails = await Plans.findOne({
												where: { id: trx.PlanId },
											});

											if (!planDetails) {
												console.error('Plan not found for PlanId:', trx.PlanId);
												throw new Error(
													`Plan not found for PlanId: ${trx.PlanId}`
												);
											}

											// Reseller price calculation
											const resellerPrice = planDetails.Amount - 200;

											if (resellerPrice <= 0) {
												throw new Error(
													`Invalid reseller price calculated: ${resellerPrice}`
												);
											}

											console.log(
												`Calculating quantity for transaction ${trx.TransactionId}: Amount (${trx.amount}) / Reseller Price (${resellerPrice})`
											);

											return {
												id: trx.PlanId,
												quantity: Math.floor(trx.amount / resellerPrice),
											};
										})
									);
								} catch (error) {
									console.error('Error in findAll query:', error);
									throw error;
								}
							})(),
					  };

			console.log('Plan Data:', plan);

			if (plan.type === 'reseller') {
				let emailContent = `Thank you for your purchase. Below are the details of your subscription:\n\n`;
				for (const planItem of plan.plans) {
					const planDetails = await Plans.findOne({
						where: { id: planItem.id },
					});

					if (!planDetails) {
						console.error('Plan not found:', planItem.id);
						return res
							.status(404)
							.json({ error: `Plan ${planItem.id} not found` });
					}

					const decryptedCodes = await fetchAndUpdateCodes(
						planItem.id,
						planItem.quantity
					);

					console.log('Decrypted Codes:', decryptedCodes);

					emailContent += `${customerName} - ${planDetails.PlanName} (${planDetails.Amount}):\n`;
					decryptedCodes.forEach((code) => {
						emailContent += `Code: ${code}\n`;
					});
				}
				await sendEmail(customerEmail, 'Your Subscription Codes', emailContent);
			} else if (plan.type === 'subscribe') {
				const planDetails = await Plans.findOne({
					where: { id: plan.plans[0].id },
				});
				if (!planDetails) {
					console.error('Plan not found:', plan.plans[0].id);
					return res
						.status(404)
						.json({ error: `Plan ${plan.plans[0].id} not found` });
				}
				const decryptedCode = (
					await fetchAndUpdateCodes(plan.plans[0].id, 1)
				)[0];
				const emailContent = `Thank you for your subscription. Below are your subscription details:\n\n${customerName} - ${planDetails.PlanName} (${planDetails.Amount}): ${decryptedCode}`;
				await sendEmail(customerEmail, 'Your Subscription Code', emailContent);
			} else {
				return res.status(400).json({ error: 'Invalid payment type' });
			}

			const transactionData = {
				reference: tx_ref,
				status: verificationData.data.status,
				amount: transaction.amount,
				customerName: customer.name,
				transactionId: id,
				customerCreatedAt: customer.created_at,
			};

			const encodedData = Buffer.from(JSON.stringify(transactionData)).toString(
				'base64'
			);

			const baseUrl = 'https://sapatv.vercel.app/payment-summary';

			const shortUrl = `${baseUrl}?data=${encodeURIComponent(encodedData)}`;

			console.log('Redirecting to:', shortUrl);

			return res.redirect(shortUrl);
		} catch (error) {
			console.error('Internal server error:', error.message, error.stack);
			return res.status(500).json({
				error: 'Internal server error',
				details: error.message,
			});
		}
	}
);

// Start the server
app.listen(PORT, () => {
	// console.log(`Server is running on http://localhost:${PORT}`);
});
