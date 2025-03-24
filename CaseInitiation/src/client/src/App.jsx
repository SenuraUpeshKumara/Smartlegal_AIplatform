import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterLegalCase from './pages/RegisterLegalCase';

const App = () => {
  return (
    <div>

      <ToastContainer />
      <Routes>
        <Route path='/client/register-legal-case' element={<RegisterLegalCase />} />
      </Routes>
    </div>
  )
}

export default App
