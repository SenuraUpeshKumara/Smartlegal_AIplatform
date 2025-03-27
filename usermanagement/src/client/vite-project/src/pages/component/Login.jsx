import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { AppContent } from "../client/Appcontext"; // Ensure correct import path
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  // ✅ Use AppContent instead of AppContext
  const { setIsLoggedin, getUserData } = useContext(AppContent);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Login Successful", { position: "top-right" });
      setIsLoggedin(true);

      // Fetch user details after login
      const userData = await getUserData();
      console.log("Logged-in User:", userData);

      // Check if userData exists and has the role property
      if (userData && userData.role) {
        // Navigate based on role
        if (userData.role === "client") {
          navigate("/clienthome");
        } else if (userData.role === "lawyer") {
          navigate("/lawyer");
        } else if (userData.role === "admin") {
          navigate("/adminhome");
        } else {
          toast.error("Unknown role. Contact support.");
        }
      } else {
        toast.error("User data or role is missing.");
      }
    } else {
      toast.error(data.message || "Invalid credentials!");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("An error occurred while logging in. Please try again.");
  }
};


  return (
    <Container maxWidth="xs">
      <Paper elevation={3} className="login-container" sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h5" gutterBottom align="center">
          User Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
