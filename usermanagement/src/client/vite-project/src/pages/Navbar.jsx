import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
