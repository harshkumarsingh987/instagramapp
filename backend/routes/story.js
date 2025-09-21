 const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Story = require("../models/Story"); // ✅ Make sure path is correct

// Upload new story
router.post("/upload", async (req, res) => {
  const { userId, username, profileUrl, storyUrl } = req.body;

  if (!userId || !storyUrl) {
    return res.status(400).json({ error: "userId and storyUrl are required" });
  }

  try {
    const newStory = new Story({
      userId,
      username,
      profileUrl,
      storyUrl,
    });

    await newStory.save();
    res.status(201).json({ message: "Story uploaded successfully", story: newStory });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch stories (only last 24 hours)
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find();

    const validStories = stories.filter((story) => {
      const now = new Date();
      return now - story.createdAt < 24 * 60 * 60 * 1000;
    });

    res.status(200).json(validStories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete story (optional feature)
router.delete("/:id", async (req, res) => {
  const storyId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return res.status(400).json({ error: "Invalid ObjectId format" });
  }

  try {
    const deleted = await Story.findByIdAndDelete(storyId);
    if (!deleted) return res.status(404).json({ error: "Story not found" });

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
