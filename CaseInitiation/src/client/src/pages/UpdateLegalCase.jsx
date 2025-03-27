import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";

const UpdateLegalCase = () => {
  const { id } = useParams(); // Extract the case ID from the URL
  const [caseDetails, setCaseDetails] = useState(null);
  const [newEvidenceFiles, setNewEvidenceFiles] = useState([]);
  const navigate = useNavigate();

  // Fetch case details
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/legalcase/get-legal-case/${id}`);
        if (response.data.success) {
          setCaseDetails(response.data.case);
        } else {
          toast.error("Failed to fetch case details.");
        }
      } catch (error) {
        toast.error("Error fetching case details.");
      }
    };
    fetchCaseDetails();
  }, [id]);

  // Handle file uploads
  const onDrop = (acceptedFiles) => {
    setNewEvidenceFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newEvidenceFiles.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      newEvidenceFiles.forEach((file) => {
        formData.append("evidenceFiles", file);
      });

      const response = await axios.patch(
        `http://localhost:8000/legalcase/add-evidence/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Evidence added successfully!");
        navigate(`/view-legal-case/${id}`); // Redirect to view case details
      } else {
        toast.error(response.data.message || "Failed to add evidence.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (!caseDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add Additional Evidence
        </Typography>

        {/* Case Title */}
        <Typography variant="h6" gutterBottom>
          Case Title: {caseDetails.caseTitle}
        </Typography>

        {/* File Upload Section */}
        <Box {...getRootProps()} sx={{
          border: "2px dashed #ccc",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "20px",
        }}>
          <input {...getInputProps()} />
          <Typography variant="body1">Drag & drop files here, or click to select files</Typography>
          <Typography variant="caption" color="textSecondary">
            Supported formats: PDF, JPG, PNG
          </Typography>
        </Box>

        {/* List of Uploaded Files */}
        {newEvidenceFiles.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Uploaded Files:</Typography>
            <ul>
              {newEvidenceFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* Submit Button */}
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={newEvidenceFiles.length === 0}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateLegalCase;