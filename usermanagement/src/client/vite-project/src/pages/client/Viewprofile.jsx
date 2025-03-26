import React, { useContext } from "react";
import { AppContent } from "./Appcontext.jsx"; // ✅ Corrected import path
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";

const ViewProfile = () => {
    const context = useContext(AppContent); // ✅ Ensure context is used properly

    if (!context) {
        return <Alert severity="error">Context not available</Alert>;
    }

    const { userData } = context;

    if (!userData) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Client Profile
                </Typography>

                <Typography variant="subtitle1"><strong>Name:</strong> {userData.name}</Typography>
                <Typography variant="subtitle1"><strong>Contact Number:</strong> {userData.contactNo}</Typography>
                <Typography variant="subtitle1"><strong>Email:</strong> {userData.email}</Typography>
                <Typography variant="subtitle1"><strong>Role:</strong> {userData.role}</Typography>
            </Paper>
        </Box>
    );
};

export default ViewProfile;
