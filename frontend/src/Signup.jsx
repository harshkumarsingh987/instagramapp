import React, { useState } from "react";
import { TextField, Button, Box, Typography,Paper,Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // ✅ import your auth from firebase.js
import InstagramIcon from "@mui/icons-material/Instagram";
import "./Signup.css"; // ✅ Ensure you have a CSS file for styles
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user in cookies (optional)
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: 320, textAlign: "center" }}>
        <InstagramIcon sx={{ fontSize: 50, color: "#f50057", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign up to see photos and videos from your friends.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1, backgroundColor: "#0095f6" }}
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

