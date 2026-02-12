 import "./login.css";
import React, { useState } from "react";
import { TextField, Button, Box, Typography,Paper,Divider, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import InstagramIcon from "@mui/icons-material/Instagram";
//import { signInWithEmailAndPassword } from "firebase/auth";
//import { auth } from "./firebase"; // Ensure this is set up correctly
import axios from "axios";
import { Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter valid credentials");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!specialCharRegex.test(password)) {
      alert("Password must contain at least one special character.");
      return;
    }

    try {
    const res = await axios.post(
        "https://instagram-backend.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true } // allows cookies
      );

      // Set user in cookies (optional since Firebase already handles session)
     
      Cookies.set("token", res.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
          // ✅ Show popup
    setSnackbarOpen(true);

    // ✅ Delay navigation to let the popup be visible
    setTimeout(() => {
      navigate("/", { state: { showPopup: true } });
    }, 300);
    } catch (error) {
    alert("Login failed. Please check your email or password.");
    console.error(error);
  }
  };

  
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          width: 320,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <InstagramIcon sx={{ fontSize: 50, color: "#d6249f" }} />
        <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "'Segoe UI'", mt: 1 }}>
          Instagram
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#d6249f", ":hover": { backgroundColor: "#ad216f" } }}
          onClick={handleLogin}
        >
          Log In
        </Button>

        <Divider sx={{ my: 2, width: "100%" }} />

        <Typography variant="body2">
          Don't have an account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </Typography>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
