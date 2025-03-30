import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="body1" color="inherit" sx={{ flexGrow: 1, textAlign: "center" }}>
            © 2025 Admin Panel. All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Footer;
