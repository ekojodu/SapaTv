require('dotenv').config(); // Load environment variables
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { decrypt } = require('./Encryption'); // Decrypting function
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const winston = require('winston'); // Optional: For advanced logging
const cors = require('cors');
const helmet = require('helmet'); // Helmet for enhanced security
const csurf = require('csurf'); // CSRF protection
const sanitize = require('sanitize')(); // Input sanitization
const rateLimit = require('express-rate-limit');
const allowedOrigins = [
	process.env.FRONTEND_URL || 'http://localhost:5173',
	process.env.PROD_FRONTEND_URL, // Set this in your production environment
];
const app = express();

// Middleware for enhanced security
app.use(helmet()); // Use Helmet for security headers
app.use(
	csurf({ cookie: { httpOnly: true, secure: true, sameSite: 'Strict' } })
); // CSRF protection

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: 'GET, POST',
		credentials: true,
	})
);

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

app.use(bodyParser.json());

// Create a new Sequelize instance
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mssql',
		dialectOptions: {
			options: {
				encrypt: true, // Enables encryption
				trustServerCertificate: true, // Trust the server's SSL certificate
			},
		},
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
		Status: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
		FlutterwaveReference: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false, // Disable automatic timestamps since we define `TransactionDate`
	}
);

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
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Endpoint to handle payment confirmation
app.post(
	'/payment-confirmation',
	paymentConfirmationLimiter,
	async (req, res) => {
		try {
			// Sanitize and validate required fields
			const {
				tx_ref,
				customerEmail,
				plans,
				type,
				status,
				amount,
				customerName,
				flutterwave_reference,
			} = req.body;

			if (
				!tx_ref ||
				!customerEmail ||
				!plans ||
				!type ||
				!status ||
				!amount ||
				!customerName ||
				!flutterwave_reference
			) {
				return res.status(400).json({ error: 'Invalid request data' });
			}

			// Verify the payment signature from Flutterwave for additional security
			const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
			const generatedSignature = crypto
				.createHmac('sha256', secretKey)
				.update(tx_ref + status + amount) // Adjust this based on Flutterwave's format
				.digest('hex');

			// Compare the generated signature with Flutterwave's sent signature (for security)
			if (generatedSignature !== req.headers['x-flutterwave-signature']) {
				return res.status(403).json({ error: 'Invalid signature' });
			}

			let emailContent = `Thank you for your purchase. Below are the details of your subscription:\n\n`;
			let purchasedPlans = [];

			// Logic for reseller or subscription
			if (type === 'reseller') {
				const codesToSend = [];
				for (let plan of plans) {
					const planId = sanitize(plan.id);
					const quantity = sanitize(plan.quantity);

					// Fetch the plan details from the database
					const planDetails = await Plan.findOne({ where: { PlanId: planId } });

					if (!planDetails) {
						return res.status(404).json({ error: `Plan ${planId} not found` });
					}

					const query = `
          SELECT TOP ${
						quantity + Math.floor(quantity / 10)
					} EncryptedSubscriptionCode 
          FROM Codes 
          WHERE isRedeemed = 0 AND PlanId = :planId;
        `;
					const [codes] = await sequelize.query(query, {
						replacements: { planId },
					});

					if (!codes || codes.length === 0) {
						return res
							.status(404)
							.json({ error: `No available codes for plan ${planId}` });
					}

					let decryptedCodes = codes
						.slice(0, quantity)
						.map((code) => decrypt(code.EncryptedSubscriptionCode));
					codesToSend.push(...decryptedCodes);

					if (quantity >= 10) {
						const freeCode = decrypt(codes[quantity].EncryptedSubscriptionCode);
						codesToSend.push(freeCode);
					}

					purchasedPlans.push({
						planId,
						planName: planDetails.name,
						planDescription: planDetails.description,
						planPrice: planDetails.price,
						codes: decryptedCodes,
					});

					// Mark the codes as redeemed
					const updateQuery = `
          UPDATE Codes 
          SET isRedeemed = 1 
          WHERE EncryptedSubscriptionCode IN (:codes);
        `;
					await sequelize.query(updateQuery, {
						replacements: {
							codes: codes
								.slice(0, quantity)
								.map((code) => code.EncryptedSubscriptionCode),
						},
					});
				}

				purchasedPlans.forEach((plan) => {
					emailContent += `\n${plan.planName} - ${plan.planDescription} (${plan.planPrice}):\n`;
					plan.codes.forEach((code) => {
						emailContent += `Code: ${code}\n`;
					});
				});

				// Send email for reseller purchase
				const mailOptions = {
					from: process.env.SMTP_USER,
					to: customerEmail,
					subject: 'Your Subscription Codes',
					text: emailContent,
				};

				await transporter.sendMail(mailOptions);
				console.log(`Email sent to ${customerEmail}`);

				// Add to the transaction ledger
				await Transactions.create({
					CustomerEmail: customerEmail,
					Amount: amount,
					TransactionType: 'Payment',
					Reference: tx_ref,
					Status: 1, // Status 1 means completed
					TransactionDate: new Date(),
					PlanId: plans[0].id,
					CustomerName: customerName,
					FlutterwaveReference: flutterwave_reference,
				});

				res.status(200).json({
					message:
						'Payment confirmed, codes sent to customer, and transaction recorded',
					tx_ref,
				});
			} else if (type === 'subscribe') {
				// Handle regular subscription
				const planId = sanitize(plans[0].id);

				// Fetch the plan details from the database
				const planDetails = await Plan.findOne({ where: { PlanId: planId } });

				if (!planDetails) {
					return res.status(404).json({ error: `Plan ${planId} not found` });
				}

				const query = `
        SELECT TOP 1 EncryptedSubscriptionCode 
        FROM Codes 
        WHERE isRedeemed = 0 AND PlanId = :planId;
      `;
				const [codes] = await sequelize.query(query, {
					replacements: { planId },
				});

				if (!codes || codes.length === 0) {
					return res
						.status(404)
						.json({ error: 'No available codes to redeem' });
				}

				const decryptedCode = decrypt(codes[0].EncryptedSubscriptionCode);

				const updateQuery = `
        UPDATE Codes 
        SET isRedeemed = 1 
        WHERE EncryptedSubscriptionCode = :encryptedCode;
      `;
				await sequelize.query(updateQuery, {
					replacements: { encryptedCode: codes[0].EncryptedSubscriptionCode },
				});

				emailContent += `${planDetails.name} - ${planDetails.description} (${planDetails.price}): ${decryptedCode}`;

				// Send email for subscription
				const mailOptions = {
					from: process.env.SMTP_USER,
					to: customerEmail,
					subject: 'Your Subscription Code',
					text: emailContent,
				};

				await transporter.sendMail(mailOptions);
				console.log(`Email sent to ${customerEmail}`);

				// Add to the transaction ledger
				await Transactions.create({
					customerEmail,
					Amount: amount,
					TransactionType: 'Payment',
					Reference: tx_ref,
					Status: 1, // Status 1 means completed
					TransactionDate: new Date(),
					PlanId: planId,
					CustomerName: customerName,
					FlutterwaveReference: flutterwave_reference,
				});

				res.status(200).json({
					message:
						'Payment confirmed, code sent to customer, and transaction recorded',
					tx_ref,
				});
			} else {
				res.status(400).json({ error: 'Invalid payment type' });
			}
		} catch (error) {
			console.error('Error processing payment confirmation:', error);
			logger.error('Error processing payment confirmation:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});