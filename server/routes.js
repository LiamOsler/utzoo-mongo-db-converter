const express = require("express")
const Post = require("./models/Post") // new
const router = express.Router()

// Get all posts
router.get("/posts", async (req, res) => {
	const posts = await Post.find()
	res.send(posts)
})

// Delete all posts
router.get("/delete", async (req, res) => {
	const posts = await Post.deleteMany()
	res.send(posts)
})

router.post("/posts", async (req, res) => {
    console.log(req.body)
	const post = new Post({
		path: req.body.user.path,
		header: req.body.user.header,
		body: req.body.user.body,
		date: req.body.user.date
	})
	await post.save()
	res.json(req.body)
})

module.exports = router