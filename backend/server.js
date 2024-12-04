const { Sequelize } = require('sequelize');
const express = require('express');
const { decrypt } = require('./Encryption');

const app = express();
const PORT = 3000;
// Create a new Sequelize instance
const sequelize = new Sequelize(
	'db_aaafd7_saparprd',
	'db_aaafd7_saparprd_admin',
	'Sapa@Tv2024',
	{
		host: 'SQL8005.site4now.net',
		dialect: 'mssql',
		dialectOptions: {
			options: {
				encrypt: true, // Enables encryption
				trustServerCertificate: true, // Trust the server's SSL certificate
			},
		},
	}
);

// Test the connection
sequelize
	.authenticate()
	.then(() => console.log('Connection established successfully.'))
	.catch((error) => console.error('Unable to connect to the database:', error));

// Define a simple route
app.get('/', (req, res) => {
	res.send('Hello, World! Welcome to your Express server.');
});

// Start the server
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });

// Function to fetch all table names
const getAllTables = async () => {
	try {
		// Authenticate Sequelize connection
		// await sequelize.authenticate();

		// Query to get all tables for SQL Server
		const query = `
      SELECT EncryptedSubscriptionCode 
FROM Codes 
WHERE isRedeemed = 0;
    `;

		// Execute the query
		const [codes] = await sequelize.query(query);
		let decryptedCodes = codes.map((code) => {
			const decryptedCode = decrypt(code.EncryptedSubscriptionCode); // Use the EncryptedSubscriptionCode from the database
			console.log('Decrypted Code:', decryptedCode);
			return decryptedCode; // Return the decrypted code if needed
		});

		console.log(decryptedCodes);
		// Log the table names
		// console.log('codes in the Codes:', codes);
	} catch (error) {
		console.error('Error fetching tables:', error);
	} finally {
		// Close the connection
		await sequelize.close();
	}
};

// Run the function
getAllTables();
