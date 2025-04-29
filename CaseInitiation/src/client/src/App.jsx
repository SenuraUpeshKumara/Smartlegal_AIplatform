import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterLegalCase from './pages/FileCase/RegisterLegalCase';
import ViewCaseDetails from './pages/FileCase/ViewCaseDetails';
import UpdateLegalCase from './pages/FileCase/UpdateLegalCase';
import AllLegalCases from './pages/FileCase/AllLegalCases';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/add-legal-case' element={<RegisterLegalCase />} />
        <Route path='/view-legal-case/:id' element={<ViewCaseDetails />} />
        <Route path="/update-case-details/:id" element={<UpdateLegalCase/>} />
        <Route path="/all-legal-cases" element={<AllLegalCases/>} />
      </Routes>
    </div>
  );
};

export default App;