import React from "react";
import { Card, CardContent, Avatar, Typography, Button, Box, Divider } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const ProfileCard = ({ lawyer }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Avatar src={lawyer.image} alt={lawyer.name} sx={{ width: 100, height: 100, mb: 2 }} />
      <Typography variant="h5" fontWeight="bold">
        {lawyer.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {lawyer.position}
      </Typography>

      {/* Contact Info */}
      <Typography variant="body1">{lawyer.phone}</Typography>
      <Typography variant="body1">{lawyer.email}</Typography>

      {/* LinkedIn */}
      <Box sx={{ mt: 1 }}>
        <LinkedInIcon color="primary" sx={{ fontSize: 32, cursor: "pointer" }} />
      </Box>

      {/* Skills */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="bold">Skills & Expertise</Typography>
      {lawyer.skills.map((skill, index) => (
        <Typography key={index} variant="body2">• {skill}</Typography>
      ))}

      {/* Description */}
      <Typography variant="body1" sx={{ mt: 2 }}>{lawyer.description}</Typography>

      {/* Schedule Consultation Button */}
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#8B1E3F", color: "#fff", "&:hover": { backgroundColor: "#6D152D" } }}
      >
        SCHEDULE A CONSULTATION
      </Button>
    </Card>
  );
};

export default ProfileCard;
