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
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const [formData, setFormData] = useState({
    Fullname: "",
    dob: "",
    homeaddress: "",
    businessaddress: "",
    NIC: "",
    description: "",
    agreements:[],
    other_documents: [],
   
  });

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: [...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/clientmanagement/add-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log("Client added successfully");
        setOpenSuccessDialog(true);
        setFormData({
          Fullname: "",
          dob: "",
          homeaddress: "",
          businessaddress: "",
          NIC: "",
          description: "",
         
          agreements: [],
          other_documents: [],
        });
      } else {
        console.error("Error adding client:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleClose = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Add Client
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <TextField fullWidth label="Full Name" name="name" value={formData.Fullname} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
          <TextField fullWidth label=" Date of birth" name="dob" type="Date" value={formData.dob} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
          <TextField fullWidth label="Home address" name="homeaddress" value={formData.homeaddress} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
          <TextField fullWidth label="Business address" name="businessaddress" value={formData.businessaddress} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
          <TextField fullWidth label="NIC" name="NIC" value={formData.NIC} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />

          
          <TextField fullWidth label="Case Description" name="description" value={formData.description} onChange={handleChange} margin="normal" required multiline rows={4} sx={{ marginBottom: "15px" }} />

         
          {/* File Uploads */}
          <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>
            Upload Agreements:
          </Typography>
          <input type="file" name="agreements" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>
            Upload Other Documents:
          </Typography>
          <input type="file" name="other_documents" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: "#3f51b5", "&:hover": { backgroundColor: "#283593" }, padding: "10px 20px" }}>
              Add Client
            </Button>
            <Button variant="contained" color="secondary" sx={{ backgroundColor: "#e74c3c", "&:hover": { backgroundColor: "#c0392b" }, padding: "10px 20px" }} onClick={() => navigate("/clienthome")}>
              Back to Dashboard
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success Popup Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleClose} disableEnforceFocus disableRestoreFocus>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Client successfully submitted!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClient;
