 import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";

function ProfileUpdater({ open, onClose, userId }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

 const handleUpload = async () => {
  if (!imageFile || !userId) {
    console.error("Missing imageFile or userId");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("profilePic", imageFile);  // this key must match multer field name

    await axios.put(
      `http://localhost:5000/api/users/${userId.trim()}/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    
   console.log("Profile picture uploaded successfully");
   
  } catch (err) {
    console.error("❌ Error updating profile picture:", err);
    setError(true);
  }
};


  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={1}>
            <Button variant="contained" component="label">
              Upload New Image
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {previewUrl && (
              <>
                <Typography variant="caption">Preview:</Typography>
                <Avatar src={previewUrl} sx={{ width: 100, height: 100 }} />
              </>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!imageFile}
            >
              Update
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          🎉 Profile picture updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          ❌ Failed to update profile picture. Try again.
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfileUpdater;
