 import React from "react";
import { Box, Typography, Stack, Avatar } from "@mui/material";

function Sidebar() {
  const suggestions = ["@nature_photog", "@coder_life", "@funny_moments"];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #dbdbdb",
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Typography variant="subtitle1" mb={2}>
        Suggested for you
      </Typography>
      <Stack spacing={2}>
        {suggestions.map((user, i) => (
          <Stack direction="row" spacing={2} alignItems="center" key={i}>
            <Avatar />
            <Typography variant="body2">{user}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default Sidebar;
