 import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function StoryViewer({ open, handleClose, story }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          width: { xs: "90%", md: 400 },
          textAlign: "center",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={story.imageUrl}
          alt={story.username}
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <Typography variant="h6" mt={2}>
          {story.username}
        </Typography>
        <Typography variant="body2">{story.caption}</Typography>
      </Box>
    </Modal>
  );
}

export default StoryViewer;
