 import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
   Badge,
   Avatar,
  Menu,
  MenuItem
} from "@mui/material"; // ✅ Box added here
import InstagramIcon from "@mui/icons-material/Instagram";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function Header() {



  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #ddd",
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo and Instagram Text */}
        <Box display="flex" alignItems="center">
          <InstagramIcon sx={{ mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", fontFamily:"monospace"}}
          >
            Instagram
          </Typography>
        </Box>

        {/* Notification and Chat Icons */}
        <Box>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
               <FavoriteBorderIcon />                
            </Badge>
          
          </IconButton>
          <IconButton color="inherit">
               <Badge badgeContent={5} color="error">
                 <ChatBubbleOutlineIcon />
               </Badge>
          </IconButton>
          
         
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
