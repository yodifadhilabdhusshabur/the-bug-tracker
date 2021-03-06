const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const timeLineSchema = new Schema({
	from: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	content: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	bug: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Bug'
	}
});

const TimeLine = mongoose.model('Timeline', timeLineSchema);

module.exports = TimeLine;
