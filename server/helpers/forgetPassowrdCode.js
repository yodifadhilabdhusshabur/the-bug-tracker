function generateRandomCode(digits) {
	let code = '';
	for (let i = 1; i <= digits; i++) {
		const randomDigit = Math.round(Math.random() * 9);
		code += randomDigit;
	}

	return Number(code);
}

module.exports = generateRandomCode;
