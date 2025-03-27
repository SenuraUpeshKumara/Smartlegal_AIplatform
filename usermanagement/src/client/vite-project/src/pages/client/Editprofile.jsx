import React, { useState, useEffect } from "react";
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
import { useParams, useNavigate } from "react-router-dom";

const UpdateClient = () => {
  const { id } = useParams(); // Get client ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Fullname: "",
    dob: "",
    homeaddress: "",
    businessaddress: "",
    NIC: "",
    description: "",
    agreements: [],
    other_documents: [],
  });

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client data when component loads
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/clientmanagement/get-client/${id}`);
        const data = await response.json();

        if (data.success) {
          setFormData({
            Fullname: data.data.Fullname || "",
            dob: data.data.dob || "",
            homeaddress: data.data.homeaddress || "",
            businessaddress: data.data.businessaddress || "",
            NIC: data.data.NIC || "",
            description: data.data.description || "",
            agreements: data.data.agreements || [],
            other_documents: data.data.other_documents || [],
          });
        } else {
          setError("Failed to fetch client data");
        }
      } catch (error) {
        setError("Error fetching client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: [...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/clientmanagement/update-client/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        setOpenSuccessDialog(true);
      } else {
        console.error("Error updating client:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  };

  const handleClose = () => {
    setOpenSuccessDialog(false);
    navigate("/clienthome");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Update Client
        </Typography>

        {loading && <Alert severity="info">Loading client data...</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="Fullname" value={formData.Fullname} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
            <TextField fullWidth label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Home Address" name="homeaddress" value={formData.homeaddress} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
            <TextField fullWidth label="Business Address" name="businessaddress" value={formData.businessaddress} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
            <TextField fullWidth label="NIC" name="NIC" value={formData.NIC} onChange={handleChange} margin="normal" required sx={{ marginBottom: "15px" }} />
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" required multiline rows={4} sx={{ marginBottom: "15px" }} />

            {/* File Uploads */}
            <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>
              Upload New Agreements:
            </Typography>
            <input type="file" name="agreements" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

            <Typography variant="subtitle1" sx={{ marginTop: "15px" }}>
              Upload Other Documents:
            </Typography>
            <input type="file" name="other_documents" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx" />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: "20px" }}>
              <Button type="submit" variant="contained" color="primary">
                Update Client
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate("/clienthome")}>
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      {/* Success Popup Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Client details updated successfully!</Alert>
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

export default UpdateClient;
