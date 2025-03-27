import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Alert, Container, Button, Stack } from "@mui/material";
import AddClient from "./AddClient"; // Import your AddClient component (if relevant)

const ViewLawyer = () => {
    const [lawyerData, setLawyerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddClient, setShowAddClient] = useState(false); // Toggle AddClient form if relevant
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchLawyerData = async () => {
            try {
                const response = await fetch("http://localhost:8000/lawyer/data", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (data.success) {
                    setLawyerData(data.lawyerData);
                } else {
                    setError("Failed to fetch lawyer data");
                }
            } catch (error) {
                setError("Error fetching lawyer data");
            } finally {
                setLoading(false);
            }
        };

        fetchLawyerData();
    }, []);

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {/* Loading and Error Handling */}
            {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Lawyer Profile Details - Always Visible */}
            {lawyerData && (
                <Card sx={{ p: 3, boxShadow: 3, mb: 3 }}> {/* Margin-bottom to separate from AddClient */}
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Welcome, {lawyerData.fullname}
                        </Typography>
                        <Typography variant="body1"><strong>Email:</strong> {lawyerData.email}</Typography>
                        <Typography variant="body1"><strong>Contact No:</strong> {lawyerData.contactNo}</Typography>
                        <Typography variant="body1"><strong>Role:</strong> {lawyerData.role}</Typography>
                        <Typography variant="body1"><strong>Expertise:</strong> {lawyerData.expertise.join(', ')}</Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => setShowAddClient(!showAddClient)} // Toggle AddClient component
                            >
                                {showAddClient ? "Hide Add Client" : "Add More Clients"}
                            </Button>

                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={() => navigate("/edit-lawyer-profile")} // Navigate to edit profile page
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

export default ViewLawyer;
