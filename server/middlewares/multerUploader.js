const multer = require('multer');
const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const generateRandomId = require('../helpers/crypto');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${rootDir}/images`);
	},
	filename: async (req, file, cb) => {
		const id = await generateRandomId(10);
		cb(null, `${id}-${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb('File type is not supported.', false);
	}
};

module.exports = multer({ storage: fileStorage, fileFilter: fileFilter });
