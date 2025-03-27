import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ClientProfile = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/clientmanagement/get-client/:id") 
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debugging output
        setClients(data); 
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);
  
  return (
    <Box sx={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "100%", maxWidth: "900px", padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Client Profiles
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>NIC</b></TableCell>
                <TableCell><b>Case Type</b></TableCell>
                <TableCell><b>Opposer Name</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(clients) && clients.length > 0 ? (
    clients.map((client) => (
      <TableRow key={client._id}>
        <TableCell>{client.name}</TableCell>
        <TableCell>{client.nic}</TableCell>
        <TableCell>{client.casetype}</TableCell>
        <TableCell>{client.opposername}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} align="center">
        No clients found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ClientProfile;
