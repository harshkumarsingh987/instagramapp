import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import './App.css';
import InstaLogin from "./login";
import Signup from "./Signup";
import Header from "./Header";
import Stories from "./Stories";
import Sidebar from "./Sidebar";
import { Box, Container, Grid, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import Post from "./Post";
import Footer from "./Footer";
import axios from "axios";
import PostUploader from "./PostUploader";

function StaticPost({ username, imageUrl, caption }) {
  return <Post username={username} imageUrl={imageUrl} caption={caption} />;
}

function Home({ user }) {
  const location = useLocation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true); 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (location.state?.showPopup) {
      setShowSnackbar(true);
    }
  }, [location]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Dummy posts fallback
        const dummyData = [
          { _id: "1", username: "dummy_user1", profileUrl: "https://i.pravatar.cc/150?img=1", imageUrl: "https://picsum.photos/seed/insta1/500/400", caption: "Dummy caption 1", likes: [] },
          { _id: "2", username: "dummy_user2", profileUrl: "https://i.pravatar.cc/150?img=2", imageUrl: "https://picsum.photos/seed/insta2/500/400", caption: "Dummy caption 2", likes: [] },
          { _id: "3", username: "dummy_user3", profileUrl: "https://i.pravatar.cc/150?img=3", imageUrl: "https://picsum.photos/seed/insta3/500/400", caption: "Hello from the dummy world!", likes: [] }
        ];
        setPosts(dummyData);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          🎉 Congratulations! You are logged in!
        </Alert>
      </Snackbar>

      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={8}>
            <Stories />
            <PostUploader user={user} onNewPost={(newPost) => setPosts((prev) => [newPost, ...prev])} />
            <Typography variant="subtitle2" sx={{ textAlign: "left", ml: 2, mt: 1 }}>
              Showing {posts.length} posts
            </Typography>

            {loadingPosts ? (
              <Box textAlign="center" mt={5}>
                <CircularProgress />
              </Box>
            ) : (
              posts.map((post) => (
                <Post
                  key={post._id}
                  _id={post._id}
                  username={post.username}
                  profileUrl={post.profileUrl}
                  imageUrl={post.imageUrl}
                  caption={post.caption}
                  user={user}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </Grid>

          <Grid item md={4} display={{ xs: "none", md: "block" }}>
            <Sidebar />
          </Grid>
        </Grid>
      </Container>

      <Footer user={user} />
    </Box>
  );
}

function App() {
  // User state comes from cookie (set after login/signup)
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <InstaLogin onLogin={setUser} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup onSignup={setUser} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

