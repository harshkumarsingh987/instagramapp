// routes/user.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

// ✅ Multer storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const profilePath = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(profilePath)) {
      fs.mkdirSync(profilePath, { recursive: true });
    }
    cb(null, profilePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const profileUpload = multer({ storage: profileStorage });

/**
 * @route PUT /api/users/:id/profile
 * @desc Update user profile picture
 */
router.put("/:id/profile", profileUpload.single("profilePic"), async (req, res) => {
  const userId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Check if file uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Create full URL for the profile picture
  const profileUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * @route GET /api/users
 * @desc Fetch all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
