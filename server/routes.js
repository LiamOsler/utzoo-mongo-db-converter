const express = require("express")
const Post = require("./models/Post") // new
const router = express.Router()

// Get all posts
router.get("/posts", async (req, res) => {
	const posts = await Post.find()
	res.send(posts)
})

// Delete all posts
router.post("/posts", async (req, res) => {
	const post = new Post({
		filePath: req.body.user.path,
		content : req.body.user.content,
		header: req.body.user.header,
		body: req.body.user.body,
		date: req.body.user.date,
		postDate: req.body.user.postDate,
		relayVersion: req.body.user.relayVersion,
		path: req.body.user.path,
		from: req.body.user.from,
		newsgroups: req.body.user.newsgroups,
		subject: req.body.user.subject,
		keywords: req.body.user.keywords,
		replyTo: req.body.user.replyTo,
		messageId: req.body.user.messageId,
		sender : req.body.user.sender,
		articleId: req.body.user.articleId,
		control: req.body.user.control,
		organization: req.body.user.organization,
		lines: req.body.user.lines
	})
	await post.save()
	res.json(req.body)
})

module.exports = router