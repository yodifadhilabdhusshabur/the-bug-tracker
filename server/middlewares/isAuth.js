const jwt = require('jsonwebtoken'),
	User = require('../models/User'),
	sendError = require('../helpers/sendError');

const isAuth = (req, res, next) => {
	try {
		const secret = `${process.env.TOKEN_SECRET}`;

		const authHeader = req.get('Authorization');

		if (!authHeader) sendError('User is not authenticated', 401);

		const token = authHeader.split(' ')[1];

		if (!token) sendError('Token was not passed', 401);

		const decodedToken = jwt.decode(token, secret);

		if (!decodedToken) sendError('Token is fake', 401);

		if (Date.now() > decodedToken.exp * 1000) sendError('Token is expired', 401);

		req.userId = decodedToken.userId;

		next();
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		throw error; // this function is sync(not async) then we handle the error by throwing it normally (not with next(error) and the errorHandler will catch this error
	}
};

module.exports = isAuth;
