import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CardMedia, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Adam Foster",
    role: "Consultant",
    category: "Alllll",
    image: "/images/Adam-F.jpg",
    bio: "Expert in legal consulting with a strong background in corporate law and compliance.",
    description: "Adam provides strategic legal advice to clients, helping them navigate complex legal matters efficiently."
  },
  {
    name: "Adam Ringel",
    role: "Senior Consultant",
    category: "Senior Consultant",
    image: "/images/Adam-r.jpg",
    bio: "Specialist in business law, focusing on contract negotiations and corporate governance.",
    description: "Adam assists businesses in drafting contracts, handling disputes, and ensuring legal compliance in corporate operations."
  },
  {
    name: "Alex Palzewicz",
    role: "Enterprise Consultant",
    category: "Consultant",
    image: "/images/Alex-P.jpg",
    bio: "Focuses on corporate litigation and dispute resolution for large enterprises.",
    description: "Alex works closely with corporate clients to develop legal strategies and resolve complex business disputes."
  },
  {
    name: "Alexandra Furr",
    role: "Senior Consultant",
    category: "Senior Consultant",
    image: "/images/Alex-F.jpg",
    bio: "Advisor on business operations with a deep understanding of regulatory frameworks.",
    description: "Alexandra helps businesses optimize their legal processes and ensure compliance with evolving regulations."
  },
  {
    name: "Barron K. Henly",
    role: "Consultant",
    category: "Consultant",
    image: "/images/AffinityTeam-Barronv2.jpg",
    bio: "Legal expert specializing in intellectual property and trademark law.",
    description: "Barron assists startups and enterprises in securing their intellectual assets and protecting their brand identity."
  },
  {
    name: "Carla Anderson",
    role: "Enterprise Project Analyst",
    category: "Analyst",
    image: "/images/profile-pic-web.jpg",
    bio: "Experienced analyst specializing in risk management and business process improvement.",
    description: "Carla analyzes legal risks and develops strategic insights to enhance business operations and compliance."
  },
  {
    name: "Chad Fox",
    role: "Business Consultant",
    category: "Consultant",
    image: "/images/Chad-Fox_Team-Member.png",
    bio: "Expert in business development and financial planning for legal firms.",
    description: "Chad works with legal professionals to streamline operations and improve financial performance."
  },
  {
    name: "Debbie Foster",
    role: "Chief Executive Consultant",
    category: "Senior Consultant",
    image: "/images/AffinityTeam-Debbie-1.jpg",
    bio: "Visionary leader in legal consulting, focusing on firm growth and innovation.",
    description: "Debbie leads strategic initiatives to modernize legal services and improve efficiency across the firm."
  }
];


const categories = ["All", "Senior Consultant", "Consultant", "Analyst"];

const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate(); // Use React Router for navigation

  const filteredTeam = teamMembers.filter(
    (member) =>
      (selectedCategory === "All" || member.category === selectedCategory) &&
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mt: 4, color: "#0a2a66" }}>
        Our Team of Experts
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
        Experienced Advisors. Dedicated to Your Success.
      </Typography>

      <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
        <TextField 
          variant="outlined" 
          placeholder="Search by Name" 
          size="small" 
          onChange={(e) => setSearchTerm(e.target.value)} 
          sx={{ width: "50%", mr: 1 }} 
        />
        <Button variant="contained" color="primary">Search</Button>
      </Box>

      <Box display="flex" justifyContent="center" sx={{ gap: 1, mb: 3 }}>
        {categories.map((category) => (
          <Chip 
            key={category} 
            label={category} 
            variant={selectedCategory === category ? "filled" : "outlined"} 
            color="primary" 
            onClick={() => setSelectedCategory(category)} 
            sx={{ cursor: "pointer" }} 
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredTeam.map((member) => (
          <Grid item xs={12} sm={6} md={3} key={member.id}>
            <Card 
              sx={{ boxShadow: 3, textAlign: "center", cursor: "pointer" }}
              onClick={() => navigate(`/profile`, { state: member })}
            >
              <CardMedia component="img" height="160" image={member.image} alt={member.name} />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{member.name}</Typography>
                <Typography variant="body2" color="textSecondary">{member.role}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Team;
