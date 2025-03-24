import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Footer = () => {
  return (
    <AppBar position="fixed" color="primary" style={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <Typography variant="body1" color="inherit" style={{ flexGrow: 1, textAlign: "center" }}>
          © 2025 Admin Panel. All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
