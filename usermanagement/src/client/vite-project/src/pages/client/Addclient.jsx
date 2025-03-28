import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const AddClient = ({ onClose, userData, onClientAdded }) => {
  const [formData, setFormData] = useState({
    fullname: userData?.name || "",
    contactNo: userData?.contactNo || "",
    email: userData?.email || "",
    dob: "",
    homeaddress: "",
    businessaddress: "",
    description: "",
    agreements: [],
    other_documents: [],
  });

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: Array.from(files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "agreements" || key === "other_documents") {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      const response = await fetch("http://localhost:8000/clientmanagement/create-client", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error adding client.");
      } else {
        setOpenSuccessDialog(true);
        if (onClientAdded) onClientAdded(); // Notify parent to remove button
        setFormData({
          fullname: "",
          contactNo: "",
          email: "",
          dob: "",
          homeaddress: "",
          businessaddress: "",
          description: "",
          agreements: [],
          other_documents: [],
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleClose = () => {
    setOpenSuccessDialog(false);
    onClose();
  };
  
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Add Client
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Contact Number" name="contactNo" value={formData.contactNo} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Home Address" name="homeaddress" value={formData.homeaddress} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Business Address" name="businessaddress" value={formData.businessaddress} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Case Description" name="description" value={formData.description} onChange={handleChange} margin="normal" required multiline rows={4} />

          <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>Upload Agreements:</Typography>
          <input type="file" name="agreements" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>Upload Other Documents:</Typography>
          <input type="file" name="other_documents" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="primary">Add Client</Button>
            <Button variant="contained" color="secondary" onClick={onClose}>Back to Dashboard</Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openSuccessDialog} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Client successfully added!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClient;