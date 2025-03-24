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

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested fields like plaintiff and defendant
        if (name.startsWith("plaintiff.") || name.startsWith("defendant.")) {
            const [section, field] = name.split(".");
            setFormData((prevData) => ({
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [field]: value,
                },
            }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Legal Case Submitted:", formData);

        // Simulate API call
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
                navigate("/dashboard"); // Redirect to dashboard after submission
            } else {
                alert("Failed to create legal case. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting legal case:", error);
            alert("An error occurred while submitting the legal case.");
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
                <Typography variant="h5" gutterBottom>
                    Create Legal Case
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Case Details */}
                    <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
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

                    {/* Plaintiff Details */}
                    <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
                        Plaintiff Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Plaintiff Name"
                        name="plaintiff.plaintiffName"
                        value={formData.plaintiff.plaintiffName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Home Address"
                        name="plaintiff.plaintiffAddress[0].homeAddress"
                        value={formData.plaintiff.plaintiffAddress[0].homeAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Business Address"
                        name="plaintiff.plaintiffAddress[0].businessAddress"
                        value={formData.plaintiff.plaintiffAddress[0].businessAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="plaintiff.plaintiffContactNo"
                        value={formData.plaintiff.plaintiffContactNo}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
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
                    <TextField
                        fullWidth
                        label="NIC"
                        name="plaintiff.plaintiffNIC"
                        value={formData.plaintiff.plaintiffNIC}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="EIN"
                        name="plaintiff.plaintiffEIN"
                        value={formData.plaintiff.plaintiffEIN}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="TIN"
                        name="plaintiff.plaintiffTIN"
                        value={formData.plaintiff.plaintiffTIN}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    {/* Defendant Details */}
                    <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
                        Defendant Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Defendant Name"
                        name="defendant.defendantName"
                        value={formData.defendant.defendantName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Home Address"
                        name="defendant.defendantAddress[0].homeAddress"
                        value={formData.defendant.defendantAddress[0].homeAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Business Address"
                        name="defendant.defendantAddress[0].businessAddress"
                        value={formData.defendant.defendantAddress[0].businessAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="defendant.defendantContactNo"
                        value={formData.defendant.defendantContactNo}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
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
                    <TextField
                        fullWidth
                        label="NIC"
                        name="defendant.defendantNIC"
                        value={formData.defendant.defendantNIC}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="EIN"
                        name="defendant.defendantEIN"
                        value={formData.defendant.defendantEIN}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="TIN"
                        name="defendant.defendantTIN"
                        value={formData.defendant.defendantTIN}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    {/* Lawyer Details */}
                    <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
                        Lawyer Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Lawyer Full Name"
                        name="lawyer.LawyerFullName"
                        value={formData.lawyer.LawyerFullName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Law Firm Name"
                        name="lawyer.lawFirmName"
                        value={formData.lawyer.lawFirmName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Firm Address"
                        name="lawyer.firmAddress"
                        value={formData.lawyer.firmAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Office Address"
                        name="lawyer.contactInfo.officeAddress"
                        value={formData.lawyer.contactInfo.officeAddress}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="lawyer.contactInfo.phoneNo"
                        value={formData.lawyer.contactInfo.phoneNo}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
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
                    <TextField
                        fullWidth
                        label="Bar Association ID"
                        name="lawyer.barRegistration.barAssociationID"
                        value={formData.lawyer.barRegistration.barAssociationID}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
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
                    <RadioGroup
                        row
                        name="lawyer.representStatus"
                        value={formData.lawyer.representStatus}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="Plaintiff" control={<Radio />} label="Represents Plaintiff" />
                        <FormControlLabel value="Defendant" control={<Radio />} label="Represents Defendant" />
                    </RadioGroup>

                    {/* Submit Button */}
                    <Box mt={3}>
                        <Button variant="contained" color="primary" fullWidth type="submit">
                            Submit Legal Case
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default RegisterLegalCase;