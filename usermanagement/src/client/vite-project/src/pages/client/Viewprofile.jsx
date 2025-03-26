import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { AppContent } from "./Appcontext";


const ViewProfile = () => {
    //const { clientId } = useParams();
    const [userData, setUserData] = useState(null);
   // const [loading, setLoading] = useState(true);
   // const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/user/get/${clientId}`, { withCredentials: true });
                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [clientId]);

    // Handle loading and error states
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    // If userData is null, return an early return (optional error handling)
    if (!userData) return <Alert severity="error">User profile not found.</Alert>;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Client Profile
                </Typography>
                <Typography variant="subtitle1"><strong>Name:</strong> {userData.id}</Typography>
                <Typography variant="subtitle1"><strong>Name:</strong> {userData.name}</Typography>
                <Typography variant="subtitle1"><strong>Contact Number:</strong> {userData.contactNo}</Typography>
                <Typography variant="subtitle1"><strong>Email:</strong> {userData.email}</Typography>
                <Typography variant="subtitle1"><strong>Role:</strong> {userData.role}</Typography>
            </Paper>
        </Box>
    );
};

export default ViewProfile;
