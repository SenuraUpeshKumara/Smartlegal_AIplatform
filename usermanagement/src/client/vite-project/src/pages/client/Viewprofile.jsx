import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Button,
    Stack,
} from "@mui/material";

// import AddClient from "./AddClient"; // Ensure this is in the correct path

const ViewProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddClient, setShowAddClient] = useState(false); // Toggle AddClient form
    const [isClientAdded, setIsClientAdded] = useState(false); // Track if client already exists
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user data
                const response = await fetch("http://localhost:8000/user/data", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (data.success) {
                    setUserData(data.userData);

                    // Check if the user's email already exists in the client table
                    const checkClientResponse = await fetch("http://localhost:8000/clientmanagement/check-client-exists", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: data.userData.email }),
                    });

                    const clientData = await checkClientResponse.json();
                    if (clientData.success && clientData.exists) {
                        setIsClientAdded(true); // Disable the "Add More" button
                    }
                } else {
                    setError("Failed to fetch user data");
                }
            } catch (error) {
                setError("Error fetching user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {/* Loading and Error Handling */}
            {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Profile Details - Always Visible */}
            {userData && (
                <Card sx={{ p: 3, boxShadow: 3, mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Welcome, {userData.name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email:</strong> {userData.email}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Contact No:</strong> {userData.contactNo}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Role:</strong> {userData.role}
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            {!isClientAdded && ( // Remove button if client exists
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setShowAddClient(!showAddClient)}
                                >
                                    Add More
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate(`/edit-profile/${userData._id}`)} // Navigate to the EditClient page
                            >
                                Edit Profile
                            </Button>

                        </Stack>

                    </CardContent>
                </Card>
            )}

            {/* Add Client Form - Conditionally Rendered */}
            {showAddClient && !isClientAdded && (
                <AddClient
                    onClose={() => setShowAddClient(false)}
                    userData={userData}
                    onClientAdded={() => setIsClientAdded(true)} // Update state dynamically
                />
            )}

        </Container>
    );
};

export default ViewProfile;
