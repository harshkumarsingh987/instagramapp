 import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import AddBoxIcon from "@mui/icons-material/AddBoxOutlined";
import SlideshowIcon from "@mui/icons-material/SlideshowOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import PostUploader from "./PostUploader.jsx"; // Ensure this exists
import ProfileUpdater from "./ProfileUpdater.jsx"; // Adjust the path as needed

function Footer({ user }) {
  const [value, setValue] = useState(0);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      setOpenPostModal(true);
    }
  };

  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleCloseMenu();
    navigate("/login");
  };

  const handleSignup = () => {
    handleCloseMenu();
    navigate("/signup");
  };

  const [profileOpen, setProfileOpen] = useState(false);

// Replace USER_ID with actual user._id from MongoDB
// Place the ProfileUpdater and Button inside the return statement where appropriate, for example inside the Menu or as needed:

const handleProfileUpdate = () => {
  setProfileOpen(true);
  handleCloseMenu();
};

  return (
    <>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #ddd",
          zIndex: 1000,
        }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange} showLabels={false}>
          <BottomNavigationAction icon={<HomeIcon sx={{ color: pink[500] }} />} />
          <BottomNavigationAction icon={<AddBoxIcon />} />
          <BottomNavigationAction icon={<SearchIcon />} />
          <BottomNavigationAction icon={<SlideshowIcon />} />
          {user && (
            <BottomNavigationAction
              icon={
                <Avatar
                  src={user.photoURL || ""}
                  alt="Profile"
                  sx={{ width: 24, height: 24 }}
                  onClick={handleClickAvatar}
                />
              }
            />
          )}
        </BottomNavigation>
      </Paper>

      {/* Post Upload Modal */}
      <Dialog open={openPostModal} onClose={() => setOpenPostModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Create Post</Typography>
            <IconButton
              aria-label="close"
              onClick={() => setOpenPostModal(false)}
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <PostUploader open={openPostModal} onClose={() => setOpenPostModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Avatar Dropdown Menu */}
      <Menu
     
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem disabled>{user?.displayName || user?.email}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem onClick={handleSignup}>Create New Account</MenuItem>
        <MenuItem>
          <Button onClick={handleProfileUpdate}>Change Profile Pic</Button>
        </MenuItem>
      </Menu>

      {/* Profile Updater Modal */}
      <ProfileUpdater open={profileOpen} onClose={() => setProfileOpen(false)} userId={user?._id || "USER_ID"} />
    </>
  );
}
export default Footer;
