import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import "../component/styles/clienthome.css";

const drawerWidth = 240;

const Clienthome = ({ clientId }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="clienthome-container" sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f7fc" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        className="clienthome-drawer"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#2c3e50", padding: "10px", color: "white" },
        }}
      >
        {/* Profile Section */}
        <Box className="clienthome-profile" sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: "#ecf0f1" }}>
            <Avatar sx={{ bgcolor: "#1abc9c" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem onClick={() => handleNavigation("/edit-profile")}>Edit Profile</MenuItem>
            {/* Fix: Pass clientId dynamically */}
            <MenuItem onClick={() => handleNavigation(`/view-profile/${clientId}`)}>View Profile</MenuItem>

            <MenuItem onClick={() => console.log("Delete Account")}>Delete Account</MenuItem>
          </Menu>
        </Box>
        
        <Box className="clienthome-header" sx={{ textAlign: "center", my: 2, fontWeight: "bold" }}>
          <Typography variant="h6" sx={{ color: "#ecf0f1" }}>Client Dashboard</Typography>
        </Box>
        <List>
          {[ 
            { text: "Add Client", route: "/addclient" },
            { text: "Client Profile", route: "/clientprofile" },
            { text: "View Appointments", route: "/appointments" },
            { text: "Case Initiation", route: "/case-initiation" }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                className="clienthome-button"
                sx={{ padding: "12px", borderRadius: "5px", transition: "0.3s", backgroundColor: "#34495e", '&:hover': { backgroundColor: "#1abc9c" } }}
                onClick={() => handleNavigation(item.route)}
              >
                <ListItemText primary={item.text} sx={{ color: "#ecf0f1", fontSize: "16px" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content Area */}
      <Box component="main" className="clienthome-main" sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" sx={{ marginBottom: "10px", fontWeight: "bold", color: "#2c3e50" }}>Welcome to the Client Home</Typography>
        <Typography variant="body1" sx={{ color: "#7f8c8d", textAlign: "center" }}>Select an option from the sidebar to proceed.</Typography>
      </Box>
    </Box>
  );
};




export default Clienthome;
