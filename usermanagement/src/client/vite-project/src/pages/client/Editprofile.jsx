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
import { useNavigate, useParams } from "react-router-dom";

const UpdateClient = () => {
  const { clientId } = useParams(); // Get client ID from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    address: "",
    occupation: "",
    NIC: "",
    casetype: "",
    casetitle: "",
    description: "",
    opposername: "",
    opp_number: "",
    agreements: [],
    other_documents: [],
  });

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  // Fetch existing client data (mocked here, replace with API call)
  useEffect(() => {
    // Simulate fetching data from API
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        const clientData = await response.json();
        setFormData(clientData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: [...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updated Client Data:", formData);

    try {
      await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setOpenSuccessDialog(true);
    } catch (error) {
      console.error("Error updating client data:", error);
    }
  };

  const handleClose = () => {
    setOpenSuccessDialog(false);
    navigate("/clienthome"); // Redirect to dashboard after update
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Update Client Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Contact Number" name="number" type="tel" value={formData.number} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="NIC" name="NIC" value={formData.NIC} onChange={handleChange} margin="normal" required />

          <TextField select fullWidth label="Case Type" name="casetype" value={formData.casetype} onChange={handleChange} margin="normal" required>
            <MenuItem value="Civil">Civil</MenuItem>
            <MenuItem value="Criminal">Criminal</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
            <MenuItem value="Property">Property</MenuItem>
          </TextField>
          <TextField fullWidth label="Case Title" name="casetitle" value={formData.casetitle} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Case Description" name="description" value={formData.description} onChange={handleChange} margin="normal" required multiline rows={4} />

          <TextField fullWidth label="Opposer Name" name="opposername" value={formData.opposername} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Opposer Contact Number" name="opp_number" type="tel" value={formData.opp_number} onChange={handleChange} margin="normal" required />

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
      </Paper>

      <Dialog open={openSuccessDialog} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Client profile updated successfully!</Alert>
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
