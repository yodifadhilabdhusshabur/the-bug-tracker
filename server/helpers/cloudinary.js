const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

exports.cloudinaryUploader = (file, folder) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(file, { folder: folder, type: 'upload' }, (err, result) => {
			if (err) reject('File have not been uploaded');

			resolve(result);
		});
	});
};

exports.cloudinaryRemoval = publicId => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(`bugTracker/${publicId}`, {}, (err, result) => {
			if (err) reject('file haven`t been removed from cloudinary');
			resolve(result);
		});
	});
};
