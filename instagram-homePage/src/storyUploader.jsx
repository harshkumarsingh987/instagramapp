 import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField } from "@mui/material";

function StoryUploader({ user, onStoryUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("story", file);
      formData.append("userId", user._id); // Assuming you have user ID from MongoDB
      formData.append("username", user.username);
      formData.append("profileUrl", user.profileUrl);

      const response = await axios.post("http://localhost:5000/api/stories/upload-file", formData);
      console.log("Upload success:", response.data);
      alert("Story uploaded successfully");
      setFile(null);
      setPreviewUrl(null);
      onStoryUploaded(); // Refresh stories
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload story");
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed gray", borderRadius: 2, mb: 2 }}>
      <Typography variant="h6">Upload Story</Typography>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {previewUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography>Preview:</Typography>
          <img src={previewUrl} alt="Preview" width="150" />
        </Box>
      )}
      <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>
        Upload Story
      </Button>
    </Box>
  );
}

export default StoryUploader;
