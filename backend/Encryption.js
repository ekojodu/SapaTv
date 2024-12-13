require('dotenv').config(); // Load environment variables
const crypto = require('crypto');

const algorithm = 'aes-128-cbc'; // Use AES-128 with CBC mode
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // Retrieve key from .env
const ivLength = 16; // AES-CBC requires a 16-byte IV

function encrypt(plainText) {
	const iv = Buffer.alloc(ivLength, 0); // 16 bytes of zeros
	const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
	const encrypted = Buffer.concat([
		cipher.update(plainText, 'utf8'),
		cipher.final(),
	]);
	return Buffer.concat([iv, encrypted]).toString('base64'); // Combine IV and ciphertext
}

function decrypt(cipherText) {
	const iv = Buffer.alloc(ivLength, 0); // Fixed all-zero IV, as used in C#
	const encryptedData = Buffer.from(cipherText, 'base64'); // Decode base64-encoded ciphertext

	const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
	const decrypted = Buffer.concat([
		decipher.update(encryptedData),
		decipher.final(),
	]);
	return decrypted.toString('utf8');
}

module.exports = {
	encrypt,
	decrypt,
};
