const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		from: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		content: { type: String, required: true },
		notificationType: String, // projectCreation or memberManipulating
		to: {
			// if type is memberManipulating
			type: Schema.Types.ObjectId,
			default: null,
			ref: 'User'
		},
		project: { type: Schema.Types.ObjectId, default: null, ref: 'Project' } // if type is projectCreation
	},
	{ timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
