import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

const ViewAppointment = () => {
  const { id } = useParams(); // Get appointment ID from URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // To store error or success messages

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!id) {
        console.error("No ID found in URL params");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/consultation/get/${id}`);
        const text = await response.text(); // Log raw response as text
        console.log("Raw response:", text);

        const data = JSON.parse(text); // Parse the response
        console.log("Parsed JSON:", data);

        if (response.ok && data.success) {
          setAppointment(data.consultation);
        } else {
          console.error("Error fetching appointment:", data.message || "Failed to fetch appointment details");
          setMessage({ type: "error", text: data.message || "Failed to fetch appointment details" });
        }
      } catch (error) {
        console.error("Network error:", error.message || "Unknown error");
        setMessage({ type: "error", text: "Network error. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleReschedule = () => {
    navigate(`/consultation/reschedule/${id}`);
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await fetch(`http://localhost:8000/consultation/cancel/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Appointment canceled successfully.");
          navigate("/appointments"); // Redirect to appointment list
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5">Appointment details not found!</Typography>
        {message && (
          <Typography variant="body1" color={message.type === "error" ? "error" : "primary"}>
            {message.text}
          </Typography>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, textAlign: "center", mt: 5 }}>
        <Typography variant="h5" fontWeight="bold">Appointment Details</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 3, textAlign: "left" }}>
          <Typography variant="body1"><strong>Full Name:</strong> {appointment.fullName}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {appointment.email}</Typography>
          <Typography variant="body1"><strong>Phone Number:</strong> {appointment.phoneNumber}</Typography>
          <Typography variant="body1"><strong>Consultation Type:</strong> {appointment.consultationType}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>Remark:</strong> {appointment.remark ? appointment.remark : "No remark"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleReschedule} sx={{ borderRadius: "20px" }}>
            Reschedule
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel} sx={{ borderRadius: "20px" }}>
            Cancel
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ViewAppointment;
