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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterLegalCase = () => {
    const [formData, setFormData] = useState({
        caseTitle: "",
        caseType: "",
        caseDescription: "",
        plaintiff: {
            plaintiffName: "",
            plaintiffAddress: [
                {
                    homeAddress: "",
                    businessAddress: "",
                },
            ],
            plaintiffContactNo: "",
            plaintiffEmail: "",
            plaintiffDOB: "",
            plaintiffNIC: "",
            plaintiffEIN: "",
            plaintiffTIN: "",
        },
        defendant: {
            defendantName: "",
            defendantAddress: [
                {
                    homeAddress: "",
                    businessAddress: "",
                },
            ],
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
    });

    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested fields like plaintiff and defendant
        if (name.startsWith("plaintiff.") || name.startsWith("defendant.")) {
            const [section, fieldOrIndex, subField] = name.split(/[.\[\]]/).filter(Boolean);

            if (subField) {
                // Handle array fields (e.g., plaintiffAddress[0].homeAddress)
                const index = parseInt(fieldOrIndex, 10); // Extract the array index
                setFormData((prevData) => ({
                    ...prevData,
                    [section]: {
                        ...prevData[section],
                        [fieldOrIndex]: prevData[section][fieldOrIndex].map((item, i) =>
                            i === index ? { ...item, [subField]: value } : item
                        ),
                    },
                }));
            } else {
                // Handle non-array fields (e.g., plaintiffName)
                setFormData((prevData) => ({
                    ...prevData,
                    [section]: {
                        ...prevData[section],
                        [fieldOrIndex]: value,
                    },
                }));
            }
        } else if (name.startsWith("lawyer.contactInfo.")) {
            const [section, subSection, field] = name.split(".");
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
        } else if (name.startsWith("lawyer.barRegistration.")) {
            const [section, subSection, field] = name.split(".");
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
                [name]: value,
            }));
        }
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Legal Case Submitted:", formData);
        try {
            const response = await fetch("http://localhost:5000/legalcase/create-legal-case", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Legal case created successfully!");
                navigate("/dashboard");
            } else {
                alert("Failed to create legal case. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting legal case:", error);
            alert("An error occurred while submitting the legal case.");
        }
    };

    const steps = ["Case Details", "Plaintiff Details", "Defendant Details", "Lawyer Details"];

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
                            {/* Two-column layout */}
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
                                    name="plaintiff.plaintiffAddress[0].homeAddress"
                                    value={formData.plaintiff.plaintiffAddress[0].homeAddress}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Business Address"
                                    name="plaintiff.plaintiffAddress[0].businessAddress"
                                    value={formData.plaintiff.plaintiffAddress[0].businessAddress}
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
                            {/* Three-column layout */}
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
                            {/* Two-column layout */}
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
                                    name="defendant.defendantAddress[0].homeAddress"
                                    value={formData.defendant.defendantAddress[0].homeAddress}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Business Address"
                                    name="defendant.defendantAddress[0].businessAddress"
                                    value={formData.defendant.defendantAddress[0].businessAddress}
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
                            {/* Three-column layout */}
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
                        {/* Law Firm Details */}
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
                        {/* Personal Contact Information */}
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
                        {/* Bar Registration Details */}
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
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
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
                        >
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default RegisterLegalCase;