module.exports = function(minutes) {
	const minute = 60000; // 1m = 60k ms

	const expiryDate = Date.now() + minutes * minute;

	return expiryDate;
};
