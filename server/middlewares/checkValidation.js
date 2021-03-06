const {validationResult} = require('express-validator');
const sendError = require('../helpers/sendError');

module.exports = checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    console.log('errors >>>> ', errors);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        console.log('errorMessage', errorMessage);
        return sendError(errorMessage, 422);
    }

    next();
};
