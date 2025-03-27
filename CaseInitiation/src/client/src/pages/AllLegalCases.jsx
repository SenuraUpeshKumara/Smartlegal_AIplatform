import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import { InfoOutlined, DeleteOutline, CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// StyledCard with proper theme usage
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[10], // Ensure theme.shadows is defined
  },
}));

const AllLegalCases = () => {
  const [legalCases, setLegalCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllLegalCases = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get("http://localhost:8000/legalcase/get-all-legal-cases", {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.success) {
          setLegalCases(response.data.cases);
        } else {
          console.error("Failed to fetch legal cases:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching legal cases:", error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllLegalCases();
  }, []);

  const handleMarkAsResolved = async (caseId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/legalcase/update-case-status/${caseId}`,
        { caseStatus: "resolved" }, // Include the caseStatus field in the request body
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setLegalCases((prevCases) =>
          prevCases.map((legalCase) =>
            legalCase._id === caseId ? { ...legalCase, caseStatus: "resolved" } : legalCase
          )
        );
      } else {
        console.error("Failed to update case status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating case status:", error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDeleteClick = (caseId) => {
    setCaseToDelete(caseId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/legalcase/delete-legal-case/${caseToDelete}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setLegalCases((prevCases) => prevCases.filter((legalCase) => legalCase._id !== caseToDelete));
        navigate("/");
      } else {
        console.error("Failed to delete case:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting case:", error.response?.data?.message || "Something went wrong!");
    } finally {
      setDeleteDialogOpen(false);
      setCaseToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!legalCases || legalCases.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No legal cases found!</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Title and File a New Legal Case Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          All Legal Cases
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          startIcon={<CheckCircleOutline />}
        >
          File a New Legal Case
        </Button>
      </Box>

      <Grid container spacing={3}>
        {legalCases.map((legalCase) => (
          <Grid item xs={12} sm={6} md={4} key={legalCase._id}>
            <StyledCard elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  {legalCase.caseTitle}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Type:</strong> {legalCase.caseType}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Plaintiff:</strong> {legalCase.plaintiff.plaintiffName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Lawyer:</strong> {legalCase.lawyer.LawyerFullName}
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <strong>Status:</strong>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      ...(legalCase.caseStatus === "pending" && { bgcolor: "warning.light", color: "warning.dark" }),
                      ...(legalCase.caseStatus === "approved" && { bgcolor: "success.light", color: "success.dark" }),
                      ...(legalCase.caseStatus === "rejected" && { bgcolor: "error.light", color: "error.dark" }),
                      ...(legalCase.caseStatus === "resolved" && { bgcolor: "primary.light", color: "primary.dark" }),
                      ...(!legalCase.caseStatus && { bgcolor: "grey.300", color: "grey.800" }),
                    }}
                  >
                    {legalCase.caseStatus ? legalCase.caseStatus.charAt(0).toUpperCase() + legalCase.caseStatus.slice(1) : "Unknown"}
                  </Box>
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                <Tooltip title="View Case Details">
                  <IconButton onClick={() => navigate(`/view-legal-case/${legalCase._id}`)}>
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Case">
                  <IconButton onClick={() => handleDeleteClick(legalCase._id)} color="error">
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
                {legalCase.caseStatus !== "resolved" && (
                  <Tooltip title="Mark as Resolved">
                    <IconButton onClick={() => handleMarkAsResolved(legalCase._id)} color="primary">
                      <CheckCircleOutline />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this case?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AllLegalCases;