import React from "react";
import { Button, Container, Grid, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Adminhome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/register")}
              >
                User Register
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="secondary" fullWidth>
                Case Initiation
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="success" fullWidth>
                Home Page
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="warning" fullWidth>
                Lawyer Consultation
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default Adminhome;
