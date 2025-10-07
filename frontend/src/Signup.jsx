import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !mobile || !dob) {
      alert("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password, mobile, dob },
        { withCredentials: true }
      );

      Cookies.set("token", res.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: 320, textAlign: "center" }}>
        <InstagramIcon sx={{ fontSize: 50, color: "#f50057", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign up to see photos and videos from your friends.
        </Typography>

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Mobile Number */}
        <TextField
          fullWidth
          label="Mobile Number"
          margin="normal"
          size="small"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          inputProps={{ maxLength: 10 }}
        />

        {/* Date of Birth */}
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          margin="normal"
          size="small"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {/* Password with show/hide */}
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Signup Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            mb: 1,
            backgroundColor: "#0095f6",
            "&:hover": { backgroundColor: "#007acc" },
          }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2">
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;

