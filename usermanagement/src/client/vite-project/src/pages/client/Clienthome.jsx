import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  CircularProgress,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import "../component/styles/clienthome.css";

const drawerWidth = 240;

const Clienthome = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/is-auth", { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          navigate("/login"); // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Authentication Error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/user/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box className="clienthome-container" sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f7fc" }}>
      <Drawer
        variant="permanent"
        className="clienthome-drawer"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#2c3e50", padding: "10px", color: "white" },
        }}
      >
        <Box className="clienthome-profile" sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: "#ecf0f1" }}>
            <Avatar sx={{ bgcolor: "#1abc9c" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem onClick={() => handleNavigation("/edit-profile")}>Edit Profile</MenuItem>
            <MenuItem onClick={() => handleNavigation(`/view-profile/${user?._id}`)}>View Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
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

      <Box component="main" className="clienthome-main" sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" sx={{ marginBottom: "10px", fontWeight: "bold", color: "#2c3e50" }}>Welcome, {user?.name}</Typography>
        <Typography variant="body1" sx={{ color: "#7f8c8d", textAlign: "center" }}>Select an option from the sidebar to proceed.</Typography>
      </Box>
    </Box>
  );
};

export default Clienthome;
