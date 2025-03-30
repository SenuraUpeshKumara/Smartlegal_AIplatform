import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Card, Avatar, Divider, Grid } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Profile = () => {
  const { id } = useParams();  // Get ID from URL
  const location = useLocation();  
  const navigate = useNavigate();
  
  // Get lawyer details from state or set default
  const lawyer = location.state || {};
  
  if (!lawyer || !lawyer.name) {
    return <Typography variant="h5" textAlign="center">Profile not found!</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "center", backgroundColor: "#1A2A5F", py: 4 }}>
        <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3, borderRadius: 3, boxShadow: 3, width: "80%", maxWidth: 500, textAlign: "center" }}>
          <Avatar src={lawyer.image} alt={lawyer.name} sx={{ width: 100, height: 100, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">{lawyer.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{lawyer.role}</Typography>
        </Card>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold">Contact Info</Typography>
          <Typography variant="body1">{lawyer.contact || "+94 71 4 729041"}</Typography>
          <Typography variant="body1">{lawyer.email || "email@domain.com"}</Typography>

          <Box sx={{ mt: 1 }}>
            <LinkedInIcon color="primary" sx={{ fontSize: 32, cursor: "pointer" }} />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="bold">Skills & Areas of Expertise</Typography>
          <Typography variant="body2">{lawyer.bio || "No details available"}</Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold">Professional Details</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {lawyer.description || "No additional details provided."}
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#8B1E3F", color: "#fff", "&:hover": { backgroundColor: "#6D152D" } }}
            onClick={() => navigate(`/consultation`, { state: lawyer })}
          >
            SCHEDULE A CONSULTATION
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
