import React, { useState } from "react";
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
    AppBar,
    Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone"; // Import react-dropzone for file uploads
import Footer from "../components/footer";
import NavBar from "../components/navbar";

// // Navbar Component
// const Navbar = () => {
//     const navigate = useNavigate();

//     return (
//         <AppBar position="static">
//             <Toolbar>
//                 <Typography variant="h6" style={{ flexGrow: 1 }}>
//                     Admin Panel
//                 </Typography>
//                 <Button color="inherit" onClick={() => navigate("/login")}>
//                     Logout
//                 </Button>
//             </Toolbar>
//         </AppBar>
//     );
// };

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
        evidenceFiles: [], // Add this field to store uploaded files
    });
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes for nested fields
    const handleChange = (e) => {
        const { name, value } = e.target;
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
    };

    // Handle file uploads
    const onDrop = (acceptedFiles) => {
        setFormData((prevData) => ({
            ...prevData,
            evidenceFiles: [...prevData.evidenceFiles, ...acceptedFiles], // Append new files
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
        setLoading(true); // Indicate loading state
        try {
            // Create a FormData object
            const formDataToSend = new FormData();
            // Append non-file fields to FormData
            formDataToSend.append("caseTitle", formData.caseTitle);
            formDataToSend.append("caseType", formData.caseType);
            formDataToSend.append("caseDescription", formData.caseDescription);
            // Append nested objects as JSON strings
            formDataToSend.append("plaintiff", JSON.stringify(formData.plaintiff));
            formDataToSend.append("defendant", JSON.stringify(formData.defendant));
            formDataToSend.append("lawyer", JSON.stringify(formData.lawyer));
            // Append files to FormData
            formData.evidenceFiles.forEach((file) => {
                formDataToSend.append("evidenceFiles", file);
            });
            // Configure Axios to include credentials
            axios.defaults.withCredentials = true;
            // Send the POST request to the backend with multipart/form-data
            const { data } = await axios.post(
                "http://localhost:8000/legalcase/create-legal-case",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
                    },
                }
            );
            // Handle success response
            if (data.success) {
                toast.success("Legal case created successfully!");
                // Extract the _id from the response
                const caseId = data.data.id;
                // Navigate to the ViewDetails page with the case ID
                navigate(`/view-legal-case/${caseId}`);
            } else {
                toast.error(data.message || "Failed to create legal case.");
            }
        } catch (error) {
            // Handle error response
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Stop loading state
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
                        />
                        <TextField
                            fullWidth
                            label="Case Type"
                            name="caseType"
                            value={formData.caseType}
                            onChange={handleChange}
                            margin="normal"
                            required
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
                            required
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
                            type="button" // Prevent form submission
                        >
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={formData.evidenceFiles.length === 0} // Disable submit if no files are uploaded
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                type="button" // Prevent form submission
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