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
    contactNumber: "",
    email: "",
    password: "",
    role: "client",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);
    alert("Registration Successful!");

    if (formData.role === "client") {
      navigate("/clienthome"); // Redirect to Client Home
    } else if (formData.role === "lawyer") {
      navigate("/lawyer"); // Redirect to Lawyer Dashboard
    } else {
      navigate("/adminhome"); // Redirect to Admin Home
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
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
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
