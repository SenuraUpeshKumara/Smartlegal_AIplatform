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
    email: "",
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


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [consultationError, setConsultationError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (value === "") {
      setEmailError(""); // No error while typing (until submission)
    } else if (!emailPattern.test(value)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError(""); // Clear error if valid
    }
  
    handleChange(e);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
  
    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      handleChange(e);
    }
  
    // Show error when input is invalid
    if (value.length > 0 && value.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
    } else {
      setPhoneError("");
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  
    let isValid = true; // Track if form is valid
  
    // Validate Phone Number
    if (formData.phoneNumber.trim() === "") {
      setPhoneError("Phone number is required.");
      isValid = false;
    } else if (formData.phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      isValid = false;
    } else {
      setPhoneError(""); // Clear error if valid
    }
  
    // Validate Consultation Type
    if (!formData.consultationType) {
      setConsultationError("Please select a consultation type.");
      isValid = false;
    } else {
      setConsultationError(""); // Clear error if valid
    }
  
    // Proceed with form submission if all validations pass
    if (isValid) {
      console.log("Form submitted successfully!");
      // Add your submission logic here
    }
  };
  

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
    navigate("/");
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
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: 4, backgroundColor: "#f9f9f9" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          {/* Date Picker Section */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2, fontWeight: "bold", color: "#1A2A5F" }}>
              <CalendarMonthIcon fontSize="medium" /> Select an Available Date
            </Typography>
            <Box
              sx={{
                p: 2,
                border: "2px solid #1A2A5F",
                borderRadius: "12px",
                display: "inline-block",
                backgroundColor: "#fff",
                boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                minDate={new Date()}
                calendarClassName="custom-calendar"
              />
            </Box>
          </Box>
      
          {/* Time Slot Selection */}
          <Box sx={{ width: "100%" }}>
            {selectedDate ? (
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#8C1C40" }}>
                  {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontSize: "16px", fontWeight: "bold" }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "#1A2A5F" }} />
                  Available Time Slots:
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2, mt: 2 }}>
  {timeSlots.map((slot, index) => (
    <Button
      key={index}
      variant="contained"
      disabled={!slot.available}
      sx={{
        textTransform: "none",
        fontSize: "14px",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: slot.available ? "2px 2px 6px rgba(0,0,0,0.1)" : "none",
        backgroundColor: slot.available
          ? selectedTimeSlot === slot.time
            ? "#8C1C40" // Dark Red for selected
            : "#C8E6C9" // Light Green for available
          : "#FFCCCC", // Light Red for unavailable
        color: slot.available ? "#2E7D32" : "#888",
        "&:hover": slot.available
          ? { backgroundColor: "#388E3C", color: "#fff" } // Dark Green on hover
          : {},
      }}
      onClick={() => handleTimeSlotClick(slot)}
    >
      {slot.time} {slot.available ? <CheckCircleIcon sx={{ ml: 1 }} /> : <CancelIcon sx={{ ml: 1 }} />}
    </Button>
  ))}
</Box>

              </Card>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", color: "#555", fontStyle: "italic" }}>
                Please choose a date first to view available time slots.
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
      
      ) : (
        // Consultation Form
        <Card sx={{ 
          p: 4, 
          borderRadius: "12px", 
          boxShadow: 4, 
          bgcolor: "#F9FAFB", 
          maxWidth: "500px", 
          mx: "auto", 
          textAlign: "center" 
        }}>
          {/* Selected Date & Time Display */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="#333">
              {selectedDate 
                ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) 
                : "No date selected"}
            </Typography>
            <Typography variant="h6" fontWeight="medium" color="#555" sx={{ mt: 1 }}>
              {selectedTimeSlot || "No time selected"}
            </Typography>
          </Box>
        
          {/* Form */}
          <form onSubmit={handleSubmit}>
          <TextField
  fullWidth
  label="Full Name"
  name="fullName"
  value={formData.fullName}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value) && value.length <= 50) {
      handleChange(e);
    }
  }}
  margin="normal"
  required
  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
  error={isSubmitted && (formData.fullName === "" || !/^[A-Za-z\s]+$/.test(formData.fullName))}
  helperText={
    isSubmitted && formData.fullName === ""
      ? "Please fill this field."
      : !/^[A-Za-z\s]+$/.test(formData.fullName)
      ? "Only letters and spaces are allowed."
      : ""
  }
/>

        
<TextField
  fullWidth
  label="Email Address"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleEmailChange}
  margin="normal"
  required
  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
  error={isSubmitted && formData.email === "" || emailError !== ""}
  helperText={
    isSubmitted && formData.email === ""
      ? "Please fill this field."
      : emailError
  }
/>
        
<TextField
  fullWidth
  label="Phone Number"
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handlePhoneChange}
  margin="normal"
  required
  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
  error={isSubmitted && (phoneError !== "" || formData.phoneNumber.trim() === "")}
  helperText={isSubmitted ? phoneError : ""}
  
/>
        
<TextField 
  fullWidth 
  select 
  label="Consultation Type" 
  name="consultationType" 
  value={formData.consultationType} 
  onChange={(e) => {
    handleChange(e);
    setConsultationError(""); // Clears error when a selection is made
  }}
  margin="normal" 
  required 
  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
  error={isSubmitted && !formData.consultationType}
  helperText={isSubmitted && !formData.consultationType ? consultationError : ""} 
