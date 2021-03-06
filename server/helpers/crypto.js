const crypto = require('crypto');

const generateRandomId = length => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(length, (err, buffer) => {
			if (err) reject(err.toString());

			const id = buffer.toString('hex');

			resolve(id);
		});
	});
};

module.exports = generateRandomId;
