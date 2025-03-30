import React, { useState } from "react";
import { TextField, MenuItem, Button, Container, Typography, Box } from "@mui/material";

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    consultationType: "",
    remark: "",
  });

  const consultationTypes = [
    { value: "Legal Advice", label: "Legal Advice" },
    { value: "Case Evaluation", label: "Case Evaluation" },
    { value: "Document Review", label: "Document Review" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/consultation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({ fullName: "", email: "", phoneNumber: "", consultationType: "", remark: "" }); // Clear form after submission
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Legal Consultation kumkuwoooooo Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Contact Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} margin="normal" required inputProps={{ maxLength: 10 }} />
          
          <TextField fullWidth select label="Select Consultation Type" name="consultationType" value={formData.consultationType} onChange={handleChange} margin="normal" required>
            {consultationTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Remark" name="remark" value={formData.remark} onChange={handleChange} margin="normal" multiline rows={3} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ConsultationForm;