>
  {consultationTypes.map((option) => (
    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
  ))}
</TextField>
        
<TextField 
  fullWidth 
  label="Remark" 
  name="remark" 
  value={formData.remark} 
  onChange={(e) => {
    if (e.target.value.length <= 50) {
      handleChange(e); // Update state only if within limit
    }
  }} 
  margin="normal" 
  multiline 
  rows={3} 
  sx={{ bgcolor: "#fff", borderRadius: "8px" }} 
  error={formData.remark.length > 50}
  helperText={formData.remark.length > 50 ? "Maximum 50 characters allowed." : ""}
/>
        
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              onClick={() => setIsSubmitted(true)}
              sx={{
                mt: 3,
                backgroundColor: "#8C1C40",
                width: "220px",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "10px",
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": { backgroundColor: "#70132E", transform: "scale(1.05)" },
              }}
            >
              Submit
            </Button>
          </form>
        </Card>
        
      )}

      {/* Confirmation Modal */}
      <Dialog 
  open={showConfirmationModal} 
  onClose={handleCancelAppointment} 
  sx={{ "& .MuiDialog-paper": { borderRadius: "12px", padding: "16px", minWidth: "400px" } }}
>
  {/* Dialog Title */}
  <DialogTitle sx={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", pb: 1 }}>
    Confirm Your Appointment
  </DialogTitle>

  {/* Dialog Content */}
  <DialogContent sx={{ textAlign: "center", px: 3, pb: 2 }}>
    <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
      📅 Date: 
      <Typography component="span" sx={{ fontWeight: "normal", ml: 1 }}>
        {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No date selected"}
      </Typography>
    </Typography>

    <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "bold", color: "#333", mt: 1 }}>
      ⏰ Time: 
      <Typography component="span" sx={{ fontWeight: "normal", ml: 1 }}>
        {selectedTimeSlot || "No time selected"}
      </Typography>
    </Typography>

    <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "bold", color: "#333", mt: 1 }}>
      👨‍⚖️ Lawyer: 
      <Typography component="span" sx={{ fontWeight: "normal", ml: 1 }}>
        {lawyer?.name || "Not assigned"}
      </Typography>
    </Typography>
  </DialogContent>

  {/* Dialog Actions */}
  <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
    <Button 
      onClick={handleConfirmAppointment} 
      variant="contained" 
      sx={{
        backgroundColor: "#4CAF50",
        color: "white",
        fontWeight: "bold",
        width: "120px",
        borderRadius: "8px",
        "&:hover": { backgroundColor: "#388E3C", transform: "scale(1.05)" },
      }}
    >
      ✅ Confirm
    </Button>

    <Button 
      onClick={handleCancelAppointment} 
      variant="contained" 
      sx={{
        backgroundColor: "#D32F2F",
        color: "white",
        fontWeight: "bold",
        width: "120px",
        borderRadius: "8px",
        "&:hover": { backgroundColor: "#B71C1C", transform: "scale(1.05)" },
      }}
    >
      ❌ Cancel
    </Button>
  </DialogActions>
</Dialog>


      {/* Success Dialog */}
      <Dialog 
  open={showSuccessDialog} 
  onClose={handleCloseSuccessDialog} 
  sx={{ "& .MuiDialog-paper": { borderRadius: "12px", padding: "20px", minWidth: "400px" } }}
>
  {/* Dialog Title with Icon */}
  <DialogTitle sx={{ textAlign: "center", fontSize: "22px", fontWeight: "bold", color: "#4CAF50", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
    🎉 Appointment Confirmed!
  </DialogTitle>

  {/* Dialog Content */}
  <DialogContent sx={{ textAlign: "center", px: 3, pb: 2 }}>
    <Typography variant="body1" sx={{ fontSize: "16px", color: "#444" }}>
      Your virtual consultation has been successfully booked.  
      A confirmation email with the Zoom link has been sent.  
      You can view or manage your appointment anytime.
    </Typography>
  </DialogContent>

  {/* Dialog Actions */}
  <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
  <Button 
  onClick={() => { 
    handleCloseSuccessDialog();
    setTimeout(() => {
      navigate(`/appointment/${consultationResult.consultationId}`);
    }, 100);
  }} 
  variant="contained" 
  sx={{
    backgroundColor: "#1976D2",
    color: "white",
    fontWeight: "bold",
    width: "200px",  // Increased width
    borderRadius: "8px",
    "&:hover": { backgroundColor: "#1565C0", transform: "scale(1.05)" },
  }}
>
  📅 View Appointment
</Button>


    <Button 
      onClick={handleCloseSuccessDialog} 
      variant="contained" 
      sx={{
        backgroundColor: "#D32F2F",
        color: "white",
        fontWeight: "bold",
        width: "120px",
        borderRadius: "8px",
        "&:hover": { backgroundColor: "#B71C1C", transform: "scale(1.05)" },
      }}
    >
      ❌ Close
    </Button>
  </DialogActions>
</Dialog>


    </Container>
  );
};

export default Consultation;