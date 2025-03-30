import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  Avatar,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Consultation = () => {
  const { id } = useParams();
  const location = useLocation();
  const lawyer = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [consultationResult, setConsultationResult] = useState(null);

  // State variables
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    emailemail: "",
    phoneNumber: "",
    consultationType: "",
    remark: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);  // New state for success message

  const consultationTypes = [
    { value: "Legal Advice", label: "Legal Advice" },
    { value: "Case Evaluation", label: "Case Evaluation" },
    { value: "Document Review", label: "Document Review" },
    { value: "Other", label: "Other" },
  ];

  const timeSlots = [
    { time: "09:00 - 10:00", available: true },
    { time: "10:30 - 11:30", available: false },
    { time: "14:00 - 15:00", available: true },
    { time: "16:00 - 17:00", available: true },
  ];

  const handleTimeSlotClick = (slot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.time);
      setFormVisible(true); // Show the form when a time is selected
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  // const handleConfirmAppointment = async () => {
  //   const submissionData = {
  //     ...formData,
  //     date: selectedDate.toLocaleDateString("en-US"),
  //     timeSlot: selectedTimeSlot,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:8000/consultation/create", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(submissionData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setShowSuccessDialog(true); // Show success dialog
  //       setShowConfirmationModal(false); // Close the confirmation modal
  //       setFormVisible(false); // Hide the form
  //       setFormData({
  //         fullName: "",
  //         email: "",
  //         phoneNumber: "",
  //         consultationType: "",
  //         remark: "",
  //       });
  //       // Redirect to the appointment page with the correct ID
      
  //     } else {
  //       alert(`Error: ${data.message}`);

  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Something went wrong. Please try again.");
  //   }
  // };

  const handleConfirmAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
  
    const consultationData = {
      ...formData,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    };
  
    try {
      const response = await fetch("http://localhost:8000/consultation/create-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationData),
      });
  
      // Ensure response is valid JSON
      const text = await response.text();
      console.log("Raw response:", text); // Debugging step
  
      try {
        const result = JSON.parse(text);
        console.log("Parsed JSON:", result); // Debugging step
  
        if (response.ok && result.consultationId) {
          setMessage({ type: "success", text: "Consultation scheduled successfully!" });
          setFormVisible(false);
          setShowSuccessDialog(true); // Show success dialog
          setShowConfirmationModal(false); // Close the confirmation modal
          setFormVisible(false);
          setSelectedDate(null);
          setSelectedTimeSlot(null);
          setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            consultationType: "",
            remark: "",
          });

          setConsultationResult(result); // Save the result in state
  
          // Redirect to ViewConsultation page with the correct ID
          
        } else {
          setMessage({ type: "error", text: result.message || "Failed to schedule consultation" });
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        setMessage({ type: "error", text: "Unexpected response from server" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = () => {
    setSelectedDate(null);  // Reset the selected date
    setSelectedTimeSlot(null);  // Reset the selected time slot
    setFormVisible(false);  // Hide the form to let the user choose a new date and time
  };

  const handleCancelAppointment = () => {
    setShowConfirmationModal(false); // Close the modal
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false); // Close the success dialog
  };

  if (!lawyer || !lawyer.name) {
    return <Typography variant="h5" textAlign="center">Consultation details not found!</Typography>;
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ textAlign: "center", backgroundColor: "#1A2A5F", py: 4, color: "#fff", borderRadius: "10px", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Request a Consultation</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Ready to elevate your practice? Get in touch today for a free consultation!
        </Typography>
      </Box>

      {/* Lawyer Profile Card */}
      <Box sx={{ textAlign: "center", my: 4, display: "flex", justifyContent: "center" }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, width: "400px" }}>
          <Avatar src={lawyer.image || "/default-profile.png"} alt={lawyer.name} sx={{ width: 80, height: 80, mb: 2, margin: "0 auto" }} />
          <Typography variant="h5">{lawyer.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{lawyer.role}</Typography>
        </Card>
      </Box>

      {/* Consultation Scheduling Section */}
      {!formVisible ? (
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <CalendarMonthIcon fontSize="medium" /> Please select an available date
              </Typography>
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline minDate={new Date()} />
            </Box>
            <Box sx={{ flex: 1 }}>
              {selectedDate ? (
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
                  <Typography variant="h6">{selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No date selected"}</Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}>
                    <AccessTimeIcon fontSize="small" /> Available Slots:
                  </Typography>
                  {timeSlots.map((slot, index) => (
                    <Box key={index} sx={{ mt: 1 }}>
                      <Button
                        variant="outlined"
                        color={selectedTimeSlot === slot.time ? "primary" : "default"}
                        disabled={!slot.available}
                        sx={{ width: "100%", textTransform: "none", display: "flex", justifyContent: "center", gap: 1 }}
                        onClick={() => handleTimeSlotClick(slot)}
                      >
                        {slot.time} {slot.available ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                      </Button>
                    </Box>
                  ))}
                </Card>
              ) : (
                <Typography variant="body2">
                  Choose an available date and time for your consultation to schedule a meeting with our trusted legal experts at your convenience.
                </Typography>
              )}
            </Box>
          </Box>
        </Card>
      ) : (
        // Consultation Form
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No date selected"}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
              {selectedTimeSlot}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} margin="normal" required />
            <TextField fullWidth select label="Consultation Type" name="consultationType" value={formData.consultationType} onChange={handleChange} margin="normal" required>
              {consultationTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField fullWidth label="Remark" name="remark" value={formData.remark} onChange={handleChange} margin="normal" multiline rows={3} />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#8C1C40",
                width: "200px",
                fontSize: "14px",
                padding: "8px 16px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                "&:hover": { backgroundColor: "#70132E" },
              }}
            >
              Submit
            </Button>
          </form>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onClose={handleCancelAppointment}>
        <DialogTitle>Confirm Your Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No date selected"}</Typography>
          <Typography variant="body1"><strong>Time:</strong> {selectedTimeSlot}</Typography>
          <Typography variant="body1"><strong>Lawyer:</strong> {lawyer.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmAppointment} color="primary">Confirm</Button>
          <Button onClick={handleCancelAppointment} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
  <DialogTitle>Appointment Confirmed!</DialogTitle>
  <DialogContent>
    <Typography variant="body1">
      Your virtual consultation has been successfully booked.
      A confirmation email with the Zoom link has been sent.
      You can view or manage your appointment anytime.
    </Typography>
  </DialogContent>
  <DialogActions>
  <Button 
  onClick={() => { 
    handleCloseSuccessDialog();
    setTimeout(() => {
      
      navigate(`/appointment/${consultationResult.consultationId}`); // Redirect to the new AppDetails page
    }, 100); // Small delay to ensure the modal is fully closed before redirection
  }} 
  color="primary"
>
  View Appointment
</Button>


    <Button onClick={handleCloseSuccessDialog} color="secondary">Close</Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default Consultation;