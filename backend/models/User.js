 const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  profileUrl: { type: String, default: "" }, // 🔥 Key field
});

module.exports = mongoose.model("User", userSchema);
