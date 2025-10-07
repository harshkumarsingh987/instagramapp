 import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

//import { onAuthStateChanged } from "firebase/auth";
//import { auth } from "./firebase";
import Cookies from "js-cookie";
function PostUploader({ open, onClose, onNewPost = () => {} }) {
  // State variables
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

   // Monitor Firebase user
    useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));
  }, []);
  useEffect(() => {
    if (!open) {
      setCaption("");
      setImageFile(null);
      setPreviewUrl("");
    }
  }, [open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

 


const handleSubmit = async () => {
  if (!user || !imageFile || !caption) {
    setToast({ open: true, message: "All fields are required", severity: "error" });
    return;
  }

  setUploading(true);
  const formData = new FormData();
  // ✅ Add the debug log here
  console.log("📤 Submitting Post with:", {
    userId: user.uid,
    username: user.displayName || user.email.split("@")[0],
    profileUrl: user.photoURL || "",
  });
  formData.append("image", imageFile);
  formData.append("username", user.displayName || user.email.split("@")[0]);
  formData.append("profileUrl", user.photoURL || "");
  formData.append("caption", caption);
  formData.append("userId", user.uid);
  formData.append("email", user.email);
  try {
    const res = await fetch("http://localhost:5000/api/posts/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setToast({ open: true, message: "✅ Post uploaded successfully!", severity: "success" });
      setCaption("");
      setImageFile(null);
      setPreviewUrl("");
      onNewPost(data);
      onClose();
    } else {
      setToast({ open: true, message: data.error || "❌ Upload failed", severity: "error" });
      console.error("❌ Upload failed:", data.error);
    }
  } catch (err) {
    setToast({ open: true, message: "❌ Error uploading", severity: "error" });
    console.error("❌ Error uploading:", err);
  } finally {
    setUploading(false);
  }
};

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {user && (
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={user.photoURL || ""} />
                <Typography>{user.displayName || user.email.split("@")[0]}</Typography>
              </Box>
            )}
            <TextField
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              multiline
              rows={2}
            />
            <Button variant="outlined" component="label">
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {previewUrl && (
              <Box textAlign="center">
                <Typography variant="caption">Image Preview</Typography>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{ maxWidth: "100%", maxHeight: 250, mt: 1, borderRadius: 2 }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={uploading}
              fullWidth
            >
              {uploading ? "Posting..." : "Post"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PostUploader;

