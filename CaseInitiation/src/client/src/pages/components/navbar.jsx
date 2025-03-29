import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const NavBar = () => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        <Button color="inherit">Dashboard</Button>
        <Button color="inherit">Users</Button>
        <Button color="inherit">Settings</Button>
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
