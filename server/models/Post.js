const mongoose = require("mongoose")

const schema = mongoose.Schema({
	filePath: String,
	content : String,
	header: String,
	body: String,
	postDate: String,
	date: Date,
	relayVersion: String,
	path: String,
	from: String,
	newsgroups: String,
	subject: String,
	keywords: String,
	replyTo: String,
	messageId: String,
	sender : String,
	articleId: String,
	control: String,
	organization: String,
	lines: String,

})

module.exports = mongoose.model("Post", schema)