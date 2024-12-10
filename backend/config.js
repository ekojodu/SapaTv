require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const winston = require('winston'); // Optional: For advanced logging

const sequelize = require('./database'); // Centralized Sequelize instance
const Transaction = require('./Models/Transaction');
const Plan = require('./Models/Plan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: 'GET, POST',
		credentials: true,
	})
);
app.use(bodyParser.json());

// Setup Nodemailer
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

// Logging setup with Winston
const logger = winston.createLogger({
	level: 'info',
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
	],
});

// Verify Flutterwave transaction function
const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY;

const verifyTransaction = async (tx_ref) => {
	const response = await axios.get(
		`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
		{ headers: { Authorization: `Bearer ${flutterwaveKey}` } }
	);
	return response.data;
};

// Test the database connection
sequelize
	.authenticate()
	.then(() => console.log('Database connection established successfully.'))
	.catch((error) => {
		logger.error('Database connection failed:', error);
		process.exit(1); // Terminate if DB connection fails
	});

// Sync models with the database
sequelize
	.sync()
	.then(() => console.log('Models synchronized with the database.'))
	.catch((error) => logger.error('Error synchronizing models:', error));

// Endpoint to handle payment confirmation
app.post('/payment-confirmation', async (req, res) => {
	try {
		const { tx_ref, customerEmail, plans, type, amount, customerName } =
			req.body;

		// Validate required fields
		if (
			!tx_ref ||
			!customerEmail ||
			!plans ||
			!type ||
			!amount ||
			!customerName
		) {
			return res.status(400).json({ error: 'Invalid request data' });
		}

		// Log the transaction as Pending
		const transaction = await Transaction.create({
			customerEmail,
			amount,
			transactionType: 'Payment',
			reference: tx_ref,
			status: 0, // Pending
			transactionDate: new Date(),
			customerName,
			flutterwaveReference: null, // Will be updated after verification
		});

		// Verify payment with Flutterwave
		const verificationResult = await verifyTransaction(tx_ref);

		if (verificationResult.status === 'success') {
			// Update the transaction to Success
			transaction.status = 1; // Successful
			transaction.flutterwaveReference = verificationResult.data.flw_ref; // Add Flutterwave reference
			await transaction.save();

			// Handle reseller case
			if (type === 'reseller') {
				const purchasedPlans = [];
				let emailContent = `Thank you for your purchase. Below are the details of your subscription:\n\n`;

				for (const plan of plans) {
					const planId = plan.id;
					const quantity = plan.quantity;

					const planDetails = await Plan.findOne({ where: { planId } });
					if (!planDetails) {
						return res.status(404).json({ error: `Plan ${planId} not found` });
					}

					// Fetch codes for the plan
					const codesQuery = `
					  SELECT TOP ${quantity} EncryptedSubscriptionCode 
					  FROM Codes 
					  WHERE isRedeemed = 0 AND PlanId = :planId;
					`;

					const [codes] = await sequelize.query(codesQuery, {
						replacements: { planId },
					});

					if (!codes || codes.length === 0) {
						return res
							.status(404)
							.json({ error: `No codes available for plan ${planId}` });
					}

					// Decrypt codes
					const decryptedCodes = codes.map((code) =>
						decrypt(code.EncryptedSubscriptionCode)
					);

					purchasedPlans.push({ planId, codes: decryptedCodes });

					// Mark codes as redeemed
					const updateQuery = `
					  UPDATE Codes 
					  SET isRedeemed = 1 
					  WHERE EncryptedSubscriptionCode IN (:codes);
					`;
					await sequelize.query(updateQuery, {
						replacements: {
							codes: codes.map((code) => code.EncryptedSubscriptionCode),
						},
					});

					// Prepare email content
					emailContent += `${planDetails.name} (${planDetails.price}):\n`;
					decryptedCodes.forEach((code) => {
						emailContent += `Code: ${code}\n`;
					});
				}

				// Send email with subscription codes
				await transporter.sendMail({
					from: process.env.SMTP_USER,
					to: customerEmail,
					subject: 'Your Subscription Codes',
					text: emailContent,
				});

				return res
					.status(200)
					.json({ message: 'Payment confirmed and codes sent' });
			}

			// Handle subscribe case (single code purchase)
			if (type === 'subscribe') {
				// Fetch a single code for the subscription
				const codesQuery = `
				  SELECT TOP 1 EncryptedSubscriptionCode
				  FROM Codes
				  WHERE isRedeemed = 0
				  AND PlanId = :planId
				`;

				const [codes] = await sequelize.query(codesQuery, {
					replacements: { planId: plans[0].id }, // Assuming the first plan ID is being subscribed to
				});

				if (!codes || codes.length === 0) {
					return res
						.status(404)
						.json({ error: 'No codes available for subscription' });
				}

				// Decrypt the code
				const decryptedCode = decrypt(codes[0].EncryptedSubscriptionCode);

				// Mark the code as redeemed
				const updateQuery = `
				  UPDATE Codes
				  SET isRedeemed = 1
				  WHERE EncryptedSubscriptionCode = :code;
				`;

				await sequelize.query(updateQuery, {
					replacements: { code: codes[0].EncryptedSubscriptionCode },
				});

				// Send email with the subscription code
				const emailContent = `Thank you for subscribing! Below is your subscription code:\n\nCode: ${decryptedCode}`;

				await transporter.sendMail({
					from: process.env.SMTP_USER,
					to: customerEmail,
					subject: 'Your Subscription Code',
					text: emailContent,
				});

				return res
					.status(200)
					.json({ message: 'Payment confirmed and subscription code sent' });
			}
		} else {
			// Update the transaction to Declined
			transaction.status = 2; // Declined
			await transaction.save();

			return res.status(400).json({ error: 'Transaction verification failed' });
		}

		res.status(400).json({ error: 'Invalid payment type' });
	} catch (error) {
		logger.error('Error processing payment confirmation:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
