 // routes/posts.js
 const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // make sure path is correct

// Like toggle route
router.post("/:id/like", async (req, res) => {
 const postId = req.params.id;
  const userId = req.body.userId;
 if (!postId || postId === "undefined") {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  // Use Mongoose ObjectId only if it's a valid 24-char hex string
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid ObjectId format" });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error("Error in like toggle:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
