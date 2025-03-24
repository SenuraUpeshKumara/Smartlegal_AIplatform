import React from "react";
import "../component/styles/Lawyer.css";

const Lawyer = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Lawyer Dashboard</h2>
      <div className="button-container">
        <button className="dashboard-button">View Available Time Slots</button>
        <button className="dashboard-button">View Scheduled Appointments</button>
      </div>
    </div>
  );
};

export default Lawyer;
