const sendError = (message, statusCode) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	throw error;
};
// this func throw error, then there is no need for return SendError, just sendError and it will return immediately from the func
module.exports = sendError;
