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

import AddClient from "./Addclient";

const ViewProfile = () => {
  const [userData, setUserData] = useState(null); // User data fetched from API
  const [clientData, setClientData] = useState(null); // Client-specific data (if exists)
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
          const checkClientResponse = await fetch(
            "http://localhost:8000/clientmanagement/check-client-exists",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: data.userData.email }),
            }
          );

          const clientExistsData = await checkClientResponse.json();
          if (clientExistsData.success && clientExistsData.exists) {
            setIsClientAdded(true); // Disable the "Add More" button
            setClientData(clientExistsData.client); // Store client-specific data
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

            {/* Display Client-Specific Data if Exists */}
            {clientData && (
              <>
                <Typography variant="body1">
                  <strong>Full Name:</strong> {clientData.fullname || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Date of Birth:</strong> {clientData.dob || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Home Address:</strong> {clientData.homeaddress || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Business Address:</strong>{" "}
                  {clientData.businessaddress || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {clientData.description || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Agreements:</strong>{" "}
                  {clientData.agreements?.length > 0
                    ? clientData.agreements.map((file, index) => (
                        <div key={index}>
                          <a href={file} target="_blank" rel="noopener noreferrer">
                            Agreement {index + 1}
                          </a>
                        </div>
                      ))
                    : "No agreements uploaded"}
                </Typography>
                <Typography variant="body1">
                  <strong>Other Documents:</strong>{" "}
                  {clientData.other_documents?.length > 0
                    ? clientData.other_documents.map((file, index) => (
                        <div key={index}>
                          <a href={file} target="_blank" rel="noopener noreferrer">
                            Document {index + 1}
                          </a>
                        </div>
                      ))
                    : "No documents uploaded"}
                </Typography>
              </>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {!isClientAdded && ( // Show "Add More" button only if client doesn't exist
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAddClient(!showAddClient)}
                >
                  Add More
                </Button>
              )}

              {/* Edit Profile Button - Always Visible */}
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
          onClientAdded={(newClientData) => {
            setIsClientAdded(true); // Update state dynamically
            setClientData(newClientData); // Store the new client data
          }}
        />
      )}
    </Container>
  );
};

export default ViewProfile;