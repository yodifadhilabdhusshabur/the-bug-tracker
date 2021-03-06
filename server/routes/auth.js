const express = require('express'),
	authApis = require('../Apis/auth'),
	router = express.Router(),
	checkValidation = require('../middlewares/checkValidation');

const { body, validationResult } = require('express-validator');

router.post(
	'/signup',
	[
		body('email', 'Email is not a valid email').isEmail(),
		body('firstName', 'FirstName is required').notEmpty(),
		body('lastName', 'LastName is required').notEmpty(),
		body('password', 'Password must be 9 characters at least').isLength({ min: 9 })
	],
	checkValidation,
	authApis.signUp
);

router.post('/signIn', authApis.signIn);

router.post('/forgetPassword', authApis.forgetPassword);

router.post('/receivePasswordRecoveryCode', authApis.receivePasswordRecoveryCode);

router.post(
	'/changePassword',
	[ body('firstPassword').isLength({ min: 9 }).withMessage('Password should be 9 characters at least') ],
	checkValidation,
	authApis.changePassword
);

module.exports = router;
