import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterLegalCase from './pages/RegisterLegalCase';
import ViewCaseDetails from './pages/ViewCaseDetails';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<RegisterLegalCase />} />
        <Route path='/view-legal-case/:id' element={<ViewCaseDetails />} />
      </Routes>
    </div>
  );
};

export default App;