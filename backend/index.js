const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
const Story = require("./models/Story");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const postRoutes = require("./routes/post");
const storyRoutes = require("./routes/story")
const userRoutes = require("./routes/user");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const uploadPath = path.join(__dirname, "uploads");
app.use("/api/posts", postRoutes);
app.use("/api/story",storyRoutes);
app.use("/api/users", userRoutes);
// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


// ✅ Use BACKEND_URL environment variable
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";


// 👉 Add this line to check the MongoDB connection string
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/instagram", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connected to MongoDB"))
.catch((err) => console.error(" MongoDB connection error:", err.message));

// Add this temporary route for debugging
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});



app.post("/api/users/update-profile-pic", async (req, res) => {
  const { userId, profileUrl } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { profileUrl });
    res.status(200).json({ message: "Profile picture updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});
// already present in your code

app.post("/api/users/create-dummy", async (req, res) => {
  try {
    const newUser = new User({
      username: "harshsingh",
      profileUrl: ""
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Dummy user created", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Multer setup for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });
// Multer setup for story uploads
const storystorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storyPath = path.join(__dirname, "uploads/stories");
    if (!fs.existsSync(storyPath)) {
      fs.mkdirSync(storyPath);
    }
    cb(null, "uploads/stories/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const storyupload = multer({ storage: storystorage });

// Multer setup for profile picture upload
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const profilePath = path.join(__dirname, "uploads/profiles");
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


// Upload Story
app.post("/api/stories/upload", storyupload.single("story"), async (req, res) => {
  try {
    const { userId, username, profileUrl } = req.body;
    const story = new Story({
      userId,
      username,
      profileUrl,
      storyUrl: `/uploads/stories/${req.file.filename}`,
    });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Fetch all stories (24 hour valid)
app.get("/api/stories", async (req, res) => {

  try {
    const stories = await Story.find();
    const filtered = stories.filter(story => {
      const now = new Date();
      return now - story.createdAt < 24 * 60 * 60 * 1000;
    });
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



// ➤ Update profile URL (text-based)
app.put("/api/users/:id/profile", profileUpload.single("profilePic"), async (req, res) => {
  const userId = req.params.id;

  // Check if multer uploaded file
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Generate profile URL correctly

  const profileUrl = `${BACKEND_URL}/uploads/profiles/${req.file.filename}`; // ✅ corrected

  try {
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});



// Upload post
app.post("/api/posts/upload", upload.single("image"), async (req, res) => {
  const { caption, userId } = req.body;
  if (!req.file || !userId) return res.status(400).json({ error: "Image and userId are required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`; // ✅ corrected

    const newPost = new Post({
      username: user.username,
      userId,
      caption,
      imageUrl,
      profileUrl: user.profileUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post uploaded", post: savedPost });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Failed to upload post" });
  }
});

// ➤ Upload post with image
/*
app.post("/api/posts/upload", upload.single("image"), async (req, res) => {
  const { username, profileUrl, caption, userId } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({ error: "Image and userId are required" });
  }

  //const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const profileUrl = `${BACKEND_URL}/uploads/profiles/${req.file.filename}`; // ✅ corrected
  try {
    const newPost = new Post({
      username,
      profileUrl,
      caption,
      userId,
      imageUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post uploaded", post: savedPost });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload post" });
  }
});
*/
 
// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // newest first
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/posts/upload", upload.single("image"), async (req, res) => {
  const { caption, userId } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({ error: "Image and userId are required" });
  }

  try {
    // ✅ Fetch user's current profile pic
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const newPost = new Post({
      username: user.username,
      userId,
      caption,
      imageUrl,
      profileUrl: user.profileUrl, // ✅ Store snapshot of current profile pic
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post uploaded", post: savedPost });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Failed to upload post" });
  }
});

// DELETE a post by ID
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
app.patch("/api/posts/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.body.userId;

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: "Like updated", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Error updating like", error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send(" Instagram Clone Backend is running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));