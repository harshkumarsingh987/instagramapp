const mongoose = require("mongoose");

// Comment subdocument schema
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // use string instead of ObjectId
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
  { _id: false } // optional: prevent MongoDB from creating _id for each comment
);

// Post schema
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // use string instead of ObjectId
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: [String], // array of user string IDs
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

