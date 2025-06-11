 const express = require("express");
const router = express.Router();
const User = require("../models/User");

// PUT /api/users/:userId/profile
router.put("/:userId/profile", async (req, res) => {
  const { userId } = req.params;
  const { profileUrl } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileUrl },
      { new: true } // Return updated user
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
