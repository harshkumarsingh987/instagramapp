
// ---------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");

// Models & Routes
const Post = require("./models/Post");
const User = require("./models/User");
const Story = require("./models/Story");
const postRoutes = require("./routes/post");
const storyRoutes = require("./routes/story");
const userRoutes = require("./routes/user");

// ---------------------------
// CONFIGURATION
// ---------------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
BACKEND_URL = https://instagram-backend.onrender.com



// ---------------------------
// MIDDLEWARES
// ---------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://instagramapp-eclq.vercel.app"
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Ensure upload directories exist
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ---------------------------
// DATABASE CONNECTION
// ---------------------------
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/instagram", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err.message));

// ---------------------------
// ROUTES
// ---------------------------

// Register / Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password, mobile, dob } = req.body;

    if (!email || !password || !mobile || !dob) {
      return res.status(400).json({ error: "Email and password required" });
    }
  if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid 10-digit mobile number." });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: username || email.split("@")[0],
      email,
      password: hashedPassword,
       mobile,
      dob,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set cookie (optional but useful)
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,     // ✅ MUST be false on localhost
  sameSite: "lax",   // ✅ use "lax" for local dev
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
;

    res.status(201).json({
      message: "Signup successful",
      token,
        user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        dob: newUser.dob,
        profileUrl: newUser.profileUrl,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set cookie
  res.cookie("token", token, {
  httpOnly: true,
  secure: false,     // ✅ MUST be false on localhost
  sameSite: "lax",   // ✅ correct for local dev
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// MULTER CONFIGURATION
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storyPath = path.join(__dirname, "uploads/stories");
    if (!fs.existsSync(storyPath)) fs.mkdirSync(storyPath, { recursive: true });
    cb(null, storyPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const storyUpload = multer({ storage: storyStorage });

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const profilePath = path.join(__dirname, "uploads/profiles");
    if (!fs.existsSync(profilePath)) fs.mkdirSync(profilePath, { recursive: true });
    cb(null, profilePath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const profileUpload = multer({ storage: profileStorage });

// ---------------------------
// POSTS & STORIES
// ---------------------------
app.use("/api/posts", postRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/users", userRoutes);

// Upload story
app.post("/api/story/upload", storyUpload.single("story"), async (req, res) => {
  try {
    const { userId, username, profileUrl } = req.body;
    const story = new Story({
      userId,
      username,
      profileUrl,
      storyUrl: `${BACKEND_URL}/uploads/stories/${req.file.filename}`,
    });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    console.error("Story upload failed:", err);
    res.status(500).send("Server error");
  }
});

// Upload post
app.post("/api/posts/upload", upload.single("image"), async (req, res) => {
  try {
    const { caption, userId, email } = req.body;
    if (!req.file || !userId)
      return res.status(400).json({ error: "Image and userId required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`;

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

// ---------------------------
// TEST ROUTE
// ---------------------------
app.get("/", (req, res) => {
  res.send(" Instagram Clone Backend is running!");
});

// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
