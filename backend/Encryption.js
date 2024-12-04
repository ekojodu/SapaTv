const crypto = require('crypto');

const algorithm = 'aes-128-cbc'; // Use AES-128 with CBC mode
const encryptionKey = Buffer.from('SapaTvLimited240', 'utf8'); // 16-byte key
const ivLength = 16; // AES-CBC requires a 16-byte IV

function encrypt(plainText) {
	const encryptionKey = Buffer.from('SapaTvLimited240', 'utf8');
	const iv = Buffer.alloc(16, 0); // 16 bytes of zeros
	const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
	const encrypted = Buffer.concat([
		cipher.update(plainText, 'utf8'),
		cipher.final(),
	]);
	return Buffer.concat([iv, encrypted]).toString('base64'); // Combine IV and ciphertext
}

function decrypt(cipherText) {
	const encryptionKey = Buffer.from('SapaTvLimited240', 'utf8');
	const iv = Buffer.alloc(16, 0); // Fixed all-zero IV, as used in C#
	const encryptedData = Buffer.from(cipherText, 'base64'); // Decode base64-encoded ciphertext

	const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
	const decrypted = Buffer.concat([
		decipher.update(encryptedData),
		decipher.final(),
	]);
	return decrypted.toString('utf8');
}

// Example
try {
	const plaintext = 'Hello, Sapa TV!';
	console.log('Original:', plaintext);

	const encryptedText = encrypt(plaintext);
	console.log('Encrypted:', encryptedText);
	let l = 'Nju/Ua7aX9EOOlkl+7xDtJvFDqmKKjJdThr1G1Lc+ZM=';
	const decryptedText = decrypt('j/L0h6Mh42efNaKh5Rhrukof6njvYSb51gxZUptPgBY=');
	console.log('Decrypted:', decryptedText);
} catch (error) {
	console.error('Error:', error.message);
}

module.exports = {
	encrypt,
	decrypt,
};
