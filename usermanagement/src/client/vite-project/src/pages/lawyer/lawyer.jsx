import React, { useState } from "react";
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import "../component/styles/Lawyer.css";

const Lawyer = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle the logout functionality (e.g., clear session or token)
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Lawyer Dashboard
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/view-lawyer")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2 className="dashboard-title">Lawyer Dashboard</h2>
        <div className="button-container">
          <button className="dashboard-button">View Available Time Slots</button>
          <button className="dashboard-button">View Scheduled Appointments</button>
        </div>
      </div>
    </div>
  );
};

export default Lawyer;
