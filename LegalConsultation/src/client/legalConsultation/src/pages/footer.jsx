import React from "react";
import { Box, Container, Grid, Typography, IconButton, Divider } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#2c3e50", color: "white", py: 3, mt: 35 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Info */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body1">+1 234 567 890</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body1">support@lawyersystem.com</Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2">About Us</Typography>
            <Typography variant="body2">Services</Typography>
            <Typography variant="body2">Privacy Policy</Typography>
            <Typography variant="body2">Terms & Conditions</Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit">
              <LinkedInIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ backgroundColor: "white", my: 2 }} />

        {/* Copyright */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Lawyer Management System. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;