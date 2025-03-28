import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, CircularProgress, Alert } from "@mui/material";

const EditClient = () => {
    const { clientId } = useParams(); // Extract clientId from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        contactNo: "",
        email: "",
        dob: "",
        homeaddress: "",
        businessaddress: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/clientmanagement/get-client/${clientId}`);
                const data = await response.json();
                if (data.success) {
                    setFormData(data.client);
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
    }, [clientId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/clientmanagement/update-client/${clientId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                navigate(`/view-profile`); // Navigate back to the profile page after successful update
            } else {
                setError(data.message || "Error updating client");
            }
        } catch (error) {
            setError("Error updating client");
        }
    };

    return (
        <Box sx={{ maxWidth: "600px", margin: "auto", padding: 2 }}>
            {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Contact Number"
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
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled
                />
                <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dob}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Home Address"
                    name="homeaddress"
                    value={formData.homeaddress}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Business Address"
                    name="businessaddress"
                    value={formData.businessaddress}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                    required
                    multiline
                    rows={4}
                />
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: "20px" }}>
                    <Button type="submit" variant="contained" color="primary">
                        Update Profile
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate(`/view-profile`)}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditClient;
