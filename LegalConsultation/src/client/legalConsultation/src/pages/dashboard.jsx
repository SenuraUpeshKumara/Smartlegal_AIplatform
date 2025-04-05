import React from "react";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const Dashboard = ({ handleLogout, handleDeleteAccount }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar handleLogout={handleLogout} handleDeleteAccount={handleDeleteAccount} />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Lawyer Dashboard
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/view-lawyer/67e6e3018605388e7dc8384a")}
              >
                View Lawyer
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
                View Available Time Slots
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success">
                View Scheduled Appointments
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
