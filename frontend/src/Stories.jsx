import React, { useState } from "react";
import {
  Avatar, Box, Stack, Typography, IconButton, Modal
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const dummyStories = [
  {
    id: 1,
    username: "boatxaman",
    profilePic: "https://i0.wp.com/blog.velocity.in/wp-content/uploads/2024/08/Aman-Gupta-boat-Velocity-1.webp?resize=800%2C450&ssl=1",
    imageUrl: "https://picsum.photos/seed/story1/500/400",
    caption: "Check out my latest adventure!",
  },
  {
    id: 2,
    username: "virtkoli",
    profilePic: "https://static.toiimg.com/photo/119129076.cms",
    imageUrl: "https://picsum.photos/seed/story2/500/400",
    caption: "Just chilling with friends!",
  },
  {
    id: 3,
    username: "shraddhaKapoor",
    profilePic: "https://cdn.123telugu.com/content/wp-content/uploads/2025/05/Shraddha-Kapoor-1.jpg",
    imageUrl: "https://picsum.photos/seed/story3/500/400",
    caption: "Loving the new movie release!",
  },
  {
    id: 4,
    username: "harsh_.152",
    profilePic: "https://i.pravatar.cc/150?img=11",
    imageUrl: "https://picsum.photos/seed/story4/500/400",
    caption: "Exploring new places!",
  },
  {
    id: 5,
    username: "officialapnacollege",
    profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkqayHFZHgzTPCnuXnCJq16ad81lp-EhNSJw&s",
    imageUrl: "https://picsum.photos/seed/story5/500/400",
    caption: "Celebrating college life!",
  },
  {
    id: 6,
    username: "rajshamani",
    profilePic: "https://images.moneycontrol.com/static-mcnews/2024/01/Raj-Shamani.jpg",
    imageUrl: "https://picsum.photos/seed/story6/500/400",
    caption: "Just launched my new business!",
  },
  {
    id: 7,
    username: "dr.rakshitasingh",
    profilePic: "https://yt3.googleusercontent.com/l5MNuHY7Ej_B6P3xs4D0otackcgcQnBrN4TePRd5se3smAHZOTlzV70W0MO34Anf6RDmEMEkKw=s900-c-k-c0x00ffffff-no-rj",
    imageUrl: "https://picsum.photos/seed/story7/500/400",
    caption: "Sharing health tips for a better life!",
  },
  {
    id: 8,
    username: "iqlipse_nova",
    profilePic: "https://in.bmscdn.com/artist/iqlipse-nova-2037933-1718454222.jpg",
    imageUrl: "https://picsum.photos/seed/story8/500/400",
    caption: "New music dropping soon!",
  },
  {
    id: 9,
    username: "priyank_rajput",
    profilePic: "https://i.pravatar.cc/150?img=9",
    imageUrl: "https://picsum.photos/seed/story9/500/400",
    caption: "Had a great time at the event!",
  },
  {
    id: 10,
    username: "riya_sen",
    profilePic: "https://i.pravatar.cc/150?img=10",
    imageUrl: "https://picsum.photos/seed/story10/500/400",
    caption: "Just finished a photoshoot!",
  },
];

function Stories() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < dummyStories.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const selectedStory = dummyStories[currentIndex];

  return (
    <>
      <Box sx={{ backgroundColor: "#fff", border: "1px solid #dbdbdb", padding: 1, borderRadius: 2, mb: 2, overflowX: "auto", whiteSpace: "nowrap" }}>
        <Stack direction="row" spacing={2}>
          {dummyStories.map((story, index) => (
            <Box key={index} textAlign="center">
              <IconButton onClick={() => handleOpen(index)} sx={{ p: 0 }}>
                <Box sx={{
                  position: "relative",
                  border: "2px solid #f50057",
                  borderRadius: "50%",
                  width: 80, height: 80,
                  "&:hover": { borderColor: "#c51162" }
                }}>
                  <Avatar src={story.profilePic} sx={{ width: "100%", height: "100%" }} />
                </Box>
              </IconButton>
              <Typography variant="caption" display="block" noWrap width={80} mx="auto" textAlign="center" fontWeight="bold">
                {story.username}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24, p: 2, borderRadius: 2,
          width: { xs: "90%", md: 400 },
          textAlign: "center",
        }}>
          <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={handleClose}><CloseIcon /></IconButton>

          <Box sx={{ position: "absolute", top: "50%", left: 10 }}>
            <IconButton onClick={handlePrev} disabled={currentIndex === 0}><ArrowBackIosNewIcon /></IconButton>
          </Box>

          <Box sx={{ position: "absolute", top: "50%", right: 10 }}>
            <IconButton onClick={handleNext} disabled={currentIndex === dummyStories.length - 1}><ArrowForwardIosIcon /></IconButton>
          </Box>

          {selectedStory && (
            <>
              <img src={selectedStory.imageUrl} alt={selectedStory.username} style={{ width: "100%", borderRadius: "10px" }} />
              <Typography variant="h6" mt={2}>{selectedStory.username}</Typography>
              <Typography variant="body2">{selectedStory.caption}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Stories;
