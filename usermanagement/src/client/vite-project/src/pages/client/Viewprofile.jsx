import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Alert, Container, Button, Stack } from "@mui/material";
import AddClient from "./AddClient"; // Import your AddClient component

const ViewProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddClient, setShowAddClient] = useState(false); // Toggle AddClient form
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:8000/user/data", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (data.success) {
                    setUserData(data.userData);
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
                <Card sx={{ p: 3, boxShadow: 3, mb: 3 }}> {/* Margin-bottom to separate from AddClient */}
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Welcome, {userData.name}
                        </Typography>
                        <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
                        <Typography variant="body1"><strong>Contact No:</strong> {userData.contactNo}</Typography>
                        <Typography variant="body1"><strong>Role:</strong> {userData.role}</Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => setShowAddClient(!showAddClient)} // Toggle AddClient component
                            >
                                {showAddClient ? "Hide Add Client" : "Add More"}
                            </Button>

                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={() => navigate("/edit-profile")} // Navigate to edit profile page
                            >
                                Edit Profile
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Add Client Form - Conditionally Rendered */}
            {showAddClient && <AddClient onClose={() => setShowAddClient(false)} />}
        </Container>
    );
};

export default ViewProfile;