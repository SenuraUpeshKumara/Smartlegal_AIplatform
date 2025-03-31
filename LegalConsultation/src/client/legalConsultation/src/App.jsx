import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./pages/header";// Import the Header
import ConsultationForm from "./pages/consultationForm";
import Team from "./pages/team";
import Profile from "./pages/profile";
import Consultation from "./pages/consultation";
import ViewAppointment from "./pages/viewAppointment";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header /> {/* Include Header here */}
      
      <Routes>
        <Route path="/" element={<Team />} />
        <Route path="/team" element={<Team />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/appointment/:id" element={<ViewAppointment />} />
        <Route path="/consultation-form" element={<ConsultationForm />} /> {/* Added this route */}
      </Routes>
    </Router>
  );
}

export default App;
