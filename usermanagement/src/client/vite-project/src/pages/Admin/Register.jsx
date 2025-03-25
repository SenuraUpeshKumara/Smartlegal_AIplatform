import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    password: "",
    role: "client",
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        alert("Registration Successful!");
        navigate(formData.role === "client" ? "/clienthome" : formData.role === "lawyer" ? "/lawyer" : "/adminhome");
      } else {
        alert(`Error: ${data.message || "Registration failed!"}`);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred. Please try again.");
    }
  };



  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography variant="h5" gutterBottom>
          User Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="ContactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Typography variant="subtitle1">Select Role:</Typography>
          <RadioGroup
            row
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <FormControlLabel value="client" control={<Radio />} label="Client" />
            <FormControlLabel value="lawyer" control={<Radio />} label="Lawyer" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
