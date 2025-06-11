 const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default: "", // optional: default to blank
    },
    caption: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },

    // ✅ Store likes as array of user IDs (for toggle, count, user-specific)
    likes: {
      type: [String], // array of userId
      default: [],
    },

    // ✅ Store comments as subdocuments with user info
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
