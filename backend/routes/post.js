// routes/posts.js
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // ✅ ensure correct path

// ✅ Get all posts (required by frontend)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ✅ Like toggle route
router.post("/:id/like", async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;

  if (!postId || postId === "undefined") {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid ObjectId format" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

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
// DELETE post
// ---------------------------
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Add comment to a post
router.post("/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const { userId, username, text } = req.body;

  // 1️⃣ Validate postId and userId
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(400).json({ error: "Invalid post ID" });

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ error: "Invalid user ID" });

  // 2️⃣ Validate required fields
  if (!username || !text)
    return res.status(400).json({ error: "Username and text are required" });

  try {
    // 3️⃣ Find the post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // 4️⃣ Create comment with ObjectId
    const comment = {
      userId: mongoose.Types.ObjectId(userId), // ✅ convert string to ObjectId
      username,
      text,
      createdAt: new Date(),
    };

    // 5️⃣ Push comment into post.comments array
    post.comments.push(comment);

    // 6️⃣ Save post
    await post.save();

    // 7️⃣ Respond with updated comments
    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

