import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Navbar = ({ handleLogout, handleDeleteAccount }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#002147" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Placeholder for layout symmetry */}
        <Box sx={{ width: "48px" }} />

        {/* Centered Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          Lawyer Dashboard
        </Typography>

        {/* Profile Icon */}
        <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
          <AccountCircleIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => navigate("/add-lawyer")}>Add Lawyer</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={handleDeleteAccount}>Delete Account</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
