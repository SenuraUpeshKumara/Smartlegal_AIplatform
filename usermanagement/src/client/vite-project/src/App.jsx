import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Adminhome from './pages/Adminhome'
import Navbar from './pages/Navbar'
import Register from './pages/Register'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/adminhome' element={<Adminhome/>}/>
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default App
