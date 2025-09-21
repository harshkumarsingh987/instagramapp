 import React, { useState,useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
 Tooltip, 
 
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete"; // ✅ CORRECT

import axios from "axios"; // ✅ required for backend integration
import { motion as Motion } from "framer-motion";

function Post({ _id, username, profileUrl, imageUrl, caption, onDelete, user, likes = []  }) {
 
  const displayProfile = profileUrl || imageUrl;
 const [liked, setLiked] = useState(false);
const [likeCount, setLikeCount] = useState(likes.length); // likes is the array of userIds
 const [showHeart, setShowHeart] = useState(false); 
 //  const [liked, setLiked] = useState(likes?.includes(user?.uid));
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

useEffect(() => {
  if (likes.includes(user?.uid)) {
    setLiked(true);
  }
}, [likes, user]);

const handleLikeToggle = async () => {
    if (!user?.uid || !_id) return;
        // Animation trigger
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);

  try {
    setLiked(!liked);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);

    const response = await fetch(`http://localhost:5000/api/posts/like/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.uid }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Like toggle failed");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};


  const handleCommentOpen = () => {
    setCommentOpen(true);
  };

  const handleCommentClose = () => {
    setCommentOpen(false);
    setCommentText("");
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${_id}/comment`, {
        comment: commentText,
      });
      console.log(" Comment submitted to MongoDB");
      handleCommentClose();
    } catch (error) {
      console.error(" Error submitting comment:", error);
    }
  };

   const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${_id}`);
      if (onDelete) onDelete(_id); // notify parent to update UI
    } catch (err) {
      console.error(" Error deleting post:", err);
    }
  };
  // Fallback profile picture if profileUrl is not provided

const handleShare = (post) => {
  const postUrl = `${window.location.origin}/posts/${post._id}`; // or a direct shareable URL
  const shareText = `Check out this post by ${post.username}: ${post.caption}`;

  if (navigator.share) {
    navigator.share({
      title: 'InstaClone Post',
      text: shareText,
      url: postUrl,
    }).catch((error) => console.error('Error sharing:', error));
  } else {
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!");
  }
};

  return (
    <>
      <Card sx={{ maxWidth: 600, marginBottom: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#f50057", width: 40, height: 40 }}>
              <img
                src={ displayProfile}
                alt={username}
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            </Avatar>
          }
          title={
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              fontFamily="monospace"
              textAlign="initial"
            >
              {username}
            </Typography>
          }
           action={
          <IconButton onClick={handleDelete} aria-label="delete">
            Delete Post
            <DeleteIcon />
          </IconButton>
        } 
        />
     <Box position="relative" onDoubleClick={handleLikeToggle}>
        <CardMedia
          component="img"
          height="450"
          image={imageUrl}
          alt="Post"
          sx={{ objectFit: "cover" }}
        />
 {showHeart && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
            <FavoriteIcon sx={{ fontSize: 80, color: "white" }} />
            </Motion.div>
          )}
        </Box>

<CardContent sx={{ display: "flex", gap: 1 }}>
  <IconButton onClick={handleLikeToggle}>
    {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
  </IconButton>
  <Typography variant="body2">{likeCount} likes</Typography>

      
          <IconButton onClick={handleCommentOpen}>
            <ChatBubbleOutlineIcon />
          </IconButton>
         <IconButton onClick={handleLikeToggle}>
 
</IconButton>

<Tooltip title="Share">
  <IconButton onClick={() => handleShare({ _id, username, caption })}>
    <SendIcon />
  </IconButton>
</Tooltip>

        </CardContent>

        <CardContent>
          <Typography
            variant="body2"
            fontFamily="monospace"
            textAlign="initial"
          >
            <strong>{username}</strong> {caption}
          </Typography>
        </CardContent>
      </Card>

      {/* Comment Modal */}
      <Dialog open={commentOpen} onClose={handleCommentClose} fullWidth>
        <DialogTitle>Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCommentSubmit} variant="contained">
              Post
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Post;
