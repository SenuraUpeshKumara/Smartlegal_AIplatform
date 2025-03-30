import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import NavBar from "../components/navbar";
import Footer from "../components/footer";

const RegisterLegalCase = () => {
  const [formData, setFormData] = useState({
    caseTitle: "",
    caseType: "",
    caseDescription: "",
    plaintiff: {
      plaintiffName: "",
      plaintiffHomeAddress: "",
      plaintiffBusinessAddress: "",
      plaintiffContactNo: "",
      plaintiffEmail: "",
      plaintiffDOB: "",
      plaintiffNIC: "",
      plaintiffEIN: "",
      plaintiffTIN: "",
    },
    defendant: {
      defendantName: "",
      defendantHomeAddress: "",
      defendantBusinessAddress: "",
      defendantContactNo: "",
      defendantEmail: "",
      defendantDOB: "",
      defendantNIC: "",
      defendantEIN: "",
      defendantTIN: "",
    },
    lawyer: {
      LawyerFullName: "",
      lawFirmName: "",
      firmAddress: "",
      contactInfo: {
        officeAddress: "",
        phoneNo: "",
        email: "",
      },
      barRegistration: {
        barAssociationID: "",
        dateOfAdmission: "",
      },
      representStatus: "Plaintiff",
    },
    evidenceFiles: [],
  });
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "caseTitle":
        if (!value.trim()) newErrors.caseTitle = "Case Title is required.";
        else delete newErrors.caseTitle;
        break;
      case "caseType":
        if (!value.trim()) newErrors.caseType = "Case Type is required.";
        else delete newErrors.caseType;
        break;
      case "plaintiff.plaintiffEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors["plaintiff.plaintiffEmail"] = "Invalid email address.";
        else delete newErrors["plaintiff.plaintiffEmail"];
        break;
      case "plaintiff.plaintiffContactNo":
        if (!/^\d{10}$/.test(value))
          newErrors["plaintiff.plaintiffContactNo"] =
            "Contact number must be 10 digits.";
        else delete newErrors["plaintiff.plaintiffContactNo"];
        break;
      case "plaintiff.plaintiffNIC":
        if (!/^\d{9}[VX]$/.test(value.toUpperCase()))
          newErrors["plaintiff.plaintiffNIC"] = "Invalid NIC format.";
        else delete newErrors["plaintiff.plaintiffNIC"];
        break;
      case "plaintiff.plaintiffEIN":
        if (!/^\d{9}$/.test(value))
          newErrors["plaintiff.plaintiffEIN"] = "EIN must be 9 digits.";
        else delete newErrors["plaintiff.plaintiffEIN"];
        break;
      case "plaintiff.plaintiffTIN":
        if (!/^\d{10}$/.test(value))
          newErrors["plaintiff.plaintiffTIN"] = "TIN must be 10 digits.";
        else delete newErrors["plaintiff.plaintiffTIN"];
        break;
      case "defendant.defendantEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors["defendant.defendantEmail"] = "Invalid email address.";
        else delete newErrors["defendant.defendantEmail"];
        break;
      case "defendant.defendantContactNo":
        if (!/^\d{10}$/.test(value))
          newErrors["defendant.defendantContactNo"] =
            "Contact number must be 10 digits.";
        else delete newErrors["defendant.defendantContactNo"];
        break;
      case "defendant.defendantNIC":
        if (!/^\d{9}[VX]$/.test(value.toUpperCase()))
          newErrors["defendant.defendantNIC"] = "Invalid NIC format.";
        else delete newErrors["defendant.defendantNIC"];
        break;
      case "defendant.defendantEIN":
        if (!/^\d{9}$/.test(value))
          newErrors["defendant.defendantEIN"] = "EIN must be 9 digits.";
        else delete newErrors["defendant.defendantEIN"];
        break;
      case "defendant.defendantTIN":
        if (!/^\d{10}$/.test(value))
          newErrors["defendant.defendantTIN"] = "TIN must be 10 digits.";
        else delete newErrors["defendant.defendantTIN"];
        break;
      case "lawyer.LawyerFullName":
        if (!value.trim())
          newErrors["lawyer.LawyerFullName"] = "Lawyer Full Name is required.";
        else delete newErrors["lawyer.LawyerFullName"];
        break;
      case "lawyer.contactInfo.email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors["lawyer.contactInfo.email"] = "Invalid email address.";
        else delete newErrors["lawyer.contactInfo.email"];
        break;
      case "lawyer.contactInfo.phoneNo":
        if (!/^\d{10}$/.test(value))
          newErrors["lawyer.contactInfo.phoneNo"] =
            "Phone number must be 10 digits.";
        else delete newErrors["lawyer.contactInfo.phoneNo"];
        break;
      case "lawyer.barRegistration.barAssociationID":
        if (!/^\d{6}$/.test(value))
          newErrors["lawyer.barRegistration.barAssociationID"] =
            "Bar Association ID must be 6 digits.";
        else delete newErrors["lawyer.barRegistration.barAssociationID"];
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state
    if (name.startsWith("plaintiff.") || name.startsWith("defendant.")) {
      const [section, field] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    } else if (name.startsWith("lawyer.")) {
      const [section, subSection, field] = name.split(".");
      if (subSection === "contactInfo") {
        setFormData((prevData) => ({
          ...prevData,
          lawyer: {
            ...prevData.lawyer,
            contactInfo: {
              ...prevData.lawyer.contactInfo,
              [field]: value,
            },
          },
        }));
      } else if (subSection === "barRegistration") {
        setFormData((prevData) => ({
          ...prevData,
          lawyer: {
            ...prevData.lawyer,
            barRegistration: {
              ...prevData.lawyer.barRegistration,
              [field]: value,
            },
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          lawyer: {
            ...prevData.lawyer,
            [subSection]: value,
          },
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Validate field
    validateField(name, value);
  };

  // Handle file uploads
  const onDrop = (acceptedFiles) => {
    setFormData((prevData) => ({
      ...prevData,
      evidenceFiles: [...prevData.evidenceFiles, ...acceptedFiles],
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("caseTitle", formData.caseTitle);
      formDataToSend.append("caseType", formData.caseType);
      formDataToSend.append("caseDescription", formData.caseDescription);
      formDataToSend.append("plaintiff", JSON.stringify(formData.plaintiff));
      formDataToSend.append("defendant", JSON.stringify(formData.defendant));
      formDataToSend.append("lawyer", JSON.stringify(formData.lawyer));
      formData.evidenceFiles.forEach((file) => {
        formDataToSend.append("evidenceFiles", file);
      });

      const { data } = await axios.post(
        "http://localhost:8000/legalcase/create-legal-case",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success("Legal case created successfully!");
        navigate(`/view-legal-case/${data.data.id}`);
      } else {
        toast.error(data.message || "Failed to create legal case.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Case Details",
    "Plaintiff Details",
    "Defendant Details",
    "Lawyer Details",
    "Upload Evidence",
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Case Details
            </Typography>
            <TextField
              fullWidth
              label="Case Title"
              name="caseTitle"
              value={formData.caseTitle}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.caseTitle}
              helperText={errors.caseTitle}
            />
            <TextField
              fullWidth
              label="Case Type"
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.caseType}
              helperText={errors.caseType}
            />
            <TextField
              fullWidth
              label="Case Description"
              name="caseDescription"
              value={formData.caseDescription}
              onChange={handleChange}
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Plaintiff Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Plaintiff Name"
                  name="plaintiff.plaintiffName"
                  value={formData.plaintiff.plaintiffName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="plaintiff.plaintiffEmail"
                  type="email"
                  value={formData.plaintiff.plaintiffEmail}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["plaintiff.plaintiffEmail"]}
                  helperText={errors["plaintiff.plaintiffEmail"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Home Address"
                  name="plaintiff.plaintiffHomeAddress"
                  value={formData.plaintiff.plaintiffHomeAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Address"
                  name="plaintiff.plaintiffBusinessAddress"
                  value={formData.plaintiff.plaintiffBusinessAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="plaintiff.plaintiffContactNo"
                  value={formData.plaintiff.plaintiffContactNo}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["plaintiff.plaintiffContactNo"]}
                  helperText={errors["plaintiff.plaintiffContactNo"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="plaintiff.plaintiffDOB"
                  type="date"
                  value={formData.plaintiff.plaintiffDOB}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="NIC"
                  name="plaintiff.plaintiffNIC"
                  value={formData.plaintiff.plaintiffNIC}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["plaintiff.plaintiffNIC"]}
                  helperText={errors["plaintiff.plaintiffNIC"]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="EIN"
                  name="plaintiff.plaintiffEIN"
                  value={formData.plaintiff.plaintiffEIN}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["plaintiff.plaintiffEIN"]}
                  helperText={errors["plaintiff.plaintiffEIN"]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="TIN"
                  name="plaintiff.plaintiffTIN"
                  value={formData.plaintiff.plaintiffTIN}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["plaintiff.plaintiffTIN"]}
                  helperText={errors["plaintiff.plaintiffTIN"]}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Defendant Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Defendant Name"
                  name="defendant.defendantName"
                  value={formData.defendant.defendantName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="defendant.defendantEmail"
                  type="email"
                  value={formData.defendant.defendantEmail}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["defendant.defendantEmail"]}
                  helperText={errors["defendant.defendantEmail"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Home Address"
                  name="defendant.defendantHomeAddress"
                  value={formData.defendant.defendantHomeAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Address"
                  name="defendant.defendantBusinessAddress"
                  value={formData.defendant.defendantBusinessAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="defendant.defendantContactNo"
                  value={formData.defendant.defendantContactNo}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["defendant.defendantContactNo"]}
                  helperText={errors["defendant.defendantContactNo"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="defendant.defendantDOB"
                  type="date"
                  value={formData.defendant.defendantDOB}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="NIC"
                  name="defendant.defendantNIC"
                  value={formData.defendant.defendantNIC}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["defendant.defendantNIC"]}
                  helperText={errors["defendant.defendantNIC"]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="EIN"
                  name="defendant.defendantEIN"
                  value={formData.defendant.defendantEIN}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["defendant.defendantEIN"]}
                  helperText={errors["defendant.defendantEIN"]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="TIN"
                  name="defendant.defendantTIN"
                  value={formData.defendant.defendantTIN}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["defendant.defendantTIN"]}
                  helperText={errors["defendant.defendantTIN"]}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Lawyer Details
            </Typography>
            <RadioGroup
              row
              name="lawyer.representStatus"
              value={formData.lawyer.representStatus}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Plaintiff"
                control={<Radio />}
                label="Represents Plaintiff"
              />
              <FormControlLabel
                value="Defendant"
                control={<Radio />}
                label="Represents Defendant"
              />
            </RadioGroup>
            <TextField
              fullWidth
              label="Lawyer Full Name"
              name="lawyer.LawyerFullName"
              value={formData.lawyer.LawyerFullName}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors["lawyer.LawyerFullName"]}
              helperText={errors["lawyer.LawyerFullName"]}
            />
            <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
              Law Firm Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Firm Name"
                  name="lawyer.lawFirmName"
                  value={formData.lawyer.lawFirmName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Firm Address"
                  name="lawyer.firmAddress"
                  value={formData.lawyer.firmAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
              Personal Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Office Address"
                  name="lawyer.contactInfo.officeAddress"
                  value={formData.lawyer.contactInfo.officeAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="lawyer.contactInfo.phoneNo"
                  value={formData.lawyer.contactInfo.phoneNo}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["lawyer.contactInfo.phoneNo"]}
                  helperText={errors["lawyer.contactInfo.phoneNo"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="lawyer.contactInfo.email"
                  type="email"
                  value={formData.lawyer.contactInfo.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors["lawyer.contactInfo.email"]}
                  helperText={errors["lawyer.contactInfo.email"]}
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
              Bar Registration Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bar Association ID"
                  name="lawyer.barRegistration.barAssociationID"
                  value={formData.lawyer.barRegistration.barAssociationID}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={
                    !!errors["lawyer.barRegistration.barAssociationID"]
                  }
                  helperText={
                    errors["lawyer.barRegistration.barAssociationID"]
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Admission"
                  name="lawyer.barRegistration.dateOfAdmission"
                  type="date"
                  value={formData.lawyer.barRegistration.dateOfAdmission}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Evidence
            </Typography>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "4px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body1">
                Drag & drop files here, or click to select files
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supported formats: PDF, JPG, PNG
              </Typography>
            </Box>
            {formData.evidenceFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Uploaded Files:</Typography>
                <ul>
                  {formData.evidenceFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <NavBar />
      {/* Main Content */}
      <Paper elevation={3} style={{ padding: "20px", marginTop: "130px", marginBottom: "150px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Legal Case
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              type="button"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={formData.evidenceFiles.length === 0}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                type="button"
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      {/* Footer */}
      <Footer />
    </Container>
  );
};

export default RegisterLegalCase;