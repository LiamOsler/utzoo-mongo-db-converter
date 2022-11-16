const mongoose = require("mongoose")

const schema = mongoose.Schema({
	path: String,
	header: String,
	body: String,
	date: Date
})

module.exports = mongoose.model("Post", schema)