import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AssignmentIndOutlined,
  BusinessOutlined,
  ContactPhoneOutlined,
  EmailOutlined,
  EventNoteOutlined,
  HomeOutlined,
  GavelOutlined,
  CalendarTodayOutlined,
  PictureAsPdfOutlined,
  InsertDriveFileOutlined,
  ImageOutlined,
} from "@mui/icons-material";

const ViewCaseDetails = () => {
  const { id } = useParams(); // Extract the ID from the URL
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        // Configure Axios to include credentials if needed
        axios.defaults.withCredentials = true;
        // Fetch the case details by ID
        const response = await axios.get(`http://localhost:8000/legalcase/get-legal-case/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setCaseDetails(response.data.case); // Assuming the backend returns the case under `data.case`
        } else {
          console.error("Failed to fetch case details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching case details:", error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!caseDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Case not found!</Typography>
      </Box>
    );
  }

  // Helper function to determine file type and render appropriate icon/preview
  const renderFilePreview = (file) => {
    if (!file || typeof file !== "object") {
      console.error("Invalid file object:", file);
      return null;
    }
    const { fileName, filePath } = file; // Extract the correct fields
    if (!fileName || !filePath) {
      console.error("Missing file properties:", file);
      return null;
    }
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const fileUrl = `http://localhost:8000/${filePath.replace(/\\/g, "/")}`; // Ensure proper URL format

    if (["jpg", "jpeg", "png"].includes(fileExtension)) {
      return (
        <Box key={fileName} sx={{ mb: 2 }}>
          <Tooltip title="View Image">
            <img
              src={fileUrl}
              alt={fileName}
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </Tooltip>
        </Box>
      );
    } else if (fileExtension === "pdf") {
      return (
        <Box key={fileName} sx={{ mb: 2 }}>
          <Tooltip title="View PDF">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <PictureAsPdfOutlined sx={{ mr: 1, fontSize: "2rem", color: "red" }} />
              {fileName}
            </a>
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box key={fileName} sx={{ mb: 2 }}>
          <Tooltip title="Download File">
            <a href={fileUrl} download>
              <InsertDriveFileOutlined sx={{ mr: 1, fontSize: "2rem", color: "gray" }} />
              {fileName}
            </a>
          </Tooltip>
        </Box>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, position: "relative" }}>
      {/* View All Legal Cases Button */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          m: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/all-legal-cases")} // Adjust the route as needed
        >
          View All Legal Cases
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <h1>
            <strong className="text-blue-600">{caseDetails.caseTitle}</strong>
          </h1>
          <h4>
            <strong>Status:</strong> <span className="text-blue-600">{caseDetails.caseStatus}</span>
          </h4>
        </Box>

        {/* General Information Section */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <EventNoteOutlined sx={{ mr: 1 }} /> General Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Case Title:</strong> {caseDetails.caseTitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Case Type:</strong> {caseDetails.caseType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Case Description:</strong> {caseDetails.caseDescription}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Evidence Files Section */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Tooltip>
              <Typography variant="h6" gutterBottom>
                <ImageOutlined sx={{ mr: 1 }} /> Uploaded Evidence Files
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {caseDetails.evidenceFiles && caseDetails.evidenceFiles.length > 0 ? (
                <Box>
                  {caseDetails.evidenceFiles.length > 0 ? (
                    caseDetails.evidenceFiles.map((file) => renderFilePreview(file))
                  ) : (
                    <Typography>No evidence files uploaded.</Typography>
                  )}
                </Box>
              ) : (
                <Typography>No evidence files uploaded.</Typography>
              )}
            </Tooltip>
          </CardContent>
        </Card>

        {/* Plaintiff Information Section */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AssignmentIndOutlined sx={{ mr: 1 }} /> Plaintiff Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Name">
                  <Typography>
                    <Avatar sx={{ bgcolor: "primary.main", width: 24, height: 24, mr: 1 }}>P</Avatar>
                    <strong>Name:</strong> {caseDetails.plaintiff.plaintiffName}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Email">
                  <Typography>
                    <EmailOutlined sx={{ mr: 1 }} />
                    <strong>Email:</strong> {caseDetails.plaintiff.plaintiffEmail}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Home Address">
                  <Typography>
                    <HomeOutlined sx={{ mr: 1 }} />
                    <strong>Home Address:</strong> {caseDetails.plaintiff.plaintiffHomeAddress}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Business Address">
                  <Typography>
                    <BusinessOutlined sx={{ mr: 1 }} />
                    <strong>Business Address:</strong> {caseDetails.plaintiff.plaintiffBusinessAddress}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Contact Number">
                  <Typography>
                    <ContactPhoneOutlined sx={{ mr: 1 }} />
                    <strong>Contact Number:</strong> {caseDetails.plaintiff.plaintiffContactNo}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Plaintiff Date of Birth">
                  <Typography>
                    <CalendarTodayOutlined sx={{ mr: 1 }} />
                    <strong>Date of Birth:</strong> {caseDetails.plaintiff.plaintiffDOB}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Defendant Information Section */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AssignmentIndOutlined sx={{ mr: 1 }} /> Defendant Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Name">
                  <Typography>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 24, height: 24, mr: 1 }}>D</Avatar>
                    <strong>Name:</strong> {caseDetails.defendant.defendantName}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Email">
                  <Typography>
                    <EmailOutlined sx={{ mr: 1 }} />
                    <strong>Email:</strong> {caseDetails.defendant.defendantEmail}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Home Address">
                  <Typography>
                    <HomeOutlined sx={{ mr: 1 }} />
                    <strong>Home Address:</strong> {caseDetails.defendant.defendantHomeAddress}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Business Address">
                  <Typography>
                    <BusinessOutlined sx={{ mr: 1 }} />
                    <strong>Business Address:</strong> {caseDetails.defendant.defendantBusinessAddress}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Contact Number">
                  <Typography>
                    <ContactPhoneOutlined sx={{ mr: 1 }} />
                    <strong>Contact Number:</strong> {caseDetails.defendant.defendantContactNo}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Defendant Date of Birth">
                  <Typography>
                    <CalendarTodayOutlined sx={{ mr: 1 }} />
                    <strong>Date of Birth:</strong> {caseDetails.defendant.defendantDOB}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lawyer Information Section */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AssignmentIndOutlined sx={{ mr: 1 }} /> Lawyer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Lawyer Full Name">
                  <Typography>
                    <Avatar sx={{ bgcolor: "success.main", width: 24, height: 24, mr: 1 }}>L</Avatar>
                    <strong>Full Name:</strong> {caseDetails.lawyer.LawyerFullName}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Law Firm Name">
                  <Typography>
                    <BusinessOutlined sx={{ mr: 1 }} />
                    <strong>Firm Name:</strong> {caseDetails.lawyer.lawFirmName}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Office Address">
                  <Typography>
                    <HomeOutlined sx={{ mr: 1 }} />
                    <strong>Office Address:</strong> {caseDetails.lawyer.contactInfo.officeAddress}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Phone Number">
                  <Typography>
                    <ContactPhoneOutlined sx={{ mr: 1 }} />
                    <strong>Phone Number:</strong> {caseDetails.lawyer.contactInfo.phoneNo}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Email">
                  <Typography>
                    <EmailOutlined sx={{ mr: 1 }} />
                    <strong>Email:</strong> {caseDetails.lawyer.contactInfo.email}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Bar Association ID">
                  <Typography>
                    <GavelOutlined sx={{ mr: 1 }} />
                    <strong>Bar Association ID:</strong> {caseDetails.lawyer.barRegistration.barAssociationID}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tooltip title="Date of Admission">
                  <Typography>
                    <CalendarTodayOutlined sx={{ mr: 1 }} />
                    <strong>Date of Admission:</strong> {caseDetails.lawyer.barRegistration.dateOfAdmission}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="center">
          {caseDetails.caseStatus !== "resolved" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/update-case-details/${caseDetails._id}`)}
            >
              Update
            </Button>
          )}
          {caseDetails.caseStatus === "resolved" && (
            <Button variant="contained" color="secondary" disabled>
              Case Resolved (No Updates Allowed)
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewCaseDetails;