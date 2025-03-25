import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { useLocation } from 'react-router-dom';

const ViewProfile = () => {
  //const { id } = useParams(); // Get the client ID from URL parameters
  //console.log("Client ID from URL:", id); // Debugging clientId

  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('clientId');
    console.log('Client ID from URL:', clientId);
    
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId) {
      setError("Client ID is missing");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/clientmanagement/get-client/${clientId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setClient(data.data); // Store client data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching client:", error);
        setError("Failed to load client profile");
        setLoading(false);
      });
  }, [clientId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Client Profile
        </Typography>

        {client ? (
          <Box>
            <Typography variant="subtitle1"><strong>Name:</strong> {client.name}</Typography>
            <Typography variant="subtitle1"><strong>Contact Number:</strong> {client.number}</Typography>
            <Typography variant="subtitle1"><strong>Address:</strong> {client.address}</Typography>
            <Typography variant="subtitle1"><strong>Occupation:</strong> {client.occupation}</Typography>
            <Typography variant="subtitle1"><strong>NIC:</strong> {client.NIC}</Typography>
            <Typography variant="subtitle1"><strong>Case Type:</strong> {client.casetype}</Typography>
            <Typography variant="subtitle1"><strong>Case Title:</strong> {client.casetitle}</Typography>
            <Typography variant="subtitle1"><strong>Description:</strong> {client.description}</Typography>
            <Typography variant="subtitle1"><strong>Opposer Name:</strong> {client.opposername}</Typography>
            <Typography variant="subtitle1"><strong>Opposer Contact:</strong> {client.opp_number}</Typography>

            {/* Display Uploaded Documents */}
            <Typography variant="subtitle1"><strong>Agreements:</strong></Typography>
            {client.agreements && client.agreements.length > 0 ? (
              client.agreements.map((file, index) => (
                <Typography key={index} component="a" href={`http://localhost:8000/${file}`} target="_blank" rel="noopener noreferrer">
                  Agreement {index + 1}
                </Typography>
              ))
            ) : (
              <Typography>No agreements uploaded</Typography>
            )}

            <Typography variant="subtitle1"><strong>Other Documents:</strong></Typography>
            {client.other_documents && client.other_documents.length > 0 ? (
              client.other_documents.map((file, index) => (
                <Typography key={index} component="a" href={`http://localhost:8000/${file}`} target="_blank" rel="noopener noreferrer">
                  Document {index + 1}
                </Typography>
              ))
            ) : (
              <Typography>No other documents uploaded</Typography>
            )}
          </Box>
        ) : (
          <Typography>No client data found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ViewProfile;
