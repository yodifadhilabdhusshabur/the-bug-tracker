const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	jwt = require('jsonwebtoken'),
	sendError = require('../helpers/sendError'),
	bcrypt = require('bcryptjs'),
	crypto = require('crypto'),
	generateRandomId = require('../helpers/crypto'),
	cloudinary = require('../helpers/cloudinary'),
	fs = require('fs'),
	generateRandomCode = require('../helpers/forgetPassowrdCode'),
	expiryDate = require('../helpers/expiryDate'),
	nodemailer = require('nodemailer'),
	sendGridTransport = require('nodemailer-sendgrid-transport');

const nodemailerTransporter = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: process.env.SENDGRID_KEY
		}
	})
);

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			lowercase: true
		},
		lastName: {
			type: String,
			required: true,
			lowercase: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		privateKey: {
			type: String,
			required: true
		},
		image: {
			// will be object
			type: Schema.Types.Mixed,
			default: null
		},
		notifications: [
			{
				from: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true
				},
				content: String,
				date: {
					type: Date,
					required: true
				},
				seen: {
					type: Schema.Types.Boolean,
					default: false
				}
			}
		],
		passwordRecoveryToken: {
			type: Schema.Types.Mixed,
			default: null
		}
	},
	{ timestamps: true }
);

class UserClass {
	static publicProps() {
		return [ 'firstName', 'lastName', 'image' ];
	}

	static async signUp({ firstName, lastName, email, password }) {
		const user = await this.findOne({ email }).lean();

		if (user) sendError('This email is taken', 403);

		const hashedPassord = await bcrypt.hash(password, 12);

		const privateKey = await generateRandomId(18);

		await this.welcomeMail({ email, firstName, lastName });

		return this.create({ firstName, lastName, email, password: hashedPassord, privateKey });
	}

	static async signIn({ email, password }) {
		const user = await this.findOne({ email: email })
			.lean()
			.select(this.publicProps().join(' ') + ' password email');

		if (!user) sendError('Email is not found', 404);

		const verefiedPassword = await bcrypt.compare(password, user.password);

		if (!verefiedPassword) sendError('Invalid Password', 403);

		const token = jwt.sign(
			{ firstName: user.firstName, lastName: user.lastName, email: user.email, userId: user._id },
			`${process.env.TOKEN_SECRET}`,
			{
				expiresIn: '3d'
			}
		);

		return token;
	}

	static welcomeMail({ email, firstName, lastName }) {
		// this function will return a promise
		return nodemailerTransporter.sendMail({
			to: email,
			from: 'mustafaemailing21@gmail.com',
			subject: 'Welcome To THE_BUG_TRACKER',
			html: `
					<h1>THE_BUG_TRACKER platform is happy to have you as one of its users.</h1>
					
					<h2><em>This platform is totally free, you can start use it if you want for tracking your applications so you can become more productive.</em></h2>
					

					<h3>Nice for you to hear also that this platform is open source on my github account</h3>

					<h3>Dear ${firstName} ${lastName}, hope you are safe and sound. This is a direct message from the platform author 'Mustafa Mahmoud' via a dedicated mailing gmail. if you liked the platform please star/follow me on github <a href = 'https://github.com/Mustafa-Mahmoud-5'>Github</a> repo and i will be happy if we connected on <a href = 'https://www.linkedin.com/in/mustafa-mahmoud-a80a221b4/'>Linkedin</a> as well.</h3>
			`
		});
	}

	static async editPersonalData(userId, file, { firstName, lastName, oldImagePublicKey }) {
		const user = await User.findById(userId);

		if (file) {
			if (user.image) {
				// the user has an image, remove the old one from cloudinary
				if (!oldImagePublicKey) {
					fs.unlink(file.path, err => console.log(err)); // remove the image that multer uploaded

					sendError('The user have selected a new file and you didn`t pass the oldImagePublicKey!', 403);
				}

				const result = await cloudinary.cloudinaryRemoval(oldImagePublicKey);
			}

			const filePath = file.path.replace('\\', '/');

			const { secure_url, public_id } = await cloudinary.cloudinaryUploader(filePath, 'bugTracker');

			const publicId = public_id.split('/')[1];

			const imgObj = { url: secure_url, publicId: publicId };

			user.image = imgObj;
		}

		user.firstName = firstName;
		user.lastName = lastName;

		return user.save();
	}

	static async newNotification(toId, fromId, content) {
		const notificationObject = { from: fromId, content, date: new Date() };

		await this.updateOne({ _id: toId }, { $addToSet: { notifications: notificationObject } });
	}

	static async seeNotifications(userId) {
		const user = await this.findById(userId);

		if (!user) sendError('User is not found', 404);

		user.notifications.forEach(notification => (notification.seen = true));

		return user.save();
	}

	// FORGET PASSWORD METHODS

	// This is not a static function... i will depend on getting the user object first
	static passwordRecoveryMail(code, email) {
		return nodemailerTransporter.sendMail({
			from: 'mustafaemailing21@gmail.com',
			to: email,
			subject: 'The_Bug_Tracker Forget Password',
			html: `
				<h1>Your Password recovery code is ${code}</h1>
				
				<h3>This code is available only for 10 minutes</h3>
			`
		});
	}

	// this method will create a code that able to retrieve the user`s password later
	static async forgetPasswordCodeCreation({ email }) {
		const user = await this.findOne({ email });

		if (!user) sendError('User with given email is not found', 404);

		const code = generateRandomCode(6);

		const exp = expiryDate(5); // the token will be availabe for only 5min

		crypto.randomBytes(32, async (err, buffer) => {
			if (err) return sendError('Something Went Wrong, please try again', 500);

			const slug = buffer.toString('hex');

			const token = { code, exp, slug };

			user.passwordRecoveryToken = token;

			await Promise.all([ this.passwordRecoveryMail(code, email), user.save() ]);
		});
	}

	static async passwordCodeSubmition({ email, code }) {
		const user = await this.findOne({ email });

		if (!user) sendError('User is not found', 404);

		const passwordRecoveryToken = user.passwordRecoveryToken; // {exp, slug, code}

		if (!passwordRecoveryToken) sendError('User have not reported for password recovery', 401);

		if (passwordRecoveryToken.exp <= Date.now()) {
			sendError('Your recovery code is expired, regenerate a new one', 401);
		}

		if (Number(passwordRecoveryToken.code) !== Number(code)) sendError('Invalid Code', 401);

		return passwordRecoveryToken.slug; // return the slug so the client navigate to it(the slug is unique and hashed for security reasons)
	}

	static async changePassword({ firstPassword, secondPassword, slug }) {
		const user = await this.findOne({ 'passwordRecoveryToken.slug': slug });

		if (!user) sendError('User not found', 404);

		if (firstPassword !== secondPassword) sendError('Passwords are not matched', 422);

		const hashedPassord = await bcrypt.hash(firstPassword, 12);

		user.password = hashedPassord;

		user.passwordRecoveryToken = null;

		return user.save();
	}
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
