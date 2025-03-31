import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {
  return (
    <header>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: "#002147", color: "#fff", py: 1, px: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2">info@smartlegal.lk</Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography variant="body2">+94 703 013 010</Typography>
          <Typography variant="body2">+94 117 494 359</Typography>
          <IconButton sx={{ color: "#fff" }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#003366", px: 4 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            <Box component="span" sx={{ border: "2px solid #fff", borderRadius: "50%", px: 1, mr: 1 }}>S</Box>
            SMART LEGAL
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {["Home", "About Us", "Our Affiliates", "Practice Areas", "Careers", "Contact Us"].map((item) => (
              <Button key={item} sx={{ color: "#fff", textTransform: "none" }}>{item}</Button>
            ))}
          </Box>

          {/* Book Consultation Button */}
          <Button variant="contained" sx={{ backgroundColor: "#8C1C40", "&:hover": { backgroundColor: "#00152d" } }}>
            Book Consultation
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
