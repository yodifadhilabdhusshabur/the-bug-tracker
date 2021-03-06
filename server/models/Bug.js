const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const bugSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		fixer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			default: null
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		status: { type: Number, default: 0 }
		// 0 is buggy, 1 is fixed
	},
	{ timestamps: true }
);

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
